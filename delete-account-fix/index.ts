
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "POST required" }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Login required" }, { status: 401 });
  }

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data: authData, error: authError } =
    await userClient.auth.getUser();

  if (authError || !authData.user) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const user = authData.user;
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Collect contact details before disabling the account.
  const { data: profile } = await admin
    .from("load_profiles")
    .select("display_name, phone, photo_path")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: legacyProfile } = await admin
    .from("profiles")
    .select("full_name, phone")
    .eq("user_id", user.id)
    .maybeSingle();

  const email = user.email ?? null;
  const phone = profile?.phone ?? legacyProfile?.phone ?? user.phone ?? null;

  // Preserve email and phone in the restricted archive.
  const { error: archiveError } = await admin
    .from("deleted_account_archive")
    .insert({
      original_user_id: user.id,
      email,
      phone,
      archived_at: new Date().toISOString(),
      reason: "account_deletion",
    });

  if (archiveError) {
    console.error("Archive failed", archiveError);
    return Response.json(
      { error: "Could not securely archive account details" },
      { status: 500 },
    );
  }

  // Collect private document paths before deleting KYC rows.
  const paths = new Set<string>();

  const { data: kycRows, error: kycReadError } = await admin
    .from("kyc_records")
    .select("document_path, document_back_path, photo_path")
    .eq("user_id", user.id);

  if (kycReadError) {
    return Response.json({ error: "Could not read KYC records" }, { status: 500 });
  }

  for (const row of kycRows ?? []) {
    for (const path of [
      row.document_path,
      row.document_back_path,
      row.photo_path,
    ]) {
      if (path) paths.add(path);
    }
  }

  const { data: docs, error: docsReadError } = await admin
    .from("kyc_documents")
    .select("storage_path")
    .eq("user_id", user.id);

  if (docsReadError) {
    return Response.json({ error: "Could not read private documents" }, { status: 500 });
  }

  for (const doc of docs ?? []) {
    if (doc.storage_path) paths.add(doc.storage_path);
  }

  if (paths.size > 0) {
    const { error: storageError } = await admin.storage
      .from("kyc-private")
      .remove([...paths]);

    if (storageError) {
      console.error("Storage deletion failed", storageError);
      return Response.json(
        { error: "Could not remove private files; account not disabled" },
        { status: 500 },
      );
    }
  }

  // Remove profile photo from its own bucket.
  if (profile?.photo_path) {
    const { error: profilePhotoError } = await admin.storage
      .from("load-profile-photos")
      .remove([profile.photo_path]);

    if (profilePhotoError) {
      console.error("Profile photo deletion failed", profilePhotoError);
      return Response.json(
        { error: "Could not remove profile photo; account not disabled" },
        { status: 500 },
      );
    }
  }

  // Remove personal profile and identity-verification records.
  const cleanupSteps = [
    () => admin.from("kyc_documents").delete().eq("user_id", user.id),
    () => admin.from("kyc_records").delete().eq("user_id", user.id),
    () => admin.from("admin_applications").delete().eq("user_id", user.id),
    () => admin.from("load_profiles").delete().eq("user_id", user.id),
    () => admin.from("profiles").delete().eq("user_id", user.id),
  ];

  for (const cleanup of cleanupSteps) {
    const { error } = await cleanup();
    if (error) {
      console.error("Personal-data cleanup failed", error);
      return Response.json(
        { error: "Personal data cleanup incomplete; account not disabled" },
        { status: 500 },
      );
    }
  }

  // Keep transaction records and their user IDs; soft-delete the Auth account.
  const { error: deleteError } =
    await admin.auth.admin.deleteUser(user.id, true);

  if (deleteError) {
    console.error("Auth soft-delete failed", deleteError);
    return Response.json(
      { error: "Account could not be disabled; archive and cleanup may already exist" },
      { status: 500 },
    );
  }

  return Response.json({
    success: true,
    message: "Account disabled; transaction history retained",
  });
});
