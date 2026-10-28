import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from './supabase.js';
import './style.css';
import NearbyVehicleMap from './src/VehicleMap.jsx';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';


function SupportInbox({ supabase, uid, refresh, setMessage }) {
  const [items, setItems] = useState([]);
  const [replies, setReplies] = useState({});
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('support_conversations')
        .select('id, subject, category, status, created_at, updated_at')
        .order('updated_at', { ascending: false });
      if (!active) return;
      if (error) { setMessage('अनुरोध लोड भएन: ' + error.message); return; }
      const rows = data || [];
      const result = await Promise.all(rows.map(async c => {
        const { data: msgs, error: me } = await supabase
          .from('support_messages')
          .select('id, sender_id, body, created_at')
          .eq('conversation_id', c.id)
          .order('created_at', { ascending: true });
        return { ...c, messages: me ? [] : (msgs || []) };
      }));
      if (active) setItems(result);
    })();
    return () => { active = false; };
  }, [supabase, uid, refresh]);

  async function send(c) {
    const body = (drafts[c.id] || '').trim();
    if (!body || busy) return;
    setBusy(true);
    const { error } = await supabase.from('support_messages').insert({
      conversation_id: c.id, sender_id: uid || null, body
    });
    setBusy(false);
    if (error) { setMessage('जवाफ पठाउन सकिएन: ' + error.message); return; }
    setDrafts(old => ({...old, [c.id]: ''}));
    setMessage('सन्देश पठाइयो।');
    setReplies(old => ({...old, [c.id]: Date.now()}));
    const { data } = await supabase.from('support_messages')
      .select('id, sender_id, body, created_at')
      .eq('conversation_id', c.id).order('created_at', {ascending:true});
    if (data) setItems(old => old.map(x => x.id === c.id ? {...x, messages:data} : x));
  }

  return <div>
    {items.length === 0 && <p>अहिलेसम्म सहायता अनुरोध छैन।</p>}
    {items.map(c => <section key={c.id} style={{border:'1px solid #ddd',borderRadius:12,padding:12,margin:'12px 0'}}>
      <b>{c.subject}</b>
      <p>प्रकार: {c.category} · स्थिति: {c.status === 'resolved' ? 'समाधान भयो' : c.status === 'in_progress' ? 'काम हुँदैछ' : 'खुला'}</p>
      {c.messages.map(m => <div key={m.id} style={{background:m.sender_id===uid?'#fff0df':'#eef5ff',padding:10,borderRadius:8,margin:'8px 0'}}>
        <small>{m.sender_id===uid?'तपाईं':'Admin'} · {new Date(m.created_at).toLocaleString()}</small>
        <p style={{whiteSpace:'pre-wrap',margin:'6px 0'}}>{m.body}</p>
      </div>)}
      {c.status !== 'resolved' && <>
        <textarea value={drafts[c.id] || ''} onChange={e=>setDrafts(old=>({...old,[c.id]:e.target.value}))} placeholder="थप सन्देश लेख्नुहोस्" rows={2} style={{width:'100%',boxSizing:'border-box',padding:10}} />
        <button type="button" className="primary" disabled={busy} onClick={()=>send(c)}>सन्देश पठाउनुहोस्</button>
      </>}
    </section>)}
  </div>;
}


function AdminSupportPanel({ supabase }) {
  const [items, setItems] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from('support_conversations')
      .select('id, user_id, subject, category, status, created_at')
      .order('created_at', { ascending: false });
    if (error) { setNotice('गुनासो लोड भएन: ' + error.message); return; }

    const rows = await Promise.all((data || []).map(async c => {
      const { data: messages, error: me } = await supabase
        .from('support_messages')
        .select('id, sender_id, body, created_at')
        .eq('conversation_id', c.id)
        .order('created_at', { ascending: true });
      return { ...c, messages: me ? [] : (messages || []) };
    }));
    setItems(rows);
    setNotice('');
  }

  useEffect(() => { load(); }, []);

  async function reply(c) {
    const body = (drafts[c.id] || '').trim();
    if (!body || busy) return;
    setBusy(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) { setNotice('Admin लगइन आवश्यक छ।'); setBusy(false); return; }

    const { error } = await supabase.from('support_messages').insert({
      conversation_id: c.id, sender_id: uid || null, body
    });
    setBusy(false);
    if (error) { setNotice('जवाफ पठाउन सकिएन: ' + error.message); return; }

    await supabase.from('support_conversations')
      .update({ status: c.status === 'resolved' ? 'resolved' : 'in_progress' })
      .eq('id', c.id);

    setDrafts(old => ({ ...old, [c.id]: '' }));
    setNotice('जवाफ पठाइयो।');
    await load();
  }

  async function changeStatus(c, status) {
    const { error } = await supabase.from('support_conversations')
      .update({ status }).eq('id', c.id);
    if (error) { setNotice('स्थिति बदल्न सकिएन: ' + error.message); return; }
    setNotice('स्थिति परिवर्तन भयो।');
    await load();
  }

  return <section style={{border:'1px solid #ddd',borderRadius:12,padding:12,margin:'16px 0'}}>
    <h3>ग्राहक सहायता / गुनासो व्यवस्थापन</h3>
    <button type="button" onClick={load}>गुनासो रिफ्रेस गर्नुहोस्</button>
    {notice && <p role="status">{notice}</p>}
    {items.length === 0 && <p>गुनासो छैन वा लोड हुँदैछ।</p>}
    {items.map(c => <details key={c.id} style={{border:'1px solid #ddd',borderRadius:10,padding:10,margin:'10px 0'}}>
      <summary style={{fontWeight:700,cursor:'pointer'}}>{c.subject} · {c.status}</summary>
      <p>प्रकार: {c.category} · ग्राहक ID: {c.user_id}</p>
      <p>दर्ता: {new Date(c.created_at).toLocaleString()}</p>
      {c.messages.map(m => <div key={m.id} style={{background:m.sender_id===c.user_id?'#fff0df':'#eef5ff',padding:10,borderRadius:8,margin:'8px 0'}}>
        <small>{m.sender_id===c.user_id?'ग्राहक':'Admin'} · {new Date(m.created_at).toLocaleString()}</small>
        <p style={{whiteSpace:'pre-wrap',margin:'6px 0'}}>{m.body}</p>
      </div>)}
      <label>स्थिति
        <select value={c.status} onChange={e=>changeStatus(c,e.target.value)} style={{display:'block',width:'100%',padding:10,margin:'6px 0 12px'}}>
          <option value="open">Open / खुला</option>
          <option value="in_progress">In Progress / काम हुँदैछ</option>
          <option value="resolved">Resolved / समाधान भयो</option>
        </select>
      </label>
      <textarea value={drafts[c.id] || ''} onChange={e=>setDrafts(old=>({...old,[c.id]:e.target.value}))} placeholder="ग्राहकलाई जवाफ लेख्नुहोस्" rows={3} style={{display:'block',width:'100%',boxSizing:'border-box',padding:10}} />
      <button type="button" className="primary" disabled={busy} onClick={()=>reply(c)}>जवाफ पठाउनुहोस्</button>
    </details>)}
  </section>;
}

function App() {
  const [page, setPage] = useState('home');
  const [adminKycFilter, setAdminKycFilter] = useState('all');
  const [adminKycSearch, setAdminKycSearch] = useState('');
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');
  const [adminLoads, setAdminLoads] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersSearch, setAdminUsersSearch] = useState('');
  const [adminPayments, setAdminPayments] = useState([]);
  const [adminDisputes, setAdminDisputes] = useState([]);
  const [adminSupportPendingCount, setAdminSupportPendingCount] = useState(null);
  const [adminBookings, setAdminBookings] = useState([]);
  const [adminOperationsMessage, setAdminOperationsMessage] = useState('');
  const [adminOperationsSearch, setAdminOperationsSearch] = useState('');
  const [adminOperationsFilter, setAdminOperationsFilter] = useState('all');

  const [loads, setLoads] = useState([]);
  const [clockNow, setClockNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setClockNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLoads = async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('id, owner_id, origin, destination, cargo, weight, proposed_price, status, created_at, expires_at')
        .eq('status', 'open')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      if (!error && data) {
        setLoads(data.map(l => ({
          ...l,
          price: l.proposed_price
        })));
      }
    };
    fetchLoads();
    const refreshTimer = setInterval(fetchLoads, 30000);
    return () => clearInterval(refreshTimer);
  }, []);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  const [language, setLanguage] = useState(() => localStorage.getItem('load_language') || 'नेपाली');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const [welcomeAction, setWelcomeAction] = useState('');
  const [navHistory, setNavHistory] = useState([]);
  const [role, setRole] = useState('');
  const [roleCategory, setRoleCategory] = useState('');
  const [roleType, setRoleType] = useState(() => localStorage.getItem('load_role_type') || '');
  const [authStep, setAuthStep] = useState('details');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [kycFrontFile, setKycFrontFile] = useState(null);
  const [kycPhotoFile, setKycPhotoFile] = useState(null);
  const [kycBackFile, setKycBackFile] = useState(null);
  const [kycExtraDocs, setKycExtraDocs] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [vehicleBookings, setVehicleBookings] = useState([]);
  const [vehicleBookingsError, setVehicleBookingsError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');
  const [chatError, setChatError] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !currentUserId) return;
    let active = true;
    const setupPush = async () => {
      try {
        let permission = await PushNotifications.checkPermissions();
        if (permission.receive !== 'granted') {
          permission = await PushNotifications.requestPermissions();
        }
        if (permission.receive !== 'granted' || !active) return;
        await PushNotifications.addListener('registration', token => {
          console.log('Load push token:', token.value);
        });
        await PushNotifications.addListener('registrationError', error => {
          console.error('Load push registration error:', error);
        });
        await PushNotifications.register();
      } catch (error) {
        console.error('Load push setup error:', error);
      }
    };
    setupPush();
    return () => {
      active = false;
      PushNotifications.removeAllListeners();
    };
  }, [currentUserId]);

  const [accountKycStatus, setAccountKycStatus] = useState('लोड हुँदैछ...');
  const [accountKycNote, setAccountKycNote] = useState('');
  const [isAppAdmin, setIsAppAdmin] = useState(false);
  const [isRootAdmin, setIsRootAdmin] = useState(false);
  const [kycCheckComplete, setKycCheckComplete] = useState(false);

  useEffect(() => {
    if (authStep !== 'complete') {
      setKycCheckComplete(false);
      return;
    }
    if (!role || page === 'admin-application' || page.startsWith('settings-admin')) return;
    setKycCheckComplete(false);
    let active = true;
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) return;
        const { data: admin, error: adminError } = await supabase.rpc('is_app_admin');
      const { data: rootAdmin, error: rootError } = await supabase.rpc('is_root_admin');
      if (!active) return;
      const isRoot = auth.user.id === '0cff7068-0096-4032-8983-a70839aa064e' || (!rootError && rootAdmin === true);
      const hasAdminAccess = (!adminError && admin === true) || isRoot;
      if (hasAdminAccess) {
        setIsAppAdmin(true);
        setIsRootAdmin(isRoot);
        setKycCheckComplete(true);
        return;
      }
      setIsAppAdmin(false);
      setIsRootAdmin(false);

      const { data: approvedRows, error: approvedError } = await supabase
          .from('kyc_records')
          .select('status, admin_note, created_at')
          .eq('user_id', auth.user.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(1);
        if (approvedError) throw approvedError;
        if (!active) return;
        if (approvedRows?.length) {
          setAccountKycStatus('स्वीकृत (Approved)');
          setAccountKycNote(approvedRows[0].admin_note || '');
          setKycCheckComplete(true);
          if (page === 'kyc' || page === 'kyc-pending') setPage('home');
          return;
        }

        const { data, error } = await supabase.from('kyc_records')
          .select('status, admin_note, created_at')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false }).limit(1);
        if (error) throw error;
        if (!active) return;

        const k = data?.[0];
        const status = k?.status || '';
        setAccountKycStatus(!k ? 'कागजात पेश गरिएको छैन' :
          ({pending:'प्रतीक्षामा (Pending)', approved:'स्वीकृत (Approved)', rejected:'अस्वीकृत (Rejected)'}[status] || status || 'अज्ञात'));
        setAccountKycNote(k?.admin_note || '');

        if (!k) {
        if (page !== 'kyc') setPage('kyc');
      } else if (status === 'pending') {
        if (page !== 'kyc-pending') setPage('kyc-pending');
      } else if (status === 'rejected') {
        if (page !== 'kyc') setPage('kyc');
      } else if (status === 'approved') {
        if (page === 'kyc' || page === 'kyc-pending') setPage('home');
      } else {
        if (page !== 'kyc-pending') setPage('kyc-pending');
      }
      setKycCheckComplete(true);
      } catch (err) {
        if (active) {
          setMessage('KYC स्थिति जाँच्न सकिएन: ' + (err.message || 'त्रुटि'));
          setPage('kyc-pending');
          setKycCheckComplete(true);
        }
      }
    })();
    return () => { active = false; };
  }, [authStep, role, page]);

  const [adminKyc, setAdminKyc] = useState([]);
  const [adminKycDocuments, setAdminKycDocuments] = useState([]);
  const [adminApplications, setAdminApplications] = useState([]);
  const [adminApplicationsMessage, setAdminApplicationsMessage] = useState('');
  const [adminStats, setAdminStats] = useState(null);
  const [adminKycMessage, setAdminKycMessage] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginMessage, setAdminLoginMessage] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminApplicationForm, setAdminApplicationForm] = useState({full_name:'',address:'',phone:'',email:'',responsibilityAccepted:false,id_type:'Citizenship',id_number:'',father_name:'',mother_name:'',grandfather_name:'',application_reason:'',work_plan:''});
  const [adminApplicantPhoto, setAdminApplicantPhoto] = useState(null);
  const [adminDocumentFront, setAdminDocumentFront] = useState(null);
  const [adminDocumentBack, setAdminDocumentBack] = useState(null);
  const [adminApplicationMessage, setAdminApplicationMessage] = useState('');
  const [adminApplicationBusy, setAdminApplicationBusy] = useState(false);

  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');

  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileStatus, setProfileStatus] = useState('active');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [providerVehicle, setProviderVehicle] = useState({});


  useEffect(() => {
    if (page !== 'loads' && page !== 'truck') return;
    let active = true;
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) return;
        const { data: profile } = await supabase.from('load_profiles')
          .select('display_name,phone').eq('user_id', auth.user.id).maybeSingle();
        const { data: kyc } = await supabase.from('kyc_records')
          .select('id').eq('user_id', auth.user.id).eq('status', 'approved')
          .order('created_at', { ascending: false }).limit(1).maybeSingle();
        let v = {};
        if (kyc?.id) {
          const { data: docs } = await supabase.from('kyc_documents')
            .select('document_kind,details').eq('kyc_record_id', kyc.id);
          const d = (docs || []).find(x => x.document_kind === 'vehicle_bluebook');
          v = d?.details || {};
        }
        if (active) setProviderVehicle({
          name: profile?.display_name || '',
          phone: profile?.phone || '',
          number: v.vehicle_number || '',
          type: v.vehicle_type || '',
          capacity: v.load_capacity || '',
          unit: v.capacity_unit || 'ton'
        });
      } catch (e) {
        if (active) setMessage('KYC विवरण लोड भएन: ' + e.message);
      }
    })();
    return () => { active = false; };
  }, [page, role, authStep]);

  useEffect(() => {
    if (page !== 'profile' && page !== 'settings-account') return;
    let active = true;
    (async () => {
      try {
        const { data: auth, error: ae } = await supabase.auth.getUser();
        if (ae || !auth.user) return;
        const { data, error } = await supabase
          .from('load_profiles')
          .select('display_name, phone, email, account_status, photo_path')
          .eq('user_id', auth.user.id)
          .maybeSingle();
        if (error) throw error;

        const { data: kycRows, error: kycError } = await supabase
          .from('kyc_records')
          .select('full_name, phone, address, address_province, address_district, address_local_level, address_ward, address_tole, status, created_at')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (kycError) throw kycError;
        if (!active) return;

        const kyc = kycRows?.[0];
        const kycAddress = kyc?.address || [
          kyc?.address_province,
          kyc?.address_district,
          kyc?.address_local_level,
          kyc?.address_ward ? 'वडा ' + kyc.address_ward : '',
          kyc?.address_tole
        ].filter(Boolean).join(', ');

        setProfileName(data?.display_name || kyc?.full_name || '');
        setProfilePhone(data?.phone || kyc?.phone || '');
        setProfileAddress(kycAddress);
        setProfileEmail(auth.user.email || data?.email || '');
        setProfileStatus(data?.account_status || 'active');
        if (data?.photo_path) {
          const { data: urlData } = supabase.storage
            .from('load-profile-photos').getPublicUrl(data.photo_path);
          setProfilePhotoUrl(urlData.publicUrl);
        } else {
          setProfilePhotoUrl('');
        }
      } catch (err) {
        if (active) setMessage('प्रोफाइल लोड भएन: ' + (err.message || 'त्रुटि'));
      }
    })();
    return () => { active = false; };
  }, [page]);
  const [historyLoads, setHistoryLoads] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [historyError, setHistoryError] = useState('');


  useEffect(() => {
    if (page !== 'settings-history') return;
    let active = true;
    (async () => {
      setHistoryError('');
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        if (active) setHistoryError('इतिहास हेर्न पहिले लगइन गर्नुहोस्।');
        return;
      }
      const uid = auth.user.id;
      const [loadsResult, bookingsResult] = await Promise.all([
        supabase.from('loads')
          .select('id,origin,destination,cargo,weight,proposed_price,status,created_at,expires_at')
          .eq('owner_id', uid).order('created_at', { ascending: false }),
        supabase.from('load_bookings')
          .select('id,load_id,customer_id,driver_id,status,created_at,updated_at,completed_at,actual_distance_km,actual_fare')
          .or(`customer_id.eq.${uid},driver_id.eq.${uid}`)
          .in('status', ['completed', 'cancelled'])
          .order('created_at', { ascending: false })
      ]);
      if (!active) return;
      if (loadsResult.error || bookingsResult.error) {
        setHistoryError('इतिहास लोड भएन: ' + (loadsResult.error?.message || bookingsResult.error?.message));
        return;
      }
      setHistoryLoads(loadsResult.data || []);
      setHistoryBookings(bookingsResult.data || []);
    })();
    return () => { active = false; };
  }, [page]);


  useEffect(() => {
    const finishLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const savedRole = localStorage.getItem('load_role');
        if (savedRole) setRole(savedRole);
        if (session.user?.id === '0cff7068-0096-4032-8983-a70839aa064e') {
          setIsAppAdmin(true);
          setIsRootAdmin(true);
          setKycCheckComplete(true);
          setAccountKycStatus('स्वीकृत (Approved)');
        }
        setAuthStep('complete');
      }
    };
    finishLogin();
    const appUrlListener = CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (!url || !url.startsWith('com.load.logistics://login-callback')) return;
      try {
        await Browser.close();
        const callbackUrl = new URL(url);
        const hashParams = new URLSearchParams(callbackUrl.hash.replace(/^#/, ''));
        const code = callbackUrl.searchParams.get('code');
        const oauthError = callbackUrl.searchParams.get('error_description')
          || callbackUrl.searchParams.get('error')
          || hashParams.get('error_description')
          || hashParams.get('error');
        if (oauthError) {
          setAuthMessage('Google Login समस्या: ' + oauthError);
          return;
        }
        let authResult;
        if (code) {
          authResult = await supabase.auth.exchangeCodeForSession(code);
        } else {
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          if (!access_token || !refresh_token) {
            setAuthMessage('Google Login समस्या: callback मा आवश्यक session जानकारी आएन।');
            return;
          }
          authResult = await supabase.auth.setSession({ access_token, refresh_token });
        }
        if (authResult.error) {
          setAuthMessage('Google Login समस्या: ' + authResult.error.message);
        } else {
          setAuthMessage('');
        }
      } catch (error) {
        setAuthMessage('Google Login समस्या: ' + error.message);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setShowResetPassword(true);
          setAuthMessage('नयाँ पासवर्ड राख्नुहोस्।');
          setWelcomeAction('login');
          setAuthStep('details');
          return;
        }
        if (session) {
          const savedRole = localStorage.getItem('load_role');
          if (savedRole) setRole(savedRole);
          if (session.user?.id === '0cff7068-0096-4032-8983-a70839aa064e') {
            setIsAppAdmin(true);
            setIsRootAdmin(true);
            setKycCheckComplete(true);
            setAccountKycStatus('स्वीकृत (Approved)');
          }
          setAuthStep('complete');
        }
      }
    );
    return () => { subscription.unsubscribe(); appUrlListener.then(listener => listener.remove()); };
  }, []);


  // LOAD_NOTIFICATIONS_EFFECT
  useEffect(() => {

    let active = true;
    let channel;
    (async () => {
      setNotificationsError('');
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        if (active) setNotificationsError('पहिले लगइन गर्नुहोस्।');
        return;
      }
      const userId = auth.user.id;
      const { data, error } = await supabase.from('load_notifications')
        .select('id,type,title_key,body_key,booking_id,is_read,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (!active) return;
      if (error) setNotificationsError('सूचना लोड भएन: ' + error.message);
      else setNotifications(data || []);

      channel = supabase.channel('load-notifications-' + userId)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'load_notifications',
          filter: 'user_id=eq.' + userId
        }, (payload) => {
          if (active) setNotifications(old =>
            [payload.new, ...old.filter(n => n.id !== payload.new.id)].slice(0, 50)
          );
        })
        .subscribe();
    })();
    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [page]);

  const translations = {
    'English': {
      'तपाईंको ढुवानी, अब सजिलो!':'Your transport, made easy!',
      'लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।':'Find loads. Connect vehicles. Manage documents.',
      'तपाईंलाई के चाहिएको छ?':'What do you need?',
      'ढुवानीका लागि गाडी खोज्नुहोस्':'Find a Vehicle for Goods','नयाँ सामान ढुवानीको विवरण':'New shipment details',
      'गाडीका लागि लोड खोज्नुहोस्':'Find Loads for a Vehicle','उपलब्ध ढुवानीका कामहरू':'Available shipments',
      'गाडी दर्ता गर्नुहोस्':'Register Vehicle','गाडी र क्षमता विवरण':'Vehicle and capacity details',
      'ड्राइभरको लाइसेन्स':'Driver Licence','लाइसेन्स विवरण र फोटो':'Licence details and photo',
      'गाडीको ब्लुबुक':'Vehicle Registration','गाडी दर्ता कागजात':'Vehicle registration document',
      'गाडीको इन्सुरेन्स':'Vehicle Insurance','बीमा पोलिसी र म्याद':'Policy and expiry date',
      'कम्पनीको विवरण':'Company Details','कम्पनीको नाम र दर्ता':'Company name and registration',
      'भाडाको चलानी':'Freight Waybill','ढुवानी चलानी तयार गर्नुहोस्':'Create a shipment waybill',
      'नयाँ लोडको विवरण':'New Load Details','उपलब्ध लोडहरू':'Available Loads',
      'गाडीको विवरण':'Vehicle Details','ढुवानी / भाडाको चलानी':'Shipment / Freight Waybill',
      'लोड दिने व्यक्ति/कम्पनी':'Sender / Company','सामान कहाँबाट उठाउने?':'Pickup Location',
      'सामान कहाँ पुर्‍याउने?':'Delivery Location','सामानको नाम':'Cargo Description',
      'तौल (टन/केजी)':'Weight (ton/kg)','प्रस्तावित भाडा (रु.)':'Proposed Freight (NPR)',
      'सम्पर्क नम्बर':'Contact Number','गाडी नम्बर':'Vehicle Number',
      'गाडीको प्रकार':'Vehicle Type','सामान बोक्ने क्षमता':'Load Capacity',
      'गाडी धनीको नाम':'Vehicle Owner','ड्राइभरको पूरा नाम':'Driver Full Name',
      'लाइसेन्स नम्बर':'Licence Number','लाइसेन्स वर्ग':'Licence Category',
      'म्याद सकिने मिति':'Expiry Date','लाइसेन्सको फोटो':'Licence Photo',
      'दर्ता/नवीकरण मिति':'Registration/Renewal Date','ब्लुबुकको फोटो':'Registration Document Photo',
      'बीमा कम्पनीको नाम':'Insurance Company','पोलिसी नम्बर':'Policy Number',
      'बीमा सुरु मिति':'Insurance Start Date','बीमा सकिने मिति':'Insurance Expiry Date',
      'बीमा कागजातको फोटो':'Insurance Document Photo','दर्ता नम्बर':'Registration Number',
      'कम्पनीको ठेगाना':'Company Address','इमेल':'Email','कम्पनी दर्ता कागजात':'Company Registration Document',
      'चलानी नम्बर':'Waybill Number','चलानी मिति':'Waybill Date',
      'पठाउने व्यक्ति/कम्पनी':'Sender','प्राप्त गर्ने व्यक्ति/कम्पनी':'Receiver',
      'सामानको विवरण':'Cargo Details','उठाउने स्थान':'Pickup Location',
      'पुर्‍याउने स्थान':'Delivery Location','भाडा रकम (रु.)':'Freight Amount (NPR)',
      'लोड सुरक्षित गर्नुहोस्':'Save Load','नयाँ लोड पोस्ट':'Post New Load',
      'गाडीको विवरण सुरक्षित गर्नुहोस्':'Save Vehicle Details',
      'विवरण सुरक्षित गर्नुहोस्':'Save Details','कम्पनीको विवरण सुरक्षित गर्नुहोस्':'Save Company Details',
      'चलानी सुरक्षित गर्नुहोस्':'Save Waybill','← मुख्य पृष्ठमा फर्कनुहोस्':'← Back to Home',
      'ढुवानीको सजिलो साथी':'Your transport partner',
      'विवरण यस एपमा सुरक्षित भयो।':'Details saved in this app.',
      'अहिलेसम्म लोड पोस्ट गरिएको छैन। सुरु गर्न तलको बटन थिच्नुहोस्.':'No loads posted yet. Tap below to start.',
      'लोड पोस्ट गरिएको छैन।':'No loads posted yet.',
    
      'मेरा बुकिङ': 'My Bookings',
      'बुकिङ सूची': 'Booking List',
      'Account': 'Account',
      'Privacy': 'Privacy',
      'Lists': 'Lists',
      'Storage and Data': 'Storage and Data',
      'App Language': 'App Language',
      'Help': 'Help',
      'City': 'City',
      'Request History': 'Request History',
      'Logout': 'Logout',},
    'हिन्दी': {
      'तपाईंको ढुवानी, अब सजिलो!':'आपकी ढुलाई, अब आसान!',
      'लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।':'लोड खोजें। वाहन जोड़ें। दस्तावेज़ व्यवस्थित रखें।',
      'तपाईंलाई के चाहिएको छ?':'आपको क्या चाहिए?',
      'ढुवानीका लागि गाडी खोज्नुहोस्':'लोड पोस्ट करें','नयाँ सामान ढुवानीको विवरण':'नई खेप का विवरण',
      'गाडीका लागि लोड खोज्नुहोस्':'लोड खोजें','उपलब्ध ढुवानीका कामहरू':'उपलब्ध ढुलाई के काम',
      'गाडी दर्ता गर्नुहोस्':'वाहन पंजीकृत करें','गाडी र क्षमता विवरण':'वाहन और क्षमता विवरण',
      'ड्राइभरको लाइसेन्स':'ड्राइवर लाइसेंस','लाइसेन्स विवरण र फोटो':'लाइसेंस विवरण और फोटो',
      'गाडीको ब्लुबुक':'वाहन पंजीकरण','गाडी दर्ता कागजात':'वाहन पंजीकरण दस्तावेज़',
      'गाडीको इन्सुरेन्स':'वाहन बीमा','बीमा पोलिसी र म्याद':'बीमा पॉलिसी और अवधि',
      'कम्पनीको विवरण':'कंपनी का विवरण','कम्पनीको नाम र दर्ता':'कंपनी का नाम और पंजीकरण',
      'भाडाको चलानी':'माल ढुलाई बिल','ढुवानी चलानी तयार गर्नुहोस्':'ढुलाई बिल बनाएँ',
      'नयाँ लोडको विवरण':'नए लोड का विवरण','उपलब्ध लोडहरू':'उपलब्ध लोड',
      'गाडीको विवरण':'वाहन का विवरण','ढुवानी / भाडाको चलानी':'ढुलाई / भाड़ा बिल',
      'लोड दिने व्यक्ति/कम्पनी':'लोड देने वाला / कंपनी','सामान कहाँबाट उठाउने?':'सामान कहाँ से लेना है?',
      'सामान कहाँ पुर्‍याउने?':'सामान कहाँ पहुँचाना है?','सामानको नाम':'सामान का नाम',
      'तौल (टन/केजी)':'वजन (टन/किलो)','प्रस्तावित भाडा (रु.)':'प्रस्तावित भाड़ा (रु.)',
      'सम्पर्क नम्बर':'संपर्क नंबर','गाडी नम्बर':'वाहन नंबर','गाडीको प्रकार':'वाहन का प्रकार',
      'सामान बोक्ने क्षमता':'लोड क्षमता','गाडी धनीको नाम':'वाहन मालिक का नाम',
      'ड्राइभरको पूरा नाम':'ड्राइवर का पूरा नाम','लाइसेन्स नम्बर':'लाइसेंस नंबर',
      'लाइसेन्स वर्ग':'लाइसेंस श्रेणी','म्याद सकिने मिति':'समाप्ति तिथि',
      'लाइसेन्सको फोटो':'लाइसेंस फोटो','दर्ता/नवीकरण मिति':'पंजीकरण/नवीनीकरण तिथि',
      'ब्लुबुकको फोटो':'पंजीकरण दस्तावेज़ फोटो','बीमा कम्पनीको नाम':'बीमा कंपनी का नाम',
      'पोलिसी नम्बर':'पॉलिसी नंबर','बीमा सुरु मिति':'बीमा शुरू होने की तारीख',
      'बीमा सकिने मिति':'बीमा समाप्ति तिथि','बीमा कागजातको फोटो':'बीमा दस्तावेज़ फोटो',
      'दर्ता नम्बर':'पंजीकरण नंबर','कम्पनीको ठेगाना':'कंपनी का पता','इमेल':'ईमेल',
      'कम्पनी दर्ता कागजात':'कंपनी पंजीकरण दस्तावेज़','चलानी नम्बर':'बिल नंबर',
      'चलानी मिति':'बिल की तारीख','पठाउने व्यक्ति/कम्पनी':'भेजने वाला',
      'प्राप्त गर्ने व्यक्ति/कम्पनी':'प्राप्तकर्ता','सामानको विवरण':'सामान का विवरण',
      'उठाउने स्थान':'पिकअप स्थान','पुर्‍याउने स्थान':'डिलीवरी स्थान',
      'भाडा रकम (रु.)':'भाड़ा राशि (रु.)','लोड सुरक्षित गर्नुहोस्':'लोड सेव करें',
      'नयाँ लोड पोस्ट':'नया लोड पोस्ट करें','गाडीको विवरण सुरक्षित गर्नुहोस्':'वाहन विवरण सेव करें',
      'विवरण सुरक्षित गर्नुहोस्':'विवरण सेव करें','कम्पनीको विवरण सुरक्षित गर्नुहोस्':'कंपनी विवरण सेव करें',
      'चलानी सुरक्षित गर्नुहोस्':'बिल सेव करें','← मुख्य पृष्ठमा फर्कनुहोस्':'← मुख्य पृष्ठ पर जाएँ',
      'ढुवानीको सजिलो साथी':'आपका ढुलाई साथी','विवरण यस एपमा सुरक्षित भयो।':'विवरण इस ऐप में सेव हुआ।',
    
      'मेरा बुकिङ': 'मेरी बुकिंग',
      'बुकिङ सूची': 'बुकिंग सूची',
      'Account': 'खाता',
      'Privacy': 'गोपनीयता',
      'Lists': 'सूचियाँ',
      'Storage and Data': 'स्टोरेज और डेटा',
      'App Language': 'ऐप की भाषा',
      'Help': 'मदद',
      'City': 'शहर',
      'Request History': 'अनुरोध इतिहास',
      'Logout': 'लॉग आउट',},
    '中文': {
      'तपाईंको ढुवानी, अब सजिलो!':'让货运更简单！',
      'लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।':'寻找货源、连接车辆、管理文件。',
      'तपाईंलाई के चाहिएको छ?':'您需要什么？',
      'ढुवानीका लागि गाडी खोज्नुहोस्':'发布货源','नयाँ सामान ढुवानीको विवरण':'新货运信息',
      'गाडीका लागि लोड खोज्नुहोस्':'寻找货源','उपलब्ध ढुवानीका कामहरू':'可用运输任务',
      'गाडी दर्ता गर्नुहोस्':'登记车辆','गाडी र क्षमता विवरण':'车辆及载重信息',
      'ड्राइभरको लाइसेन्स':'司机驾照','लाइसेन्स विवरण र फोटो':'驾照信息和照片',
      'गाडीको ब्लुबुक':'车辆登记证','गाडी दर्ता कागजात':'车辆登记文件',
      'गाडीको इन्सुरेन्स':'车辆保险','बीमा पोलिसी र म्याद':'保险单及有效期',
      'कम्पनीको विवरण':'公司信息','कम्पनीको नाम र दर्ता':'公司名称及注册信息',
      'भाडाको चलानी':'运输单据','ढुवानी चलानी तयार गर्नुहोस्':'创建运输单据',
      'नयाँ लोडको विवरण':'新货源信息','उपलब्ध लोडहरू':'可用货源',
      'गाडीको विवरण':'车辆信息','ढुवानी / भाडाको चलानी':'运输单据',
      'लोड दिने व्यक्ति/कम्पनी':'发货人/公司','सामान कहाँबाट उठाउने?':'取货地点',
      'सामान कहाँ पुर्‍याउने?':'送货地点','सामानको नाम':'货物名称',
      'तौल (टन/केजी)':'重量（吨/公斤）','प्रस्तावित भाडा (रु.)':'报价（尼泊尔卢比）',
      'सम्पर्क नम्बर':'联系电话','गाडी नम्बर':'车牌号','गाडीको प्रकार':'车辆类型',
      'सामान बोक्ने क्षमता':'载货能力','गाडी धनीको नाम':'车主姓名',
      'ड्राइभरको पूरा नाम':'司机全名','लाइसेन्स नम्बर':'驾照号码',
      'लाइसेन्स वर्ग':'驾照类别','म्याद सकिने मिति':'到期日期',
      'लाइसेन्सको फोटो':'驾照照片','दर्ता/नवीकरण मिति':'登记/续期日期',
      'ब्लुबुकको फोटो':'车辆登记证照片','बीमा कम्पनीको नाम':'保险公司名称',
      'पोलिसी नम्बर':'保单号码','बीमा सुरु मिति':'保险开始日期',
      'बीमा सकिने मिति':'保险到期日期','बीमा कागजातको फोटो':'保险文件照片',
      'दर्ता नम्बर':'注册号码','कम्पनीको ठेगाना':'公司地址','इमेल':'电子邮箱',
      'कम्पनी दर्ता कागजात':'公司注册文件','चलानी नम्बर':'运输单号',
      'चलानी मिति':'单据日期','पठाउने व्यक्ति/कम्पनी':'发货方',
      'प्राप्त गर्ने व्यक्ति/कम्पनी':'收货方','सामानको विवरण':'货物详情',
      'उठाउने स्थान':'取货地点','पुर्‍याउने स्थान':'送货地点',
      'भाडा रकम (रु.)':'运费（尼泊尔卢比）','लोड सुरक्षित गर्नुहोस्':'保存货源',
      'नयाँ लोड पोस्ट':'发布新货源','गाडीको विवरण सुरक्षित गर्नुहोस्':'保存车辆信息',
      'विवरण सुरक्षित गर्नुहोस्':'保存信息','कम्पनीको विवरण सुरक्षित गर्नुहोस्':'保存公司信息',
      'चलानी सुरक्षित गर्नुहोस्':'保存运输单据','← मुख्य पृष्ठमा फर्कनुहोस्':'← 返回首页',
      'ढुवानीको सजिलो साथी':'您的运输伙伴','विवरण यस एपमा सुरक्षित भयो。':'信息已保存在此应用中。',
    
      'मेरा बुकिङ': '我的预订',
      'बुकिङ सूची': '预订列表',
      'Account': '账户',
      'Privacy': '隐私',
      'Lists': '列表',
      'Storage and Data': '存储与数据',
      'App Language': '应用语言',
      'Help': '帮助',
      'City': '城市',
      'Request History': '请求记录',
      'Logout': '退出登录',}
  };
  const featureTranslations = {
      'English': {
    'लोड पोस्ट रद्द भयो': 'Load post cancelled',
    'तपाईंले बुक गरेको लोड पोस्ट रद्द भएको छ।': 'The load you booked has been cancelled.',
    'सम्बन्धित लोड पोस्ट रद्द भएको छ।': 'The related load post has been cancelled.',
        'सूचनाहरू':'Notifications','अहिले कुनै सूचना छैन।':'No notifications yet.',
        'सबै सूचनाहरू':'All notifications','पढिएको':'Read','नयाँ':'New',
'नयाँ बुकिङ अनुरोध':'New booking request',
'तपाईंको लोडमा नयाँ बुकिङ अनुरोध आएको छ।':'A new booking request was made for your load.',
'बुकिङ रद्द अनुरोध':'Booking cancellation request',
'तपाईंको बुकिङ रद्द गर्न अनुरोध आएको छ।':'A request to cancel your booking was received.',
'रद्द अनुरोध स्वीकार भयो':'Cancellation request accepted',
'रद्द अनुरोध अस्वीकार भयो':'Cancellation request rejected',
'तपाईंको बुकिङ रद्द गर्ने अनुरोध स्वीकार भयो।':'Your cancellation request was accepted.',
'तपाईंको बुकिङ रद्द गर्ने अनुरोध अस्वीकार भयो।':'Your cancellation request was rejected.',
'नयाँ सन्देश':'New message',
'तपाईंको बुकिङमा नयाँ सन्देश आएको छ।':'You received a new message about your booking.',
'KYC स्वीकृत भयो':'KYC approved',
'KYC अस्वीकृत भयो':'KYC rejected',
'तपाईंको पहिचान प्रमाणीकरण स्वीकृत भयो।':'Your identity verification was approved.',
'तपाईंको पहिचान प्रमाणीकरण अस्वीकृत भयो। विवरण जाँच गर्नुहोस्।':'Your identity verification was rejected. Please check the details.'
      },
      'हिन्दी': {
    'लोड पोस्ट रद्द भयो': 'लोड पोस्ट रद्द हुई',
    'तपाईंले बुक गरेको लोड पोस्ट रद्द भएको छ।': '您预订的货运已取消。',
    'सम्बन्धित लोड पोस्ट रद्द भएको छ।': '相关货运已取消。',
        'सूचनाहरू':'सूचनाएँ','अहिले कुनै सूचना छैन।':'अभी कोई सूचना नहीं है।',
        'सबै सूचनाहरू':'सभी सूचनाएँ','पढिएको':'पढ़ा गया','नयाँ':'नई',
'नयाँ बुकिङ अनुरोध':'नई बुकिंग का अनुरोध',
'तपाईंको लोडमा नयाँ बुकिङ अनुरोध आएको छ।':'आपके लोड के लिए नई बुकिंग का अनुरोध आया है।',
'बुकिङ रद्द अनुरोध':'बुकिंग रद्द करने का अनुरोध',
'तपाईंको बुकिङ रद्द गर्न अनुरोध आएको छ।':'आपकी बुकिंग रद्द करने का अनुरोध आया है।',
'रद्द अनुरोध स्वीकार भयो':'रद्द करने का अनुरोध स्वीकार हुआ',
'रद्द अनुरोध अस्वीकार भयो':'रद्द करने का अनुरोध अस्वीकार हुआ',
'तपाईंको बुकिङ रद्द गर्ने अनुरोध स्वीकार भयो।':'आपकी बुकिंग रद्द करने का अनुरोध स्वीकार हुआ।',
'तपाईंको बुकिङ रद्द गर्ने अनुरोध अस्वीकार भयो।':'आपकी बुकिंग रद्द करने का अनुरोध अस्वीकार हुआ।',
'नयाँ सन्देश':'नया संदेश',
'तपाईंको बुकिङमा नयाँ सन्देश आएको छ।':'आपकी बुकिंग के बारे में नया संदेश आया है।',
'KYC स्वीकृत भयो':'KYC स्वीकृत हुआ',
'KYC अस्वीकृत भयो':'KYC अस्वीकृत हुआ',
'तपाईंको पहिचान प्रमाणीकरण स्वीकृत भयो।':'आपकी पहचान का सत्यापन स्वीकृत हुआ।',
'तपाईंको पहिचान प्रमाणीकरण अस्वीकृत भयो। विवरण जाँच गर्नुहोस्।':'आपकी पहचान का सत्यापन अस्वीकृत हुआ। कृपया विवरण जाँचें।'
      },
      '中文': {
    'लोड पोस्ट रद्द भयो': '货运发布已取消',
    'तपाईंले बुक गरेको लोड पोस्ट रद्द भएको छ।': '您预订的货运已被取消。',
    'सम्बन्धित लोड पोस्ट रद्द भएको छ।': '相关货运信息已取消。',
        'सूचनाहरू':'通知','अहिले कुनै सूचना छैन।':'暂无通知。',
        'सबै सूचनाहरू':'所有通知','पढिएको':'已读','नयाँ':'未读',
'नयाँ बुकिङ अनुरोध':'新的预订请求',
'तपाईंको लोडमा नयाँ बुकिङ अनुरोध आएको छ।':'有人为您发布的货运信息提交了新的预订请求。',
'बुकिङ रद्द अनुरोध':'取消预订请求',
'तपाईंको बुकिङ रद्द गर्न अनुरोध आएको छ।':'有人请求取消您的预订。',
'रद्द अनुरोध स्वीकार भयो':'取消请求已接受',
'रद्द अनुरोध अस्वीकार भयो':'取消请求已拒绝',
'तपाईंको बुकिङ रद्द गर्ने अनुरोध स्वीकार भयो।':'您的取消预订请求已获接受。',
'तपाईंको बुकिङ रद्द गर्ने अनुरोध अस्वीकार भयो।':'您的取消预订请求已被拒绝。',
'नयाँ सन्देश':'新消息',
'तपाईंको बुकिङमा नयाँ सन्देश आएको छ।':'您收到了一条与预订有关的新消息。',
'KYC स्वीकृत भयो':'身份验证已通过',
'KYC अस्वीकृत भयो':'身份验证未通过',
'तपाईंको पहिचान प्रमाणीकरण स्वीकृत भयो।':'您的身份验证已通过。',
'तपाईंको पहिचान प्रमाणीकरण अस्वीकृत भयो। विवरण जाँच गर्नुहोस्।':'您的身份验证未通过，请检查相关信息。'
      }
    };
  const tr = (text) => featureTranslations[language]?.[text] || translations[language]?.[text] || text;

  const floatingBack = {
    position: 'fixed', right: 18, bottom: 18, zIndex: 9999,
    width: 52, height: 52, borderRadius: '50%',
    background: '#FF6500', color: '#FFFFFF', border: '2px solid white',
    boxShadow: '0 3px 12px #0005', fontSize: 24, fontWeight: 900,
    display: 'grid', placeItems: 'center'
  };





  const go = (p) => {
    if (authStep === 'complete' && role && !isAppAdmin && kycCheckComplete && accountKycStatus !== 'स्वीकृत (Approved)' && !['kyc', 'kyc-pending'].includes(p)) {
      setPage(accountKycStatus === 'प्रतीक्षामा (Pending)' ? 'kyc-pending' : 'kyc');
      setMessage('पहिले KYC प्रमाणिकरण पूरा गर्नुहोस्।');
      return;
    }
    if (p !== page) setNavHistory(prev => [...prev, page]);
    setPage(p);
    setForm({});
    setMessage('');
  };

  const goBack = () => {
    if (page === 'kyc' || page === 'kyc-pending') {
      localStorage.removeItem('load_role');
      setRole('');
      setNavHistory([]);
      setPage('home');
      setMessage('');
      return;
    }
    if (navHistory.length > 0) {
      setPage(navHistory[navHistory.length - 1]);
      setNavHistory(prev => prev.slice(0, -1));
      setMessage('');
    } else if (page !== 'home') {
      setPage('home');
    } else {
      setRole('');
      setAuthStep('complete');
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage('Logout भएन: ' + error.message);
      return;
    }
    localStorage.removeItem('load_role');
    setRole('');
    setWelcomeAction('');
    setAuthStep('details');
    setPage('home');
    setNavHistory([]);
    setMessage('');
  };


  const roleGroups = {
    'नेपाली': [
      { key:'seeker', name:'सामान ढुवानीका लागि गाडी खोज्ने', desc:'आफ्नो सामान पठाउन वा अन्य ठाउँबाट सामान ल्याउन गाडी खोज्ने।', options:[
        ['customer','व्यक्तिगत'],['shipper','पसले तथा व्यापारी'],['shipper','फ्याक्ट्री तथा उद्योग'],['shipper','ठेकेदार तथा निर्माण कम्पनी'],['shipper','अनलाइन पसल तथा वितरक'],['shipper','अन्य व्यवसाय तथा संस्था']
      ]},
      { key:'provider', name:'सामान ढुवानी गर्ने सेवा दिने', desc:'गाडीबाट सामान ओसार्ने, डेलिभरी गर्ने वा ढुवानी सेवा सञ्चालन गर्ने।', options:[
        ['driver','ड्राइभर'],['owner','गाडीधनी'],['owner','धेरै गाडी भएको व्यवसायी'],['transport','यातायात कम्पनी'],['transport','ढुवानी एजेन्ट'],['transport','कुरियर तथा डेलिभरी सेवा']
      ]}
    ],
    'English': [
      { key:'seeker', name:'Find a vehicle for goods transport', desc:'Find a vehicle to send or bring goods.', options:[
        ['customer','Individual'],['shipper','Shopkeeper or trader'],['shipper','Factory or industry'],['shipper','Contractor or construction company'],['shipper','Online shop or distributor'],['shipper','Other business or organization']
      ]},
      { key:'provider', name:'Provide goods transport services', desc:'Transport goods, deliver parcels, or operate a transport service.', options:[
        ['driver','Driver'],['owner','Vehicle owner'],['owner','Fleet owner'],['transport','Transport company'],['transport','Freight agent'],['transport','Courier or delivery service']
      ]}
    ],
    'हिन्दी': [
      { key:'seeker', name:'सामान ढुवानी के लिए गाड़ी खोजें', desc:'सामान भेजने या दूसरी जगह से मँगाने के लिए गाड़ी खोजें।', options:[
        ['customer','व्यक्तिगत'],['shipper','दुकानदार तथा व्यापारी'],['shipper','फैक्ट्री तथा उद्योग'],['shipper','ठेकेदार तथा निर्माण कंपनी'],['shipper','ऑनलाइन दुकान तथा वितरक'],['shipper','अन्य व्यवसाय तथा संस्था']
      ]},
      { key:'provider', name:'सामान ढुवानी की सेवा दें', desc:'गाड़ी से सामान पहुँचाएँ या ढुवानी सेवा चलाएँ।', options:[
        ['driver','ड्राइवर'],['owner','वाहन मालिक'],['owner','कई वाहनों का मालिक'],['transport','परिवहन कंपनी'],['transport','ढुवानी एजेंट'],['transport','कूरियर तथा डिलीवरी सेवा']
      ]}
    ],
    '中文': [
      { key:'seeker', name:'寻找货物运输车辆', desc:'寻找车辆来发送货物或从其他地方运货。', options:[
        ['customer','个人'],['shipper','店主及贸易商'],['shipper','工厂及工业企业'],['shipper','承包商及建筑公司'],['shipper','网店及分销商'],['shipper','其他企业及机构']
      ]},
      { key:'provider', name:'提供货物运输服务', desc:'运输货物、配送包裹或经营运输服务。', options:[
        ['driver','司机'],['owner','车主'],['owner','车队经营者'],['transport','运输公司'],['transport','货运代理'],['transport','快递及配送服务']
      ]}
    ]
  };

  useEffect(() => {
    if (page !== 'bookings') return;
    let active = true;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      setCurrentUserId(auth.user.id);
      const { data, error } = await supabase.from('load_bookings')
        .select('id,load_id,customer_id,driver_id,status,created_at,cancellation_reason,cancelled_by,cancelled_at,cancellation_status,cancellation_decision_by,cancellation_decided_at,cancellation_note')
        .or('customer_id.eq.' + auth.user.id + ',driver_id.eq.' + auth.user.id)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) setChatError(error.message);
      else setBookings(data || []);
    })();
    return () => { active = false; };
  }, [page]);

  useEffect(() => {
    if (!['bookings', 'settings-history'].includes(page)) return;
    let active = true;
    (async () => {
      setVehicleBookingsError('');
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth?.user) {
        if (active) setVehicleBookingsError('म्याप बुकिङ हेर्न पहिले लगइन गर्नुहोस्।');
        return;
      }
      const uid = auth.user.id;
      const { data, error } = await supabase.from('vehicle_booking_requests')
        .select('*')
        .or(`requester_id.eq.${uid},vehicle_owner_id.eq.${uid}`)
        .order('created_at', { ascending: false })
        .limit(100);
      if (!active) return;
      if (error) setVehicleBookingsError('म्याप बुकिङ लोड भएन: ' + error.message);
      else setVehicleBookings(data || []);
    })();
    return () => { active = false; };
  }, [page]);

  useEffect(() => {
    if (page !== 'chat' || !selectedBooking) return;
    let active = true;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      setCurrentUserId(auth.user.id);
      const { data, error } = await supabase.from('load_messages')
        .select('id,booking_id,sender_id,body,created_at')
        .eq('booking_id', selectedBooking.id)
        .order('created_at', { ascending: true });
      if (!active) return;
      if (error) setChatError(error.message);
      else setChatMessages(data || []);
    })();
    return () => { active = false; };
  }, [page, selectedBooking?.id]);


  useEffect(() => {
    if (page !== 'settings-account') return;
    let active = true;
    (async () => {
      try {
        const { data: auth, error: ae } = await supabase.auth.getUser();
        if (ae || !auth.user) {
          if (active) setAccountKycStatus('पहिले लगइन गर्नुहोस्');
          return;
        }
        const { data, error } = await supabase
          .from('kyc_records')
          .select('status, admin_note, created_at')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (error) throw error;
        if (active) {
          const k = data && data[0];
          setAccountKycStatus(!k ? 'कागजात पेश गरिएको छैन' :
            ({pending:'प्रतीक्षामा (Pending)', approved:'स्वीकृत (Approved)', rejected:'अस्वीकृत (Rejected)'})[k.status] || (k.status || 'अज्ञात'));
          setAccountKycNote(k?.admin_note || '');
        }
      } catch (err) {
        if (active) setAccountKycStatus('स्थिति पढ्न सकिएन: ' + (err.message || 'त्रुटि'));
      }
    })();
    return () => { active = false; };
  }, [page]);

  
  useEffect(() => {
    if (!['settings-admin-dashboard','settings-admin-applications','settings-admin-kyc','settings-admin-support','settings-admin-loads','settings-admin-bookings','settings-admin-users','settings-admin-payments','settings-admin-disputes','settings-admin-settings'].includes(page)) return;
    let active = true;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      const { data: admin, error: adminError } = await supabase.rpc('is_app_admin');
      if (!active) return;
      if ((adminError || admin !== true) && auth.user.id !== '0cff7068-0096-4032-8983-a70839aa064e') {
        setIsAppAdmin(false);
        return;
      }
      setIsAppAdmin(true);
  const { data: rootAdmin, error: rootAdminError } = await supabase.rpc('is_root_admin');
      if (!active) return;
      setIsRootAdmin(!rootAdminError && rootAdmin === true);
      const { data: paymentRows, error: paymentError } = await supabase
    .from('payments')
    .select('id,booking_id,payer_id,payee_id,amount,currency,method,status,transaction_reference,created_at')
    .order('created_at', { ascending: false }).limit(300);
  if (!active) return;
  if (paymentError) setAdminOperationsMessage('भुक्तानी सूची: ' + paymentError.message);
  else setAdminPayments(paymentRows || []);

  const { data: disputeRows, error: disputeError } = await supabase
    .from('payment_disputes')
    .select('id,payment_id,raised_by,reason,status,admin_note,created_at,resolved_at')
    .order('created_at', { ascending: false }).limit(300);
  if (!active) return;
  if (disputeError) setAdminOperationsMessage(old => old ? old + ' | विवाद सूची: ' + disputeError.message : 'विवाद सूची: ' + disputeError.message);
  else setAdminDisputes(disputeRows || []);

  const { data: userRows, error: userRowsError } = await supabase
    .from('load_profiles')
    .select('user_id,display_name,phone,email,account_status')
    .order('display_name', { ascending: true }).limit(300);
  if (!active) return;
  if (userRowsError) setAdminOperationsMessage('प्रयोगकर्ता सूची लोड भएन: ' + userRowsError.message);
  else setAdminUsers(userRows || []);

  const { data: allLoads, error: loadsError } = await supabase
    .from('loads')
    .select('id,owner_id,origin,destination,cargo,weight,proposed_price,status,created_at')
    .order('created_at', { ascending: false }).limit(200);
  if (!active) return;
  if (loadsError) setAdminOperationsMessage('लोड सूची: ' + loadsError.message);
  else setAdminLoads(allLoads || []);

  const { data: allBookings, error: bookingsError } = await supabase
    .from('load_bookings')
    .select('id,load_id,customer_id,driver_id,status,created_at,completed_at,actual_distance_km,actual_fare,cancellation_status,cancellation_reason')
    .order('created_at', { ascending: false }).limit(200);
  if (!active) return;
  if (bookingsError) setAdminOperationsMessage(old => old ? old + ' | बुकिङ सूची: ' + bookingsError.message : 'बुकिङ सूची: ' + bookingsError.message);
  else setAdminBookings(allBookings || []);

      const { data: applications, error: applicationsError } = await supabase.from('admin_applications').select('id,user_id,full_name,email,phone,id_type,id_number,photo_path,document_front_path,document_back_path,application_reason,work_plan,status,admin_note,created_at').order('created_at',{ascending:false});
      if (applicationsError) setAdminApplicationsMessage('आवेदन लोड भएन: ' + applicationsError.message);
      else setAdminApplications(applications || []);
    const { data: supportRows, error: supportCountError } = await supabase
      .from('support_conversations').select('id,status');
    if (!active) return;
    if (!supportCountError) setAdminSupportPendingCount(
      (supportRows || []).filter(x =>
        !['resolved','closed'].includes(String(x.status || '').toLowerCase())
      ).length
    );

    const { data: stats, error: statsError } = await supabase.rpc('admin_dashboard_stats');
    if (!active) return;
    if (statsError) setAdminKycMessage('तथ्याङ्क लोड भएन: ' + statsError.message);
    else setAdminStats(stats);
      const { data, error } = await supabase.from('kyc_records')
        .select('id,user_id,role_category,role_type,role_details,full_name,phone,document_type,document_number,photo_path,document_path,document_back_path,status,admin_note,created_at')
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        setAdminKycMessage('KYC सूची लोड भएन: ' + error.message);
      } else {
        const bucket = supabase.storage.from('kyc-private');
        const rows = await Promise.all((data || []).map(async k => {
          const [photo, front, back] = await Promise.all([
            k.photo_path ? bucket.createSignedUrl(k.photo_path, 3600) : Promise.resolve({data:null,error:null}),
            k.document_path ? bucket.createSignedUrl(k.document_path, 3600) : Promise.resolve({data:null,error:null}),
            k.document_back_path ? bucket.createSignedUrl(k.document_back_path, 3600) : Promise.resolve({data:null,error:null})
          ]);
          return {
            ...k,
            photoUrl: photo.data?.signedUrl || '',
            frontUrl: front.data?.signedUrl || '',
            backUrl: back.data?.signedUrl || '',
            fileError: photo.error?.message || front.error?.message || back.error?.message || ''
          };
        }));
        if (!active) return;
        setAdminKyc(rows);
      }
    
      const { data: kycDocs, error: kycDocsError } = await supabase
        .from('kyc_documents')
        .select('id,user_id,document_kind,document_side,storage_path,kyc_record_id,document_number,expiry_date,details,status,admin_note,created_at')
        .order('created_at', { ascending: false })
        .limit(500);
      if (!active) return;
      if (kycDocsError) {
        setAdminKycMessage(old => old ? old + ' | अतिरिक्त KYC कागजात: ' + kycDocsError.message : 'अतिरिक्त KYC कागजात लोड भएन: ' + kycDocsError.message);
      } else {
        const docsBucket = supabase.storage.from('kyc-private');
        const docsWithUrls = await Promise.all((kycDocs || []).map(async d => {
          const file = d.storage_path
            ? await docsBucket.createSignedUrl(d.storage_path, 60)
            : { data: null, error: null };
          return { ...d, fileUrl: file.data?.signedUrl || '', fileError: file.error?.message || '' };
        }));
        if (!active) return;
        setAdminKycDocuments(docsWithUrls);
      }
    })();
    return () => { active = false; };
  }, [page]);

  const decideKyc = async (id, status) => {
    setAdminKycMessage('');
    const note = status === 'approved' ? 'Admin बाट स्वीकृत' : 'कागजात पुनः जाँच गरी पेश गर्नुहोस्';
    const { data: record, error: recordError } = await supabase
      .from('kyc_records')
      .update({ status, admin_note: note })
      .eq('id', id)
      .select('id,user_id')
      .single();
    if (recordError) {
      setAdminKycMessage('KYC स्थिति अपडेट भएन: ' + recordError.message);
      return;
    }

    const { error: docsError } = await supabase
      .from('kyc_documents')
      .update({ status, admin_note: note, updated_at: new Date().toISOString() })
      .eq('kyc_record_id', id);

    if (docsError) {
      setAdminKyc(old => old.map(k => k.id === id ? { ...k, status, admin_note: note } : k));
      setAdminKycMessage('मुख्य KYC अपडेट भयो, तर अतिरिक्त कागजात अपडेट भएन: ' + docsError.message);
      return;
    }

    setAdminKyc(old => old.map(k => k.id === id ? { ...k, status, admin_note: note } : k));
    setAdminKycDocuments(old => old.map(d => d.kyc_record_id === id ? { ...d, status, admin_note: note, updated_at: new Date().toISOString() } : d));
    setAdminKycMessage('KYC र त्यससँग जोडिएका अतिरिक्त कागजातको स्थिति अपडेट भयो।');
  };

  if (showResetPassword && page !== 'admin-application') return (
    <div style={{maxWidth:480,margin:'40px auto',padding:24,fontFamily:'Arial,sans-serif'}}>
      <h2>नयाँ पासवर्ड राख्नुहोस्</h2>
      <p>नयाँ पासवर्ड कम्तीमा 8 अक्षरको राख्नुहोस्।</p>
      <input type="password" autoComplete="new-password" placeholder="नयाँ पासवर्ड" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} style={{display:'block',width:'100%',boxSizing:'border-box',padding:12,margin:'12px 0'}} />
      <input type="password" autoComplete="new-password" placeholder="पासवर्ड फेरि लेख्नुहोस्" value={confirmAdminPassword} onChange={e => setConfirmAdminPassword(e.target.value)} style={{display:'block',width:'100%',boxSizing:'border-box',padding:12,margin:'12px 0'}} />
      <button type="button" className="primary" style={{display:'block',width:'100%',margin:'10px 0'}} onClick={() => {setAdminApplicationMessage('');setMainMenuOpen(false);setPage('admin-application');setForm({});setMessage('');}}>Create Admin Account / Admin बन्न आवेदन</button>
            <button type="button" onClick={async () => {
        setResetPasswordMessage('');
        if (newAdminPassword.length < 8) { setResetPasswordMessage('पासवर्ड कम्तीमा 8 अक्षरको हुनुपर्छ।'); return; }
        if (newAdminPassword !== confirmAdminPassword) { setResetPasswordMessage('दुवै पासवर्ड मिलेनन्।'); return; }
        const { error } = await supabase.auth.updateUser({ password: newAdminPassword });
        if (error) setResetPasswordMessage('पासवर्ड परिवर्तन भएन: ' + error.message);
        else { setResetPasswordMessage('पासवर्ड परिवर्तन भयो। अब नयाँ पासवर्डबाट लगइन गर्नुहोस्।'); setShowResetPassword(false); setNewAdminPassword(''); setConfirmAdminPassword(''); }
      }} style={{width:'100%',padding:14}}>पासवर्ड परिवर्तन गर्नुहोस्</button>
      {resetPasswordMessage && <p>{resetPasswordMessage}</p>}
    </div>
  );

  if (authStep === 'complete' && role && !isAppAdmin &&
      !kycCheckComplete && page !== 'admin-application' && !page.startsWith('settings-admin')) return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,textAlign:'center'}}>
      <div><div style={{fontSize:42}}>🔐</div><h3>KYC स्थिति जाँच हुँदैछ</h3><p>कृपया केही समय प्रतीक्षा गर्नुहोस्।</p></div>
    </div>
  );

  if (page !== 'admin-application' && !role && !welcomeAction && authStep !== 'complete') return (
    <div style={{minHeight:'100vh',boxSizing:'border-box',background:'linear-gradient(155deg,#0B192C,#173e5e)',color:'white',padding:'24px 22px',fontFamily:'Arial,sans-serif',maxWidth:600,margin:'auto',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{background:'#FF6500',color:'#fff',borderRadius:13,padding:'13px 11px',fontWeight:900,fontSize:22}}>LM</div>
          <div>
            <div style={{fontSize:23,fontWeight:900}}>LoadMitra</div>
            <div style={{fontSize:10,letterSpacing:1.5,color:'#dce7f2',marginTop:4}}>LM LOGISTICS & CARGO</div>
          </div>
        </div>
        <div style={{position:'relative'}}>
          <button type="button" aria-label="भाषा छान्नुहोस्" onClick={() => setLanguageMenuOpen(!languageMenuOpen)} style={{fontSize:25,padding:'7px 10px',border:'1px solid #ffffff55',borderRadius:12,background:'transparent',color:'white'}}>🌐</button>
          {languageMenuOpen && <div style={{position:'absolute',right:0,top:'110%',zIndex:20,minWidth:145,background:'white',color:'#102b46',borderRadius:12,boxShadow:'0 4px 16px #0003',padding:6}}>
            {['नेपाली','English','हिन्दी','中文'].map(name => <button key={name} type="button" onClick={() => {setLanguage(name);localStorage.setItem('load_language', name);setLanguageMenuOpen(false);}} style={{display:'block',width:'100%',textAlign:'left',padding:10,border:0,borderRadius:8,background:language===name?'#e8f0f8':'white',color:'#102b46',fontSize:14}}>{name}</button>)}
          </div>}
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',paddingTop:45,paddingBottom:35}}>
        <div style={{fontSize:58,textAlign:'center',marginBottom:18}}>🚚</div>
        <h1 style={{fontSize:32,textAlign:'center',margin:'0 0 12px',fontWeight:900}}>LoadMitra</h1>
        <p style={{fontSize:17,textAlign:'center',color:'#FF6500',fontWeight:800,letterSpacing:.5,margin:'0 0 12px'}}>Move More. Move Smarter.</p>
        <p style={{fontSize:14,textAlign:'center',color:'#dce7f2',margin:'0 0 30px'}}>LM LOGISTICS & CARGO</p>
        <button onClick={() => {setWelcomeAction('signup');setAuthStep('details');setAuthMessage('');}} style={{width:'100%',padding:16,border:0,borderRadius:12,background:'#FF6500',color:'white',fontSize:17,fontWeight:800,marginBottom:12}}>Create Account / खाता खोल्नुहोस्</button>
        <button onClick={() => {setWelcomeAction('login');setAuthStep('details');setAuthMessage('');}} style={{width:'100%',padding:15,border:'1px solid #ffffff70',borderRadius:12,background:'transparent',color:'white',fontSize:16,fontWeight:700,marginBottom:18}}>Login / लगइन</button>
        <div style={{display:'flex',alignItems:'center',gap:12,margin:'0 0 14px',color:'#dce7f2',fontSize:12}}>
          <div style={{height:1,background:'#ffffff45',flex:1}}></div><span>वा Google प्रयोग गर्नुहोस्</span><div style={{height:1,background:'#ffffff45',flex:1}}></div>
        </div>
        <button type="button" onClick={async () => {const {data,error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:Capacitor.isNativePlatform()?'com.load.logistics://login-callback':window.location.origin,skipBrowserRedirect:Capacitor.isNativePlatform()}});if(error)setAuthMessage('Google Login समस्या: '+error.message);else if(data?.url)await Browser.open({url:data.url});}} style={{width:'100%',padding:15,border:'1px solid #ffffff60',borderRadius:12,background:'#fff',color:'#102b46',fontSize:16,fontWeight:700}}>Google बाट लगइन गर्नुहोस्</button>
        {authMessage && <p style={{color:'#ffd6a8',fontSize:13,textAlign:'center'}}>{authMessage}</p>}
      </div>
    </div>
  );

  if (page !== 'admin-application' && !role && authStep === 'complete') return (

    <div style={{
      minHeight:'100vh', boxSizing:'border-box',
      background:'linear-gradient(145deg,#102b46,#20547a)',
      color:'white', padding:'28px 20px',
      fontFamily:'Arial,sans-serif',
      maxWidth:600, margin:'auto'
    }}>
      <div style={{
        width:64,height:64,borderRadius:18,
        background:'#f28c28',color:'#102b46',
        display:'grid',placeItems:'center',
        fontSize:25,fontWeight:900,marginBottom:20
      }}>LM</div>
      <h1 style={{fontSize:28,marginBottom:8}}>Load</h1>
      <p style={{color:'#ffb15b',letterSpacing:2,fontSize:12}}>
        LM LOGISTICS & CARGO
      </p>
        <div style={{position:'relative',marginLeft:'auto'}}>
          <button type="button" aria-label="भाषा छान्नुहोस्"
            onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
            style={{fontSize:24,padding:'6px 10px',borderRadius:12,
              border:'1px solid #ffffff55',background:'transparent',color:'inherit'}}>
            🌐
          </button>
          {languageMenuOpen && <div style={{position:'absolute',right:0,top:'100%',
            zIndex:20,minWidth:145,background:'white',color:'#102b46',
            borderRadius:12,boxShadow:'0 4px 16px #0003',padding:6}}>
            {[
              ['नेपाली','🇳🇵'],['English','🇬🇧'],
              ['हिन्दी','🇮🇳'],['中文','🇨🇳']
            ].map(([name,flag]) => <button key={name} type="button"
              onClick={() => {setLanguage(name);localStorage.setItem('load_language', name);setLanguageMenuOpen(false);}}
              style={{display:'block',width:'100%',textAlign:'left',
                padding:'9px 8px',border:0,borderRadius:8,
                background:language===name?'#e8f0f8':'white',
                color:'#102b46',fontSize:13}}>
              {flag} {name}
            </button>)}
          </div>}
        </div>
      <h2 style={{marginTop:30,fontSize:23}}>
        {{
          'नेपाली':'आफ्नो भूमिका छान्नुहोस्',
          'English':'Choose your role',
          'हिन्दी':'अपनी भूमिका चुनें',
          '中文':'请选择您的身份'
        }[language] || 'आफ्नो भूमिका छान्नुहोस्'}
      </h2>
      <p style={{color:'#dce7f2',lineHeight:1.6}}>
        {{
          'नेपाली':'तपाईंले एकभन्दा बढी भूमिका पनि प्रयोग गर्न सक्नुहुनेछ।',
          'English':'You can use more than one role.',
          'हिन्दी':'आप एक से अधिक भूमिका भी चुन सकेंगे।',
          '中文':'您可以使用多个身份。'
        }[language] || ''}
      </p>
      {roleGroups[language].map(group => (
          <button type="button" key={group.key}
            onClick={() => {
              const initialRole = group.key === 'seeker' ? 'customer' : 'driver';
              localStorage.setItem('load_role_category', group.key);
              localStorage.removeItem('load_role_type');
              setRoleType('');
              localStorage.setItem('load_role', initialRole);
              setRoleCategory(group.key);
              setRole(initialRole);
              if (isRootAdmin) {
                setIsAppAdmin(true);
                setKycCheckComplete(true);
                setAccountKycStatus('स्वीकृत (Approved)');
                go('home');
              } else {
                go('kyc');
              }
            }}
            style={{display:'block',width:'100%',textAlign:'left',padding:16,
              margin:'12px 0',border:'1px solid #ffffff45',borderRadius:14,
              background:'#fff',color:'#102b46',fontSize:16,fontWeight:700}}>
            {group.name}
            <div style={{fontSize:12,fontWeight:400,color:'#64748b',marginTop:6,lineHeight:1.5}}>
              {group.desc}
            </div>
          </button>
        ))}
        <p style={{fontSize:12,color:'#c5d5e5',marginTop:22}}>
        भूमिका छानेपछि खाता प्रमाणीकरण र सेवा सेटअप थप्नेछौँ।
      </p>
    </div>
  );


  if (welcomeAction && authStep !== 'complete' && page !== 'admin-application') return (
    <div style={{
      minHeight:'100vh',boxSizing:'border-box',
      background:'#f1f5fa',padding:'26px 20px',
      fontFamily:'Arial,sans-serif',maxWidth:600,margin:'auto',
      color:'#102b46'
    }}>
      <div style={{
        background:'#102b46',color:'white',padding:22,
        borderRadius:18,marginBottom:24
      }}>
        <div style={{fontSize:28,fontWeight:900}}>LM · Load</div>
        <div style={{color:'#ffb15b',fontSize:12,marginTop:6}}>
          LOGISTICS & CARGO
        </div>
      </div>
      <h2>{authStep === 'details' ? (welcomeAction === 'login' ? 'लगइन गर्नुहोस्' : 'खाता खोल्नुहोस्') : 'OTP प्रमाणीकरण'}</h2>
      {role && <p style={{color:'#64748b',lineHeight:1.6}}>छानिएको भूमिका: {role}</p>}

      {authStep === 'details' ? <>
        <button type="button"
          onClick={async () => {
            localStorage.setItem('load_role', role);
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: Capacitor.isNativePlatform() ? 'com.load.logistics://login-callback' : window.location.origin, skipBrowserRedirect: Capacitor.isNativePlatform() }
            });
            if (error) setAuthMessage('Google Login समस्या: ' + error.message);
            else if (data?.url) await Browser.open({ url: data.url });
          }}
          style={{display:'block',width:'100%',padding:15,margin:'12px 0',
            border:'1px solid #cbd5e1',borderRadius:10,background:'#fff',
            color:'#102b46',fontSize:16,fontWeight:700}}>
          Google बाट लगइन गर्नुहोस्
        </button>
        {authMessage && <p>{authMessage}</p>}

        <label style={{display:'block',marginTop:22,fontWeight:700}}>
          मोबाइल नम्बर
          <input type="tel" value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+977 98XXXXXXXX"
            style={{display:'block',width:'100%',boxSizing:'border-box',
              padding:15,marginTop:8,border:'1px solid #cbd5e1',
              borderRadius:10,fontSize:16}} />
        </label>
        <label style={{display:'block',marginTop:18,fontWeight:700}}>
          इमेल ठेगाना
          <input type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{display:'block',width:'100%',boxSizing:'border-box',
              padding:15,marginTop:8,border:'1px solid #cbd5e1',
              borderRadius:10,fontSize:16}} />
        </label>
        <button onClick={() => {
          if (!phone.trim() || !email.trim() || !email.includes('@')) {
            setAuthMessage('सही मोबाइल नम्बर र इमेल दुवै भर्नुहोस्।');
            return;
          }
          setAuthMessage('OTP पठाउँदैछ...'); supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } }).then(({ error }) => { if (error) setAuthMessage('OTP पठाउन सकिएन: ' + error.message); else { setAuthStep('otp'); setAuthMessage('तपाईंको इमेलमा OTP पठाइएको छ।'); } });
        }} style={{
          width:'100%',padding:16,marginTop:24,border:0,
          borderRadius:12,background:'#f28c28',
          color:'#102b46',fontSize:16,fontWeight:700
        }}>OTP प्रमाणीकरण सुरु गर्नुहोस्</button>
      </> : <>
        <p>तपाईंको मोबाइल र इमेलमा आएको ६ अङ्कको OTP यहाँ राख्नुहोस्।</p>
        <input value={otp} maxLength={6} inputMode="numeric"
          onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
          placeholder="६ अङ्कको OTP"
          style={{width:'100%',boxSizing:'border-box',padding:16,
            border:'1px solid #cbd5e1',borderRadius:10,fontSize:20}} />
        <button onClick={() => {
          if (otp.length !== 6) { setAuthMessage('६ अङ्कको OTP राख्नुहोस्।'); return; }
          setAuthMessage('OTP प्रमाणित गर्दैछ...');
          supabase.auth.verifyOtp({ email: email.trim(), token: otp, type: 'email' }).then(({ error }) => {
            if (error) setAuthMessage('OTP प्रमाणित भएन: ' + error.message);
            else { setAuthStep('complete'); setAuthMessage('इमेल प्रमाणित भयो।'); }
          });
        }} style={{width:'100%',padding:16,marginTop:12,border:0,borderRadius:12,background:'#f28c28',color:'#102b46',fontSize:16,fontWeight:700}}>OTP प्रमाणित गर्नुहोस्</button>
      </>}
      {authMessage && <p style={{
        background:'#fff1db',padding:13,borderRadius:10,
        lineHeight:1.6,fontSize:13
      }}>{authMessage}</p>}
      <button onClick={() => {
        setRole('');
        setWelcomeAction('');
        setAuthStep('details');
        setAuthMessage('');
      }} style={{
        width:'100%',padding:14,marginTop:16,
        border:'1px solid #cbd5e1',borderRadius:12,
        background:'white',fontWeight:700
      }}>← पछाडि</button>
    </div>
  );

  const field = (label, key, type = 'text') => (
    <label className="field" key={key}>
      {label}
      <input
        type={type}
        value={type === 'file' ? undefined : (form[key] || '')}
        onChange={e => setForm({ ...form, [key]: type === 'file' ? e.target.files[0]?.name : e.target.value })}
        placeholder={type === 'file' ? undefined : label + ' लेख्नुहोस्'}
        required={type !== 'file'}
      />
    </label>
  );

  const completeBooking = async (booking) => {
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) throw new Error("पहिले लगइन गर्नुहोस्।");
      await requireApprovedKyc(auth.user.id);

      if (auth.user.id === booking.customer_id) {
        const { data, error } = await supabase.functions.invoke("delivery-otp", {
          body: { action: "send", booking_id: booking.id }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setMessage(data?.message || "ग्राहकको इमेलमा डेलिभरी OTP पठाइयो।");
        return;
      }

      if (auth.user.id === booking.driver_id) {
        const otp = window.prompt("ग्राहकको इमेलमा आएको डेलिभरी OTP लेख्नुहोस्:");
        if (otp === null) return;
        if (!/^\\d{6}$/.test(otp.trim())) throw new Error("६ अङ्कको OTP लेख्नुहोस्।");
        const { data, error } = await supabase.functions.invoke("delivery-otp", {
          body: { action: "verify", booking_id: booking.id, otp: otp.trim() }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        const { data: refreshed, error: refreshError } = await supabase
          .from("load_bookings")
          .select("id,load_id,customer_id,driver_id,status,created_at,completed_at,actual_distance_km,actual_fare")
          .eq("id", booking.id)
          .single();
        if (refreshError) throw refreshError;
        setBookings(prev => prev.map(b => b.id === booking.id ? refreshed : b));
        setMessage(data?.message || "OTP प्रमाणित भयो। ढुवानी पूरा भयो।");
        return;
      }
      throw new Error("यो बुकिङमा तपाईंको अनुमति छैन।");
    } catch (err) {
      setMessage("डेलिभरी OTP असफल: " + (err.message || "फेरि प्रयास गर्नुहोस्।"));
    }
  };

  const requestBookingCancellation = async (booking) => {
    try {
      const reason = window.prompt(
        "बुकिङ रद्द गर्नुको कारण लेख्नुहोस् (कम्तीमा ५ अक्षर):"
      );
      if (reason === null) return;
      if (reason.trim().length < 5) {
        throw new Error("रद्द गर्ने कारण कम्तीमा ५ अक्षरमा लेख्नुहोस्।");
      }
      const { data, error } = await supabase.rpc(
        "request_booking_cancellation",
        { p_booking_id: booking.id, p_reason: reason.trim() }
      );
      if (error) throw error;
      setMessage(data || "रद्द अनुरोध पठाइयो।");
      setBookings(prev => prev.map(b => b.id === booking.id
        ? { ...b, cancellation_reason: reason.trim(), cancelled_by: currentUserId,
            cancellation_status: "requested" }
        : b));
    } catch (err) {
      setMessage("रद्द अनुरोध असफल: " + (err.message || "फेरि प्रयास गर्नुहोस्।"));
    }
  };

  const decideBookingCancellation = async (booking, accept) => {
    try {
      const note = window.prompt(
        accept ? "रद्द स्वीकार गर्ने टिप्पणी (नभए खाली छोड्नुहोस्):"
               : "रद्द अस्वीकार गर्नुको कारण लेख्नुहोस्:"
      );
      if (note === null) return;
      if (!accept && note.trim().length < 5) {
        throw new Error("अस्वीकार गर्ने कारण कम्तीमा ५ अक्षरमा लेख्नुहोस्।");
      }
      const { data, error } = await supabase.rpc(
        "decide_booking_cancellation",
        { p_booking_id: booking.id, p_accept: accept, p_note: note.trim() || null }
      );
      if (error) throw error;
      setMessage(data || "बुकिङको निर्णय सुरक्षित भयो।");
      setBookings(prev => prev.map(b => b.id === booking.id
        ? { ...b, status: accept ? "cancelled" : b.status,
            cancellation_status: accept ? "accepted" : "rejected",
            cancellation_decision_by: currentUserId,
            cancellation_decided_at: new Date().toISOString(),
            cancellation_note: note.trim() || null }
        : b));
    } catch (err) {
      setMessage("रद्द निर्णय असफल: " + (err.message || "फेरि प्रयास गर्नुहोस्।"));
    }
  };

  const cancelLoadPost = async (load) => {
    try {
      const reason = window.prompt("यो लोड पोस्ट किन रद्द गर्दै हुनुहुन्छ? कारण लेख्नुहोस्:");
      if (reason === null) return;
      if (reason.trim().length < 5) {
        throw new Error("कारण कम्तीमा ५ अक्षरमा लेख्नुहोस्।");
      }
      const { data, error } = await supabase.rpc("cancel_load_post", {
        p_load_id: load.id,
        p_reason: reason.trim()
      });
      if (error) throw error;
      setLoads(prev => prev.filter(item => item.id !== load.id));
      setHistoryLoads(prev => prev.map(item => item.id === load.id ? { ...item, status: 'cancelled' } : item));
      setMessage(data || "लोड पोस्ट रद्द भयो।");
    } catch (err) {
      setMessage("लोड पोस्ट रद्द भएन: " + (err.message || "फेरि प्रयास गर्नुहोस्।"));
    }
  };

  const repostExpiredLoad = async (load) => {
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) throw new Error("पहिले लगइन गर्नुहोस्।");
      if (load.status !== 'open' || !load.expires_at || new Date(load.expires_at).getTime() > Date.now()) {
        throw new Error("यो पोस्टको म्याद अझै सकिएको छैन।");
      }

      const newExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase.from('loads').update({
        status: 'open',
        expires_at: newExpiry
      }).eq('id', load.id).eq('owner_id', auth.user.id)
        .select('id,owner_id,origin,destination,cargo,weight,proposed_price,status,created_at,expires_at')
        .single();

      if (error) throw error;
      setHistoryLoads(prev => prev.map(item => item.id === load.id ? data : item));
      setLoads(prev => [data, ...prev.filter(item => item.id !== load.id)]);
      setMessage("पुरानै पोस्ट फेरि खुल्यो। म्याद अहिलेबाट १ घण्टा थपियो।");
    } catch (err) {
      setMessage("पोस्टको म्याद थप्न सकिएन: " + (err.message || "फेरि प्रयास गर्नुहोस्।"));
    }
  };

  const requireApprovedKyc = async (userId) => {
    const { data: rows, error } = await supabase
      .from('kyc_records')
      .select('status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) throw error;
    const kyc = rows?.[0];
    if (!kyc) throw new Error('पहिले KYC भर्नुहोस्।');
    if (kyc.status !== 'approved') {
      throw new Error('Admin ले KYC स्वीकृत नगरेसम्म सुविधा चल्दैन।');
    }
  };

  const createBooking = async (load) => {
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      const user = data?.user;
      if (authError || !user) throw new Error("पहिले लगइन गर्नुहोस्।");
      await requireApprovedKyc(user.id);
      if (!load.owner_id) throw new Error("लोड पोस्ट गर्ने व्यक्तिको ID भेटिएन।");
      if (load.owner_id === user.id) throw new Error("आफ्नै लोड बुक गर्न मिल्दैन।");
      const { data: booking, error } = await supabase.from("load_bookings").insert({
        load_id: load.id, customer_id: load.owner_id, driver_id: user.id
      }).select("id").single();
      if (error) throw error;
      setMessage("बुकिङ अनुरोध पठाइयो।");
    } catch (err) {
      setMessage(err.message || "बुकिङ असफल भयो।");
    }
  };


  const decideLoadBooking = async (booking, accept) => {
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) throw new Error("पहिले लगइन गर्नुहोस्।");
      if (auth.user.id !== booking.customer_id) {
        throw new Error("यो बुकिङको निर्णय गर्ने अनुमति छैन।");
      }
      if (booking.status !== "open") {
        throw new Error("यो बुकिङको निर्णय पहिले नै भइसकेको छ।");
      }

      const { data, error } = await supabase.rpc("decide_load_booking", {
        p_booking_id: booking.id,
        p_accept: accept
      });
      if (error) throw error;

      setBookings(prev => prev.map(b => b.id === booking.id
        ? { ...b, status: accept ? "accepted" : "rejected" }
        : b));
      setMessage(data || (accept ? "बुकिङ स्वीकार भयो।" : "बुकिङ अस्वीकार भयो।"));
    } catch (err) {
      setMessage("बुकिङको निर्णय भएन: " + (err.message || "फेरि प्रयास गर्नुहोस्।"));
    }
  };

  const sendChatText = async (body) => {
    if (!body.trim() || !selectedBooking) return;
    try {
      const { data: auth, error: ae } = await supabase.auth.getUser();
      if (ae || !auth.user) throw new Error('पहिले लगइन गर्नुहोस्।');
      const { data, error } = await supabase.from('load_messages').insert({
        booking_id: selectedBooking.id,
        sender_id: auth.user.id,
        body: body.trim()
      }).select('id,booking_id,sender_id,body,created_at').single();
      if (error) throw error;
      setChatMessages(old => [...old, data]);
      setChatDraft('');
      setChatError('');
    } catch (e) { setChatError(e.message || 'म्यासेज पठाउन सकिएन।'); }
  };


  const save = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        setMessage('पहिले इमेल OTP बाट लगइन गर्नुहोस्।');
        return;
      }

      if (page === 'loads' || page === 'truck') {
        await requireApprovedKyc(auth.user.id);

        if (!providerVehicle.number || !providerVehicle.type) {
          setMessage('गाडीको प्रकार र नम्बर भएको स्वीकृत KYC आवश्यक छ।');
          return;
        }
        if (!form.provider_origin?.trim() || !form.provider_destination?.trim()) {
          setMessage('गाडीको हालको स्थान र गन्तव्य भर्नुहोस्।');
          return;
        }

        const scheduledTime = form.provider_available_at
          ? new Date(form.provider_available_at).getTime()
          : null;
        if (scheduledTime !== null && !Number.isFinite(scheduledTime)) {
          setMessage('उपलब्ध समय सही रूपमा छान्नुहोस्।');
          return;
        }

        const expiryBase = scheduledTime && scheduledTime > Date.now()
          ? scheduledTime
          : Date.now();

        const { error } = await supabase.from('vehicle_posts').insert({
          owner_id: auth.user.id,
          vehicle_type: providerVehicle.type,
          vehicle_number: providerVehicle.number,
          load_capacity: providerVehicle.capacity ? Number(providerVehicle.capacity) : null,
          capacity_unit: providerVehicle.unit || 'ton',
          contact_phone: (form.provider_phone ?? providerVehicle.phone ?? '').trim(),
          origin: form.provider_origin.trim(),
          origin_latitude: form.provider_origin_latitude ?? null,
          origin_longitude: form.provider_origin_longitude ?? null,
          destination: form.provider_destination.trim(),
          available_at: form.provider_available_at
            ? new Date(form.provider_available_at).toISOString()
            : null,
          proposed_price: form.provider_price ? Number(form.provider_price) : null,
          expires_at: new Date(expiryBase + 60 * 60 * 1000).toISOString(),
          status: 'open'
        });
        if (error) throw error;

        setForm(prev => ({
          ...prev,
          provider_origin: '',
          provider_origin_latitude: null,
          provider_origin_longitude: null,
          provider_destination: '',
          provider_available_at: '',
          provider_price: ''
        }));
        setMessage('गाडीको पोस्ट सुरक्षित भयो।');
        return;
      }

      if (page !== 'post') {
        setMessage('यो फारमबाट विवरण सुरक्षित गर्न मिल्दैन।');
        return;
      }

      await requireApprovedKyc(auth.user.id);
      const { data, error } = await supabase.from('loads').insert({
        owner_id: auth.user.id,
        origin: form.origin,
        destination: form.destination,
        cargo: form.cargo,
        weight: form.weight,
        proposed_price: form.price ? Number(form.price) : null,
        origin_latitude: form.origin_latitude ?? null,
        origin_longitude: form.origin_longitude ?? null,
        destination_latitude: form.destination_latitude ?? null,
        destination_longitude: form.destination_longitude ?? null,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: 'open'
      }).select().single();
      if (error) throw error;
      setLoads(previous => [{ ...form, ...data, price: data.proposed_price }, ...previous]);
      setForm({});
      setMessage('लोड डेटाबेसमा सुरक्षित भयो।');
    } catch (error) {
      setMessage('पोस्ट सुरक्षित भएन: ' + (error.message || 'फेरि प्रयास गर्नुहोस्।'));
    }
  };

  const saveKyc = async (e) => {
    e.preventDefault();
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        setMessage('पहिले इमेल OTP बाट लगइन गर्नुहोस्।');
        return;
      }
      const { data: previousKyc, error: previousKycError } = await supabase
        .from('kyc_records')
        .select('status, created_at')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (previousKycError) throw previousKycError;
      if (previousKyc?.[0]?.status === 'approved') {
        setMessage('तपाईंको KYC पहिले नै स्वीकृत छ। फेरि भर्नुपर्दैन।');
        return;
      }
      if (previousKyc?.[0]?.status === 'pending') {
        setMessage('तपाईंको KYC Admin जाँचमा छ। निर्णय नआउँदासम्म पर्खनुहोस्।');
        return;
      }
      if (!form.full_name || !form.phone || !form.address_province || !form.address_district || !form.address_local_level || !form.address_ward || !form.address_tole || !form.document_number || !kycPhotoFile || !kycFrontFile || !kycBackFile) {
        setMessage('सबै विवरण, पासपोर्ट साइजको फोटो र कागजातका दुवै फोटो भर्नुहोस्।');
        return;
      }
      const stamp = Date.now();
      const photoPath = auth.user.id + '/' + stamp + '-passport-photo-' + kycPhotoFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const frontPath = auth.user.id + '/' + stamp + '-front-' + kycFrontFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const backPath = auth.user.id + '/' + stamp + '-back-' + kycBackFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const bucket = supabase.storage.from('kyc-private');
      const photoUpload = await bucket.upload(photoPath, kycPhotoFile, { contentType: kycPhotoFile.type, upsert: false });
      if (photoUpload.error) throw photoUpload.error;
      const frontUpload = await bucket.upload(frontPath, kycFrontFile, { contentType: kycFrontFile.type, upsert: false });
      if (frontUpload.error) throw frontUpload.error;
      const backUpload = await bucket.upload(backPath, kycBackFile, { contentType: kycBackFile.type, upsert: false });
      if (backUpload.error) {
        await bucket.remove([photoPath, frontPath]);
        throw backUpload.error;
      }

      const extraDocRows = [];
      const uploadedExtraPaths = [];
      const docMeta = {
        driver_license: {
          holder_name: form.driver_license_name || '',
          number: form.driver_license_number || '',
          license_class: form.driver_license_class || '',
          issue_date: form.driver_license_issue_date || '',
          expiry_date: form.driver_license_expiry_date || ''
        },
        vehicle_bluebook: {
          vehicle_number: form.vehicle_number || '',
          bluebook_number: form.bluebook_number || '',
          owner_name: form.bluebook_owner_name || '',
          issue_date: form.bluebook_issue_date || '',
          renewal_date: form.bluebook_renewal_date || '',
          expiry_date: form.bluebook_expiry_date || '',
          vehicle_type: form.vehicle_type || '',
          load_capacity: form.load_capacity || '',
          capacity_unit: form.capacity_unit || 'ton',
          vehicle_length: form.vehicle_length || ''
        },
        vehicle_insurance: {
          company_name: form.insurance_company || '',
          policy_number: form.insurance_policy_number || '',
          insured_date: form.insurance_start_date || '',
          expiry_date: form.insurance_expiry_date || ''
        },
        company_registration: {
          company_name: form.company_name || '',
          registration_number: form.company_registration_number || '',
          issue_date: form.company_issue_date || '',
          expiry_date: form.company_expiry_date || ''
        },
        business_registration: {
          business_name: form.business_name || '',
          business_type: form.business_type || '',
          business_address: form.business_address || '',
          representative_name: form.business_representative_name || '',
          representative_position: form.business_representative_position || '',
          registration_number: form.business_registration_number || '',
          pan_vat_number: form.business_pan_vat_number || '',
          goods_type: form.business_goods_type || '',
          role_type: roleType || localStorage.getItem('load_role_type') || ''
        },
        business_pan: {
          business_name: form.business_name || '',
          business_type: form.business_type || '',
          business_address: form.business_address || '',
          representative_name: form.business_representative_name || '',
          representative_position: form.business_representative_position || '',
          registration_number: form.business_registration_number || '',
          pan_vat_number: form.business_pan_vat_number || '',
          goods_type: form.business_goods_type || '',
          role_type: roleType || localStorage.getItem('load_role_type') || ''
        }
      };

      try {
        for (const [fileKey, file] of Object.entries(kycExtraDocs)) {
          if (!file) continue;
          const kind = fileKey.startsWith('driver_license_') ? 'driver_license'
            : fileKey.startsWith('vehicle_bluebook_') ? 'vehicle_bluebook'
            : fileKey.startsWith('vehicle_insurance_') ? 'vehicle_insurance'
            : fileKey === 'company_registration' ? 'company_registration'
          : fileKey === 'business_registration_document' ? 'business_registration'
          : fileKey === 'business_pan_document' ? 'business_pan' : '';
          if (!kind) continue;

          const side = fileKey.endsWith('_front') ? 'front'
            : fileKey.endsWith('_back') ? 'back' : 'document';
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = auth.user.id + '/' + stamp + '-' + fileKey + '-' + safeName;
          const { error: uploadError } = await bucket.upload(path, file, {
            contentType: file.type || 'application/octet-stream',
            upsert: false
          });
          if (uploadError) throw uploadError;
          uploadedExtraPaths.push(path);

          const meta = docMeta[kind];
          extraDocRows.push({
            user_id: auth.user.id,
            document_kind: kind,
            document_side: side,
            storage_path: path,
            document_number: meta.number || meta.policy_number || meta.registration_number || null,
            expiry_date: meta.expiry_date || null,
            details: meta,
            status: 'pending',
            updated_at: new Date().toISOString()
          });
        }
      } catch (extraUploadError) {
        await bucket.remove([photoPath, frontPath, backPath, ...uploadedExtraPaths]);
        throw extraUploadError;
      }

      const { data: savedKyc, error } = await supabase.from('kyc_records').insert({
        user_id: auth.user.id,
        role_category: localStorage.getItem('load_role_category') || '',
        role_type: localStorage.getItem('load_role_type') || '',
        full_name: form.full_name,
        phone: form.phone,
        address_province: form.address_province,
        address_district: form.address_district,
        address_local_level: form.address_local_level,
        address_ward: form.address_ward,
        address_tole: form.address_tole,
        address: [form.address_province, form.address_district, form.address_local_level, 'वडा ' + form.address_ward, form.address_tole].join(', '),
        document_type: form.document_type || 'citizenship',
        document_number: form.document_number,
        photo_path: photoPath,
        document_path: frontPath,
        document_back_path: backPath,
        status: 'pending'
      }).select('id').single();

      if (error) {
        await bucket.remove([photoPath, frontPath, backPath, ...extraDocRows.map(d => d.storage_path)]);
        throw error;
      }

      if (extraDocRows.length) {
        const rows = extraDocRows.map(d => ({ ...d, kyc_record_id: savedKyc.id }));
        const { error: docsError } = await supabase.from('kyc_documents').insert(rows);
        if (docsError) {
          await bucket.remove(extraDocRows.map(d => d.storage_path));
          await supabase.from('kyc_records')
            .update({ status: 'rejected', admin_note: 'अतिरिक्त कागजात सुरक्षित हुन सकेन; पुनः जाँच आवश्यक छ।' })
            .eq('id', savedKyc.id);
          throw new Error('मुख्य KYC दर्ता भयो, तर अतिरिक्त कागजातको विवरण सुरक्षित भएन: ' + docsError.message);
        }
      }

      setForm({});
      setKycPhotoFile(null);
      setKycFrontFile(null);
      setKycBackFile(null);
      setKycExtraDocs({});
      setAccountKycStatus('प्रतीक्षामा (Pending)');
                                              setAccountKycNote('');
                                              setPage('kyc-pending');
                                              setMessage('');
    } catch (error) {
      setMessage('KYC सुरक्षित भएन: ' + (error.message || 'फेरि प्रयास गर्नुहोस्।'));
    }
  };





  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const { data: auth, error: ae } = await supabase.auth.getUser();
      if (ae || !auth.user) throw new Error('पहिले लगइन गर्नुहोस्।');
      const uid = auth.user.id;
      setProfileEmail(auth.user.email || '');
      if (!profilePhone.trim()) throw new Error('मोबाइल नम्बर लेख्नुहोस्।');
      const { data: existingProfile, error: readError } = await supabase
        .from('load_profiles').select('photo_path').eq('user_id', uid).maybeSingle();
      if (readError) throw readError;
      let photoPath = existingProfile?.photo_path || null;
      if (profilePhotoFile) {
        const ext = profilePhotoFile.name.split('.').pop() || 'jpg';
        photoPath = uid + '/' + Date.now() + '.' + ext;
        const { error: upErr } = await supabase.storage
          .from('load-profile-photos').upload(photoPath, profilePhotoFile, { upsert: true });
        if (upErr) throw upErr;
        setProfilePhotoUrl(supabase.storage.from('load-profile-photos').getPublicUrl(photoPath).data.publicUrl);
      }
      const row = { user_id: uid, display_name: profileName, phone: profilePhone.trim(),
        email: auth.user.email || profileEmail.trim(),
        account_status: profileStatus, updated_at: new Date().toISOString() };
      if (photoPath) row.photo_path = photoPath;
      const { error } = await supabase.from('load_profiles').upsert(row, { onConflict: 'user_id' });
      if (error) throw error;
      setProfileEmail(auth.user.email || profileEmail.trim());
      setMessage('प्रोफाइल सुरक्षित भयो।');
    } catch (err) { setMessage('प्रोफाइल सुरक्षित भएन: ' + (err.message || 'फेरि प्रयास गर्नुहोस्।')); }
  };

  const sections = [
    ['notifications', '🔔', tr('सूचनाहरू'), tr('सबै सूचनाहरू')],
    ['bookings', '📋', 'मेरा बुकिङ', 'बुकिङ सूची'],
    ['post', '📦', tr('ढुवानीका लागि गाडी खोज्नुहोस्'), tr('नयाँ सामान ढुवानीको विवरण')],
    ['loads', '🔎', tr('गाडीका लागि लोड खोज्नुहोस्'), tr('उपलब्ध ढुवानीका कामहरू')],
  ];
  const titles = Object.fromEntries(sections.map(s => [s[0], s[2]]));

  return (
    <>
    <div className="app">
      {!(authStep === 'complete' && role && !isAppAdmin && kycCheckComplete && (page === 'kyc' || page === 'kyc-pending')) && <>
      <header className="top">
        <div className="brandmark">LM</div>
        <div><h1>Load</h1><small>LOGISTICS & CARGO</small></div>
        <span className="truck">🚛</span>
        <div style={{display:'flex',gap:8,marginLeft:'auto',position:'relative'}}>
          <button type="button" aria-label="सूचनाहरू" onClick={() => go('notifications')} style={{position:'relative',fontSize:23,border:0,borderRadius:10,padding:'6px 10px',background:'#102b46',color:'white'}}>🔔{notifications.filter(n => !n.is_read).length > 0 && <span style={{position:'absolute',top:-5,right:-5,minWidth:20,height:20,padding:'0 4px',boxSizing:'border-box',borderRadius:12,background:'#e00000',color:'white',fontSize:10,fontWeight:'bold',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid white'}}>{notifications.filter(n => !n.is_read).length <= 5 ? notifications.filter(n => !n.is_read).length : Math.floor((notifications.filter(n => !n.is_read).length - 1) / 5) * 5 + '+'}</span>}</button>
          <button type="button" aria-label="मुख्य मेनु"  onClick={() => {setMainMenuOpen(!mainMenuOpen);setLanguageMenuOpen(false);}} style={{fontSize:27,border:0,borderRadius:10,padding:'4px 12px',background:'#102b46',color:'white'}}>⋮</button>
          {mainMenuOpen && <div style={{position:'absolute',right:0,top:'110%',zIndex:10000,width:235,maxHeight:'75vh',overflowY:'auto',background:'white',color:'#102b46',borderRadius:12,boxShadow:'0 4px 18px #0005',padding:6}}>
            {[['settings-account','👤','Account'],['settings-privacy','🔐','Privacy'],['settings-lists','📋','Lists'],['settings-storage','💾','Storage and Data'],['settings-language','🌐','App Language'],['settings-help','❓','Help'],['settings-city','📍','City'],['settings-history','🕘','Request History'],['kyc','🪪','KYC प्रमाणिकरण']].map(([key,icon,label]) => <button key={key} type="button" onClick={() => {if(key==='settings-language'){setLanguageMenuOpen(!languageMenuOpen);}else{setMainMenuOpen(false);setLanguageMenuOpen(false);go(key);}}} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 10px',border:0,borderRadius:8,background:'white',color:'#102b46',fontSize:15}}>{icon} {label}</button>)}
            {languageMenuOpen && <div style={{padding:6,background:'#eef3f8',borderRadius:10}}>{[['नेपाली','🇳🇵'],['English','🇬🇧'],['हिन्दी','🇮🇳'],['中文','🇨🇳']].map(([name,flag]) => <button key={name} type="button" onClick={() => {setLanguage(name);localStorage.setItem('load_language', name);setLanguageMenuOpen(false);setMainMenuOpen(false);}} style={{display:'block',width:'100%',textAlign:'left',padding:10,border:0,borderRadius:8,background:language===name?'#d8e7f5':'transparent',color:'#102b46'}}>{flag} {name}</button>)}</div>}
            <button type="button" onClick={() => {setMainMenuOpen(false);logout();}} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 10px',border:0,borderTop:'1px solid #ddd',background:'white',color:'#c62828',fontSize:15}}>🚪 Logout</button>
          </div>}
        </div>
      </header>

      <div className={page === "home" ? "welcome home-welcome" : "welcome"}>
        <small>LM LOGISTICS & CARGO</small>
        <h2>{page === 'home' ? tr('तपाईंको ढुवानी, अब सजिलो!') : (titles[page] || ({'settings-account':'Account','settings-privacy':'Privacy','settings-lists':'Lists','settings-notifications':'Notifications','settings-storage':'Storage and Data','settings-language':'App Language','settings-help':'Help','settings-city':'City','settings-history':'Request History'}[page] || page))}</h2>
        <p>{tr('लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।')}</p>
        {page === 'home' && <div className="home-summary">
          <button type="button" onClick={() => go('settings-history')} className="summary-item">
            <span>📦</span><b>{loads.length} लोड</b>
          </button>
          <button type="button" onClick={() => go('bookings')} className="summary-item">
            <span>📋</span><b>मेरो बुकिङ</b>
          </button>
        </div>}
      </div>
      </>}

      {page === 'kyc-pending' && <div className="panel" style={{textAlign:'center',padding:24}}>
                  <div style={{fontSize:48}}>⏳</div>
                  <h3>KYC जाँच हुँदैछ</h3>
                  <p>तपाईंका कागजात Admin ले जाँच गर्दै हुनुहुन्छ। स्वीकृति नआउँदासम्म अन्य सुविधा प्रयोग गर्न मिल्दैन।</p>
                  <p><b>स्थिति:</b> Pending / प्रतीक्षामा</p>
                  <button type="button" onClick={async () => {
                    const { data: auth } = await supabase.auth.getUser();
                    if (!auth?.user) return;
                    const { data, error } = await supabase.from('kyc_records')
                      .select('status, admin_note, created_at')
                      .eq('user_id', auth.user.id)
                      .order('created_at', {ascending:false}).limit(1);
                    if (error) { setMessage('स्थिति जाँच्न सकिएन: ' + error.message); return; }
                    const k = data?.[0];
                    setAccountKycStatus(!k ? 'कागजात पेश गरिएको छैन' :
                      ({pending:'प्रतीक्षामा (Pending)', approved:'स्वीकृत (Approved)', rejected:'अस्वीकृत (Rejected)'}[k.status] || k.status));
                    setAccountKycNote(k?.admin_note || '');
                    if (k?.status === 'approved') setPage('home');
                    else if (k?.status === 'rejected') setPage('kyc');
                    else setMessage('अहिले पनि Admin स्वीकृतिको प्रतीक्षामा छ।');
                  }}>स्थिति फेरि जाँच्नुहोस्</button>
                  {message && <p>{message}</p>}
                </div>}
                {page === 'home' && <>
        
        <h3>{tr('तपाईंलाई के चाहिएको छ?')}</h3>
        <div className="menu">
          {sections.filter(s => {
              const category = localStorage.getItem('load_role_category');
              if (category === 'seeker') return s[0] === 'post';
              if (category === 'provider') return s[0] === 'loads';
              return s[0] !== 'notifications' && s[0] !== 'bookings';
            }).map(s => (
            <button className="tile" key={s[0]} onClick={() => go(s[0])}>
              <span className="tileicon">{s[1]}</span>
              <b>{s[2]}</b><small>{s[3]}</small><span className="arrow">›</span>
            </button>
          ))}
        </div>
        <NearbyVehicleMap />
      </>}

      {page === 'profile' && <form onSubmit={saveProfile} className="panel">
        <h3>मेरो प्रोफाइल</h3>
        {profilePhotoUrl && <img src={profilePhotoUrl} alt="गोलो प्रोफाइल फोटो" style={{width:76,height:76,borderRadius:'50%',objectFit:'cover',display:'block',margin:'0 auto 12px'}} />}
        <p>इमेल: {adminEmail || 'लगइनपछि देखिनेछ'}</p>

        {profilePhotoUrl && <img src={profilePhotoUrl} alt="प्रोफाइल फोटो" style={{width:100,height:100,borderRadius:'50%',objectFit:'cover'}} />}
        <label>इमेल ठेगाना *</label>
  <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} required placeholder="आफ्नो इमेल लेख्नुहोस्" />
  <label>मोबाइल नम्बर *</label>
  <input type="tel" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} required placeholder="आफ्नो मोबाइल नम्बर लेख्नुहोस्" />
  <label>ठेगाना *</label>
  <input value={profileAddress} onChange={e => setProfileAddress(e.target.value)} required placeholder="आफ्नो ठेगाना लेख्नुहोस्" />
  <label>व्यक्ति वा कम्पनीको नाम</label>
        <input value={profileName} onChange={e => setProfileName(e.target.value)} required placeholder="नाम लेख्नुहोस्" />
        <label>प्रोफाइल फोटो वा कम्पनी लोगो</label>
        <input type="file" accept="image/*" onChange={e => setProfilePhotoFile(e.target.files?.[0] || null)} />
        <label>खाता स्थिति</label>
        <select value={profileStatus} onChange={e => setProfileStatus(e.target.value)}>
          <option value="active">सक्रिय</option>
          <option value="inactive">निष्क्रिय</option>
        </select>
        <button type="submit">प्रोफाइल सुरक्षित गर्नुहोस्</button>
      </form>}
      {page === 'kyc' && <form onSubmit={saveKyc} className="panel">
        <h3>KYC प्रमाणिकरण</h3>
        {message && <p style={{color:'#b91c1c',background:'#fff1f2',padding:12,borderRadius:8}}>{message}</p>}
                {accountKycStatus === 'अस्वीकृत (Rejected)' && accountKycNote &&
                  <p style={{color:'#b91c1c',background:'#fff1f2',padding:12,borderRadius:8}}>Admin को कारण: {accountKycNote}</p>}
        <label className="field">पूरा नाम
          <input required value={form.full_name || ''} onChange={e => setForm({...form, full_name:e.target.value})}/>
        </label>
        <label className="field">मोबाइल नम्बर
          <input required type="tel" value={form.phone || ''} onChange={e => setForm({...form, phone:e.target.value})}/>
        </label>
        <label className="field">प्रदेश
          <input required value={form.address_province || ''} onChange={e => setForm({...form, address_province:e.target.value})} placeholder="प्रदेशको नाम"/>
        </label>
        <label className="field">जिल्ला
          <input required value={form.address_district || ''} onChange={e => setForm({...form, address_district:e.target.value})} placeholder="जिल्लाको नाम"/>
        </label>
        <label className="field">स्थानीय तह
          <input required value={form.address_local_level || ''} onChange={e => setForm({...form, address_local_level:e.target.value})} placeholder="महानगरपालिका / उपमहानगरपालिका / नगरपालिका / गाउँपालिका"/>
        </label>
        <label className="field">वडा नम्बर
          <input required type="number" min="1" value={form.address_ward || ''} onChange={e => setForm({...form, address_ward:e.target.value})}/>
        </label>
        <label className="field">टोल
          <input required value={form.address_tole || ''} onChange={e => setForm({...form, address_tole:e.target.value})} placeholder="टोलको नाम"/>
        </label>
        <label className="field">पासपोर्ट साइजको आफ्नो फोटो *
          <input required type="file" accept="image/*" capture="user" onChange={e => setKycPhotoFile(e.target.files?.[0] || null)}/>
        </label>
        <label className="field">कागजातको प्रकार
          <select required value={form.document_type || 'citizenship'} onChange={e => setForm({...form, document_type:e.target.value})}>
            <option value="citizenship">नागरिकता</option>
            <option value="passport">राहदानी</option>
            <option value="national_id">राष्ट्रिय परिचयपत्र</option>
            <option value="license">ड्राइभिङ लाइसेन्स</option>
          </select>
        </label>
        <label className="field">कागजात नम्बर
          <input required value={form.document_number || ''} onChange={e => setForm({...form, document_number:e.target.value})}/>
        </label>
        <label className="field">कागजातको अगाडिको फोटो
          <input required type="file" accept="image/*" capture="environment" onChange={e => setKycFrontFile(e.target.files?.[0] || null)}/>
        </label>
        <label className="field">कागजातको पछाडिको फोटो
          <input required type="file" accept="image/*" capture="environment" onChange={e => setKycBackFile(e.target.files?.[0] || null)}/>
        </label>
        <label className="field">भूमिका / व्यवसायको प्रकार
          <select required value={roleType}
            onChange={e => {
              const category = localStorage.getItem('load_role_category') || '';
              const groups = roleGroups[language] || roleGroups['नेपाली'];
              const group = groups.find(g => g.key === category);
              const selected = group?.options.find(([, name]) => name === e.target.value);
              if (selected) {
                localStorage.setItem('load_role_type', selected[1]);
                localStorage.setItem('load_role', selected[0]);
                setRoleType(selected[1]);
                setRole(selected[0]);
              }
            }}>
            <option value="">आफ्नो प्रकार छान्नुहोस्</option>
            {(roleGroups[language] || roleGroups['नेपाली'])
              .find(g => g.key === (localStorage.getItem('load_role_category') || ''))
              ?.options.map(([key, name], i) => (
                <option key={key + '-' + i} value={name}>{name}</option>
              ))}
          </select>
        </label>
        {(() => {
        const rk = localStorage.getItem('load_role') || '';
        const rt = roleType || localStorage.getItem('load_role_type') || '';
        const isDriver = rk === 'driver';
        const isOwner = rk === 'owner';
        const isTransport = rk === 'transport';
        const isCompany = isTransport && /कम्पनी|company|परिवहन|运输公司/i.test(rt);
        const isPersonal = rt === 'व्यक्तिगत' || rt === 'Individual' || rt === '个人';
        const isShop = /पसले|व्यापारी|Shopkeeper|trader|दुकानदार|店主|贸易商/i.test(rt);
        const isFactory = /फ्याक्ट्री|उद्योग|Factory|industry|工厂|工业/i.test(rt);
        const isContractor = /ठेकेदार|निर्माण कम्पनी|Contractor|construction|承包商|建筑公司/i.test(rt);
        const isOnlineShop = /अनलाइन पसल|वितरक|Online shop|distributor|ऑनलाइन दुकान|网店|分销商/i.test(rt);
        const isOtherBusiness = /अन्य व्यवसाय|Other business|अन्य व्यवसाय|Other business|其他企业/i.test(rt);
        const isBusinessSeeker = isShop || isFactory || isContractor || isOnlineShop || isOtherBusiness;
        const showVehicle = isDriver || isOwner || isTransport;
        const field = (label, key, type='text', required=true) => (
          <label className="field" key={key}>{label}
            <input type={type} required={required}
              value={form[key] || ''}
              onChange={e => setForm(old => ({...old, [key]:e.target.value}))}/>
          </label>
        );
        const fileField = (label, key) => (
          <label className="field" key={key}>{label}
            <input type="file" required accept="image/*,.pdf" capture="environment"
              onChange={e => setKycExtraDocs(old => ({...old, [key]:e.target.files?.[0] || null}))}/>
          </label>
        );
        return <>
          {isPersonal && <section className="panel">
            <h4>व्यक्तिगत सामान ढुवानी विवरण</h4>
            {field('ढुवानीको प्रयोजन','personal_transport_purpose')}
            {field('सामानको प्रकार','personal_goods_type')}
            {field('थप जानकारी','personal_transport_notes','text',false)}
          </section>}
          {isBusinessSeeker && <section className="panel">
            <h4>{isShop ? 'पसल तथा व्यापारी विवरण' : isFactory ? 'फ्याक्ट्री तथा उद्योग विवरण' : isContractor ? 'ठेकेदार तथा निर्माण कम्पनी विवरण' : isOnlineShop ? 'अनलाइन पसल तथा वितरक विवरण' : 'अन्य व्यवसाय तथा संस्था विवरण'}</h4>
            {field(isShop ? 'पसलको नाम' : isFactory ? 'फ्याक्ट्री / उद्योगको नाम' : isContractor ? 'कम्पनी / ठेकेदारको नाम' : isOnlineShop ? 'अनलाइन पसल / वितरकको नाम' : 'व्यवसाय / संस्थाको नाम','business_name')}
            {field('व्यवसायको प्रकार','business_type')}
            {field('व्यवसायको ठेगाना','business_address')}
            {field('प्रतिनिधिको पूरा नाम','business_representative_name')}
            {field('प्रतिनिधिको पद','business_representative_position')}
            {field('दर्ता नम्बर (दर्ता भएको भए)','business_registration_number','text',false)}
            {field('PAN/VAT नम्बर (लागू भएमा)','business_pan_vat_number','text',false)}
            {fileField('व्यवसाय दर्ता प्रमाणपत्र (लागू भएमा)','business_registration_document')}
            {fileField('PAN/VAT प्रमाणपत्र (उपलब्ध भएमा)','business_pan_document')}
            {field('ढुवानी गरिने सामानको प्रकार','business_goods_type')}
          </section>}
          {(isDriver || isOwner) && <section className="panel">
            <h4>ड्राइभिङ लाइसेन्स KYC</h4>
            {field('लाइसेन्स नम्बर','driver_license_number')}
            {field('लाइसेन्सवालाको पूरा नाम','driver_license_name')}
            {field('लाइसेन्सको वर्ग','driver_license_class')}
            {field('लाइसेन्स जारी/बनाएको मिति','driver_license_issue_date','date')}
            {field('लाइसेन्स म्याद सकिने मिति','driver_license_expiry_date','date')}
            {fileField('लाइसेन्सको अगाडिको फोटो','driver_license_front')}
            {fileField('लाइसेन्सको पछाडिको फोटो','driver_license_back')}
          </section>}

          {showVehicle && <section className="panel">
            <h4>गाडी तथा ब्लुबुक KYC</h4>
            <label className="field">गाडीको प्रकार
              <select required value={form.vehicle_type || ''} onChange={e => setForm(old => ({...old, vehicle_type:e.target.value}))}>
                <option value="">गाडी छान्नुहोस्</option>
                <option>साइकल</option><option>मोटरसाइकल</option>
                <option>तीनपाङ्ग्रे कार्गो</option><option>पिकअप</option>
                <option>मिनी ट्रक</option><option>कार्गो भ्यान</option>
                <option>६ चक्के ट्रक</option><option>८ चक्के ट्रक</option>
                <option>१० चक्के ट्रक</option><option>१२ चक्के ट्रक</option>
                <option>१४ चक्के ट्रक</option><option>अन्य व्यावसायिक गाडी</option>
              </select>
            </label>
            {field('गाडी नम्बर','vehicle_number')}
            {field('ब्लुबुक नम्बर','bluebook_number')}
            {field('ब्लुबुकमा लेखिएको गाडीधनीको पूरा नाम','bluebook_owner_name')}
            {field('ब्लुबुक जारी भएको मिति','bluebook_issue_date','date')}
            {field('ब्लुबुक नवीकरण गरेको मिति','bluebook_renewal_date','date')}
            {field('ब्लुबुक नवीकरणको म्याद सकिने मिति','bluebook_expiry_date','date')}
            {field('गाडीको लोड क्षमता (अङ्क)','load_capacity','number')}
            <label className="field">क्षमता एकाइ
              <select required value={form.capacity_unit || 'ton'} onChange={e => setForm(old => ({...old, capacity_unit:e.target.value}))}>
                <option value="kg">केजी</option><option value="ton">टन</option>
              </select>
            </label>
            {field('गाडीको लम्बाइ (फिट)','vehicle_length','number',false)}
            {fileField('ब्लुबुकको अगाडिको फोटो','vehicle_bluebook_front')}
            {fileField('ब्लुबुकको पछाडिको फोटो','vehicle_bluebook_back')}
          </section>}

          {showVehicle && <section className="panel">
            <h4>गाडीको इन्स्योरेन्स KYC</h4>
            {field('बीमा कम्पनीको नाम','insurance_company')}
            {field('बीमा पोलिसी नम्बर','insurance_policy_number')}
            {field('बीमा गरेको मिति','insurance_start_date','date')}
            {field('बीमा सकिने मिति','insurance_expiry_date','date')}
            {fileField('बीमा कागजातको अगाडिको फोटो','vehicle_insurance_front')}
            {fileField('बीमा कागजातको पछाडिको फोटो','vehicle_insurance_back')}
          </section>}

          {isCompany && <section className="panel">
            <h4>यातायात कम्पनी KYC</h4>
            {field('कम्पनीको नाम','company_name')}
            {field('कम्पनी दर्ता नम्बर','company_registration_number')}
            {field('कम्पनी दर्ता भएको मिति','company_issue_date','date')}
            {field('दर्ता प्रमाणपत्रको म्याद सकिने मिति','company_expiry_date','date',false)}
            {fileField('कम्पनी दर्ता प्रमाणपत्र','company_registration')}
          </section>}
        </>;
      })()}
      <p>तपाईंको कागजात निजी भण्डारणमा राखिनेछ।</p>
        <button className="primary">KYC सुरक्षित गर्नुहोस्</button>
      </form>}


      {/* CHAT_BOOKINGS_PAGE */}
      {page === 'bookings' && <div className="panel">
        <h3>मेरा बुकिङ</h3>
        {chatError && <p>{chatError}</p>}
        {vehicleBookingsError && <p style={{color:'#b91c1c'}}>{vehicleBookingsError}</p>}
        <h4>🚚 म्यापबाट गरिएका बुकिङ</h4>
        {vehicleBookings.length === 0 && !vehicleBookingsError && <p>म्याप बुकिङ छैन।</p>}
        {vehicleBookings.map(r => <div key={'vehicle-'+r.id} className="loadcard">
          <b>{r.vehicle_name || r.vehicle_type || 'मालवाहक गाडी'}</b>
          <p>बुकिङकर्ता: {r.requester_name || 'नाम छैन'} · {r.requester_type || ''}</p>
          {r.requester_company && <p>कम्पनी: {r.requester_company}</p>}
          {r.requester_phone && <p>सम्पर्क: {r.requester_phone}</p>}
          <p>उठाउने स्थान: {r.pickup_location || 'उल्लेख छैन'} → गन्तव्य: {r.destination || 'उल्लेख छैन'}</p>
          <p>सामान: {r.cargo_details || 'विवरण छैन'}</p>
          <p>प्रस्तावित भाडा: {r.proposed_fare == null ? 'उल्लेख छैन' : 'रु. '+Number(r.proposed_fare).toLocaleString('en-IN')}</p>
          <p>स्थिति: {{pending:'🟡 निर्णय बाँकी',accepted:'🔵 स्वीकार भयो',rejected:'❌ अस्वीकार भयो',completed:'🏁 पूरा भयो',cancelled:'रद्द भयो'}[r.status] || r.status}</p>
          <small>मिति: {r.created_at ? new Date(r.created_at).toLocaleString() : 'उपलब्ध छैन'}</small>
        </div>)}
        {bookings.length === 0 ? <p>अहिलेसम्म बुकिङ छैन।</p> :
          bookings.map(b => {
            const l = loads.find(x => x.id === b.load_id);
            return <div className="loadcard" key={b.id}>
              <b>{l ? l.origin + ' → ' + l.destination : 'लोड बुकिङ'}</b>
              <p>अवस्था: {{
                completed: '🏁 डेलिभरी पूरा भयो',
                cancelled: '❌ बुकिङ रद्द भयो',
                open: '🟡 बुकिङ अनुरोध पठाइएको',
                accepted: '🔵 बुकिङ स्वीकार भयो',
                rejected: '❌ बुकिङ अस्वीकार भयो',
                in_transit: '🛣️ सामान ढुवानी हुँदैछ'
              }[b.status] || b.status}</p>
              {b.status === 'open' && currentUserId === b.customer_id && <div>
                <button type="button" className="primary" onClick={() => decideLoadBooking(b, true)}>बुकिङ स्वीकार गर्नुहोस्</button>
                <button type="button" onClick={() => decideLoadBooking(b, false)}>बुकिङ अस्वीकार गर्नुहोस्</button>
              </div>}
              {b.cancellation_reason && <p>रद्द गर्ने कारण: {b.cancellation_reason}</p>}
              {b.cancellation_status === 'requested' && <p>रद्द अनुरोधको निर्णय बाँकी छ।</p>}
              {b.cancellation_status === 'requested' && b.cancelled_by !== currentUserId && <div>
                <button type="button" onClick={() => decideBookingCancellation(b, true)}>रद्द स्वीकार गर्नुहोस्</button>
                <button type="button" onClick={() => decideBookingCancellation(b, false)}>रद्द अस्वीकार गर्नुहोस्</button>
              </div>}
              {b.cancellation_status === 'accepted' && <p>रद्द निर्णय: स्वीकार भयो। {b.cancellation_note || ''}</p>}
              {b.cancellation_status === 'rejected' && <p>रद्द निर्णय: अस्वीकार भयो। {b.cancellation_note || ''}</p>}
              {b.status !== 'completed' && b.status !== 'cancelled' && b.cancellation_status !== 'requested' && <button type="button" onClick={() => requestBookingCancellation(b)}>बुकिङ रद्द गर्न अनुरोध गर्नुहोस्</button>}
              {b.status !== 'completed' && b.status !== 'cancelled' && <button type="button" onClick={() => completeBooking(b)}>
                {currentUserId === b.customer_id ? 'डेलिभरी OTP इमेलमा पठाउनुहोस्' : 'ग्राहकको OTP प्रमाणित गर्नुहोस्'}
              </button>}
              {b.status === 'completed' && <p>वास्तविक दूरी: {b.actual_distance_km ?? 'रेकर्ड छैन'} km · भाडा: {b.actual_fare ?? 'रेकर्ड छैन'} रु.</p>}
              <button type="button" onClick={() => {
                setSelectedBooking(b);
                setChatMessages([]);
                setChatError('');
                go('chat');
              }}>निजी च्याट खोल्नुहोस्</button>
            </div>;
          })}
      </div>}

      {page === 'chat' && <div className="panel">
        <h3>निजी च्याट</h3>
        {chatError && <p>{chatError}</p>}
        <div style={{maxHeight:300,overflowY:'auto'}}>
          {chatMessages.map(m => <p key={m.id}
            style={{textAlign:m.sender_id === currentUserId ? 'right' : 'left'}}>
            <span style={{display:'inline-block',padding:8,borderRadius:8,
              background:m.sender_id === currentUserId ? '#ffe4cc' : '#edf2f7',
              color:'#102b46',overflowWrap:'anywhere'}}>{m.body}</span>
          </p>)}
        </div>
        <form onSubmit={e => {e.preventDefault();sendChatText(chatDraft);}}
          style={{display:'flex',gap:8}}>
          <input value={chatDraft} onChange={e => setChatDraft(e.target.value)}
            placeholder="म्यासेज लेख्नुहोस्" style={{flex:1,minWidth:0}} />
          <button type="submit">पठाउनुहोस्</button>
        </form>
        <button type="button" onClick={() => go('bookings')}>बुकिङमा फर्कनुहोस्</button>
      </div>}

      {page === 'notifications' && <div className="panel">
        <h3>{tr('सूचनाहरू')}</h3>
        {notificationsError && <p>{notificationsError}</p>}
        {notifications.length === 0
          ? <p>{tr('अहिले कुनै सूचना छैन।')}</p>
          : notifications.map(n => <button key={n.id} type="button"
              onClick={async () => {
                if (!n.is_read) {
                  const { error } = await supabase.from('load_notifications')
                    .update({ is_read: true }).eq('id', n.id);
                  if (!error) setNotifications(old => old.map(x =>
                    x.id === n.id ? {...x, is_read:true} : x));
                }
              }}
              style={{display:'block',width:'100%',textAlign:'left',padding:12,
                marginBottom:8,border:'1px solid #ddd',borderRadius:10,
                background:n.is_read?'white':'#fff3e8',color:'#102b46'}}>
              <b>{n.is_read ? '✓ ' + tr('पढिएको') : '🔔 ' + tr('नयाँ')}</b>
              <p>{tr(n.title_key)}</p>
              <small>{tr(n.body_key)}</small>
            </button>)}
      </div>}

      {page === 'post' && <form onSubmit={save} className="panel">
        <h3>{tr('नयाँ लोडको विवरण')}</h3>
        {field(tr('लोड दिने व्यक्ति/कम्पनी'), 'sender')}
        {field(tr('सामान कहाँबाट उठाउने?'), 'origin')}
        <button type="button" className="primary" onClick={() => {
          if (!navigator.geolocation) {
            setMessage('यो मोबाइलमा GPS उपलब्ध छैन।');
            return;
          }
          navigator.geolocation.getCurrentPosition(
            pos => {
              setForm(prev => ({
                ...prev,
                origin_latitude: pos.coords.latitude,
                origin_longitude: pos.coords.longitude
              }));
              setMessage('पिकअप GPS स्थान प्राप्त भयो।');
            },
            err => setMessage('GPS स्थान लिन सकिएन। मोबाइलको Location अनुमति खोल्नुहोस्।'),
            { enableHighAccuracy: true, timeout: 15000 }
          );
        }}>📍 पिकअप GPS स्थान लिनुहोस्</button>
        {form.origin_latitude != null && <small>GPS स्थान सुरक्षित गर्न तयार छ ✓</small>}
        {field(tr('सामान कहाँ पुर्‍याउने?'), 'destination')}
        {field(tr('सामानको नाम'), 'cargo')}
        {field(tr('तौल (टन/केजी)'), 'weight')}
        {field(tr('प्रस्तावित भाडा (रु.)'), 'price', 'number')}
        {field(tr('सम्पर्क नम्बर'), 'phone', 'tel')}
        <button className="primary">{tr('लोड सुरक्षित गर्नुहोस्')}</button>
      </form>}

      {page === 'loads' && <div className="panel">
        <h3>🚚 गाडी उपलब्ध गराउनुहोस् — लोडका लागि पोस्ट</h3>
        <p>गाडीको स्थायी विवरण स्वीकृत KYC बाट स्वतः भरिन्छ।</p>
        <form onSubmit={save} className="panel">
          <div className="field"><label>गाडीधनी / सेवा प्रदायक</label><input value={providerVehicle.name || ''} readOnly /></div>
          <div className="field"><label>गाडी नम्बर (स्वीकृत KYC)</label><input value={providerVehicle.number || ''} readOnly /></div>
          <div className="field"><label>गाडीको प्रकार (स्वीकृत KYC)</label><input value={providerVehicle.type || ''} readOnly /></div>
          <div className="field"><label>लोड क्षमता (स्वीकृत KYC)</label><input value={providerVehicle.capacity ? providerVehicle.capacity + ' ' + (providerVehicle.unit || 'ton') : ''} readOnly /></div>
          <div className="field"><label>सम्पर्क नम्बर</label><input type="tel" value={form.provider_phone ?? providerVehicle.phone ?? ''} onChange={e => setForm(prev => ({...prev, provider_phone:e.target.value}))} required /></div>
          <div className="field"><label>गाडीको हालको स्थान</label><input value={form.provider_origin || ''} onChange={e => setForm(prev => ({...prev, provider_origin:e.target.value}))} required /></div>
          <button type="button" className="primary" onClick={() => {
            if (!navigator.geolocation) {
              setMessage('यो मोबाइलमा GPS उपलब्ध छैन।');
              return;
            }
            navigator.geolocation.getCurrentPosition(
              pos => {
                setForm(prev => ({
                  ...prev,
                  provider_origin_latitude: pos.coords.latitude,
                  provider_origin_longitude: pos.coords.longitude,
                  provider_origin: prev.provider_origin || 'GPS स्थान प्राप्त भयो'
                }));
                setMessage('गाडीको GPS स्थान प्राप्त भयो।');
              },
              () => setMessage('GPS स्थान लिन सकिएन। मोबाइलको Location अनुमति खोल्नुहोस्।'),
              {enableHighAccuracy:true, timeout:15000}
            );
          }}>📍 हालको GPS स्थान लिनुहोस्</button>
          {form.provider_origin_latitude != null && <small>GPS स्थान प्राप्त भयो ✓</small>}
          <div className="field"><label>गाडी जान सक्ने गन्तव्य</label><input value={form.provider_destination || ''} onChange={e => setForm(prev => ({...prev, provider_destination:e.target.value}))} required /></div>
          <div className="field"><label>उपलब्ध हुने मिति/समय (वैकल्पिक)</label><input type="datetime-local" value={form.provider_available_at || ''} onChange={e => setForm(prev => ({...prev, provider_available_at:e.target.value}))} /></div>
          <div className="field"><label>प्रस्तावित भाडा (रु., वैकल्पिक)</label><input type="number" min="0" value={form.provider_price || ''} onChange={e => setForm(prev => ({...prev, provider_price:e.target.value}))} /></div>
          {!providerVehicle.number && <p>गाडीको विवरण नदेखिए स्वीकृत KYC जाँच गर्नुहोस्।</p>}
          <button className="primary" type="submit" disabled={!providerVehicle.number || !providerVehicle.type}>🚚 गाडीको पोस्ट सुरक्षित गर्नुहोस्</button>
        </form>
        
      </div>}

      {page === 'truck' && <div className="panel">
<h3>🚚 गाडी उपलब्ध गराउनुहोस्</h3>
<p>गाडीको प्रकार, नम्बर र क्षमता स्वीकृत KYC बाट देखाइनेछ।</p>
<div className="field"><label>गाडीधनी / सेवा प्रदायक</label><input value={providerVehicle.name || ""} readOnly /></div>
<div className="field"><label>सम्पर्क नम्बर</label><input value={providerVehicle.phone || ""} readOnly /></div>
<div className="field"><label>गाडी नम्बर</label><input value={providerVehicle.number || ""} readOnly /></div>
<div className="field"><label>गाडीको प्रकार</label><input value={providerVehicle.type || ""} readOnly /></div>
<div className="field"><label>लोड क्षमता</label><input value={providerVehicle.capacity ? providerVehicle.capacity + " " + providerVehicle.unit : ""} readOnly /></div>
{!providerVehicle.number && <p>गाडीको विवरण नदेखिए स्वीकृत KYC जाँच गर्नुहोस्।</p>}
<button type="button" className="primary" onClick={() => go('loads')}>उपलब्ध लोडहरू हेर्नुहोस्</button>
</div>}

      {['license', 'bluebook', 'insurance'].includes(page) &&
        <form onSubmit={save} className="panel">
          <h3>{titles[page]}</h3>
          {page === 'license' && <>
            {field(tr('ड्राइभरको पूरा नाम'), 'driver')}
            {field(tr('लाइसेन्स नम्बर'), 'licenseNo')}
            {field(tr('लाइसेन्स वर्ग'), 'licenseClass')}
            {field(tr('म्याद सकिने मिति'), 'expiry', 'date')}
            {field(tr('लाइसेन्सको फोटो'), 'licensePhoto', 'file')}
          </>}
          {page === 'bluebook' && <>
            {field(tr('गाडी नम्बर'), 'vehicleNo')}
            {field(tr('गाडी धनीको नाम'), 'owner')}
            {field(tr('दर्ता/नवीकरण मिति'), 'renewal', 'date')}
            {field(tr('ब्लुबुकको फोटो'), 'bluebookPhoto', 'file')}
          </>}
          {page === 'insurance' && <>
            {field(tr('गाडी नम्बर'), 'vehicleNo')}
            {field(tr('बीमा कम्पनीको नाम'), 'insurer')}
            {field(tr('पोलिसी नम्बर'), 'policyNo')}
            {field(tr('बीमा सुरु मिति'), 'startDate', 'date')}
            {field(tr('बीमा सकिने मिति'), 'expiry', 'date')}
            {field(tr('बीमा कागजातको फोटो'), 'insurancePhoto', 'file')}
          </>}
          <button className="primary">{tr('विवरण सुरक्षित गर्नुहोस्')}</button>
        </form>}

      {page === 'company' && <form onSubmit={save} className="panel">
        <h3>{tr(tr('कम्पनीको विवरण'))}</h3>
        {field('कम्पनीको नाम', 'companyName')}
        {field(tr('दर्ता नम्बर'), 'registration')}
        {field(tr('कम्पनीको ठेगाना'), 'address')}
        {field(tr('सम्पर्क नम्बर'), 'phone', 'tel')}
        {field(tr('इमेल'), 'email', 'email')}
        {field(tr('कम्पनी दर्ता कागजात'), 'companyDoc', 'file')}
        <button className="primary">{tr('कम्पनीको विवरण सुरक्षित गर्नुहोस्')}</button>
      </form>}

      {page === 'waybill' && <form onSubmit={save} className="panel">
        <h3>{tr('ढुवानी / भाडाको चलानी')}</h3>
        {field(tr('चलानी नम्बर'), 'billNo')}
        {field(tr('चलानी मिति'), 'billDate', 'date')}
        {field(tr('पठाउने व्यक्ति/कम्पनी'), 'sender')}
        {field(tr('प्राप्त गर्ने व्यक्ति/कम्पनी'), 'receiver')}
        {field(tr('सामानको विवरण'), 'cargo')}
        {field(tr('गाडी नम्बर'), 'vehicleNo')}
        {field('ड्राइभरको नाम', 'driver')}
        {field(tr('उठाउने स्थान'), 'origin')}
        {field(tr('पुर्‍याउने स्थान'), 'destination')}
        {field(tr('भाडा रकम (रु.)'), 'price', 'number')}
        {field(tr('सम्पर्क नम्बर'), 'phone', 'tel')}
        <button className="primary">{tr('चलानी सुरक्षित गर्नुहोस्')}</button>
      </form>}


      {(page.startsWith('settings-') || page === 'admin-application') && <div className={page.startsWith('settings-admin-') ? "panel admin-dashboard" : "panel"}>
        {['settings-admin-dashboard','settings-admin-applications','settings-admin-kyc','settings-admin-support','settings-admin-loads','settings-admin-bookings','settings-admin-users','settings-admin-payments','settings-admin-disputes','settings-admin-settings'].includes(page) && <>
          <h3>{({'settings-admin-dashboard':'Admin Dashboard / प्रशासक ड्यासबोर्ड','settings-admin-applications':'Admin Applications / प्रशासक आवेदन','settings-admin-kyc':'User KYC / प्रयोगकर्ता प्रमाणिकरण','settings-admin-support':'Customer Support / ग्राहक सहायता','settings-admin-loads':'Loads / ढुवानी','settings-admin-bookings':'Bookings / बुकिङ','settings-admin-users':'User Management / प्रयोगकर्ता व्यवस्थापन','settings-admin-payments':'Payments / भुक्तानी','settings-admin-disputes':'Disputes / विवाद','settings-admin-settings':'Settings / सेटिङ'})[page]}</h3>
            <div className="admin-nav">
              {[['settings-admin-dashboard','Dashboard',0],['settings-admin-applications','Admin Applications',adminApplications.filter(a=>String(a.status||'').toLowerCase()==='pending').length],['settings-admin-kyc','User KYC',adminKyc.filter(k=>String(k.status||'').toLowerCase()==='pending').length],['settings-admin-support','Customer Support',adminSupportPendingCount],['settings-admin-loads','Loads / ढुवानी',adminLoads.filter(l=>String(l.status||'').toLowerCase()==='open').length],['settings-admin-bookings','Bookings / बुकिङ',adminBookings.filter(b=>String(b.status||'').toLowerCase()==='pending'||['pending','requested'].includes(String(b.cancellation_status||'').toLowerCase())).length],['settings-admin-users','User Management',adminUsers.filter(u=>String(u.account_status||'').toLowerCase()==='inactive').length],['settings-admin-payments','Payments / भुक्तानी',adminPayments.filter(x=>!['completed','paid','success','succeeded','refunded','cancelled','canceled'].includes(String(x.status||'').toLowerCase())).length],['settings-admin-disputes','Disputes / विवाद',adminDisputes.filter(x=>['open','investigating','pending'].includes(String(x.status||'').toLowerCase())).length],['settings-admin-settings','Settings / सेटिङ',0]].map(([key,label,count])=><button key={key} type="button" onClick={()=>go(key)} style={{position:'relative',paddingRight:Number.isFinite(count)&&count>0?38:12}}>{label}{Number.isFinite(count)&&count>0&&<span style={{position:'absolute',top:3,right:4,minWidth:20,height:20,padding:'0 4px',boxSizing:'border-box',borderRadius:12,background:'#e00000',color:'white',fontSize:10,fontWeight:700,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{count<=5?count:Math.floor((count-1)/5)*5+'+'}</span>}</button>)}
            </div>
            {page === 'settings-admin-dashboard' && isAppAdmin && <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,margin:'16px 0'}}>
              {[['कुल Loads',adminLoads.length],['कुल Bookings',adminBookings.length],['खुला Loads',adminLoads.filter(x=>x.status==='open').length],['रद्द अनुरोध',adminBookings.filter(x=>['pending','requested'].includes(String(x.cancellation_status||'').toLowerCase())).length]].map(([label,count])=><div key={label} style={{padding:16,border:'1px solid #dce5ef',borderRadius:12,background:'#f7f9fc'}}><div style={{color:'#52657a',fontSize:14}}>{label}</div><strong style={{fontSize:28,color:'#102b46'}}>{count}</strong></div>)}
              <button type="button" onClick={()=>go('settings-admin-loads')}>Loads सूची खोल्नुहोस्</button>
              <button type="button" onClick={()=>go('settings-admin-bookings')}>Bookings सूची खोल्नुहोस्</button>
            </div>}
            {isAppAdmin && <div className="admin-global-search" style={{margin:'12px 0 22px'}}>
              <input value={adminGlobalSearch} onChange={e=>setAdminGlobalSearch(e.target.value)} placeholder="सबै Admin विवरण खोज्नुहोस्..." aria-label="Global admin search" style={{width:'100%',boxSizing:'border-box',padding:13,border:'1px solid #d2dce8',borderRadius:10}} />
              {adminGlobalSearch.trim() && <div style={{marginTop:8}}>
                {adminApplications.filter(a=>[a.full_name,a.email,a.phone,a.id_type,a.id_number,a.status,a.application_reason].some(v=>String(v||'').toLowerCase().includes(adminGlobalSearch.trim().toLowerCase()))).slice(0,8).map(a=><button key={'app-'+a.id} type="button" onClick={()=>go('settings-admin-applications')} style={{display:'block',width:'100%',textAlign:'left',padding:10,marginBottom:6,border:'1px solid #e1e8f0',borderRadius:8,background:'#fff',color:'#102b46'}}>Admin Application: {a.full_name||a.email||a.phone||a.id} · {a.status}</button>)}
                {adminKyc.filter(k=>[k.full_name,k.phone,k.document_type,k.document_number,k.status].some(v=>String(v||'').toLowerCase().includes(adminGlobalSearch.trim().toLowerCase()))).slice(0,8).map(k=><button key={'kyc-'+k.id} type="button" onClick={()=>go('settings-admin-kyc')} style={{display:'block',width:'100%',textAlign:'left',padding:10,marginBottom:6,border:'1px solid #e1e8f0',borderRadius:8,background:'#fff',color:'#102b46'}}>User KYC: {k.full_name||k.phone||k.id} · {k.status}</button>)}
{adminLoads.filter(l=>[l.origin,l.destination,l.cargo,l.status,l.owner_id].some(v=>String(v||'').toLowerCase().includes(adminGlobalSearch.trim().toLowerCase()))).slice(0,8).map(l=><button key={'load-'+l.id} type="button" onClick={()=>go('settings-admin-loads')} style={{display:'block',width:'100%',textAlign:'left',padding:10,marginBottom:6,border:'1px solid #e1e8f0',borderRadius:8,background:'#fff',color:'#102b46'}}>Load: {l.origin||'—'} → {l.destination||'—'} · {l.status}</button>)}
{adminBookings.filter(b=>[b.id,b.load_id,b.customer_id,b.driver_id,b.status,b.cancellation_status].some(v=>String(v||'').toLowerCase().includes(adminGlobalSearch.trim().toLowerCase()))).slice(0,8).map(b=><button key={'booking-'+b.id} type="button" onClick={()=>go('settings-admin-bookings')} style={{display:'block',width:'100%',textAlign:'left',padding:10,marginBottom:6,border:'1px solid #e1e8f0',borderRadius:8,background:'#fff',color:'#102b46'}}>Booking: {b.id} · {b.status}</button>)}
                {['settings-admin-dashboard','settings-admin-applications','settings-admin-kyc','settings-admin-support','settings-admin-loads','settings-admin-bookings','settings-admin-users','settings-admin-payments','settings-admin-disputes'].filter(key=>({'settings-admin-dashboard':'dashboard प्रशासक','settings-admin-applications':'application आवेदन admin','settings-admin-kyc':'kyc प्रमाणिकरण user','settings-admin-support':'support सहायता complaint ग्राहक','settings-admin-loads':'loads ढुवानी सामान','settings-admin-bookings':'bookings बुकिङ reservation','settings-admin-users':'users प्रयोगकर्ता account खाता','settings-admin-payments':'payments भुक्तानी transaction','settings-admin-disputes':'disputes विवाद refund उजुरी','settings-admin-settings':'settings सेटिङ configuration कन्फिगरेसन'})[key].includes(adminGlobalSearch.trim().toLowerCase())).map(key=><button key={key} type="button" onClick={()=>go(key)} style={{display:'block',padding:10,marginBottom:6}}>{({'settings-admin-dashboard':'Dashboard','settings-admin-applications':'Admin Applications','settings-admin-kyc':'User KYC','settings-admin-support':'Customer Support','settings-admin-loads':'Loads / ढुवानी','settings-admin-bookings':'Bookings / बुकिङ','settings-admin-users':'User Management','settings-admin-payments':'Payments','settings-admin-disputes':'Disputes','settings-admin-settings':'Settings'})[key]} खोल्नुहोस्</button>)}
              </div>}
            </div>}
          {!isAppAdmin ? <p>Admin अनुमति प्रमाणित छैन। Account बाट Admin Login गर्नुहोस्।</p> : <>
            {page === 'settings-admin-support' && <AdminSupportPanel supabase={supabase} />}
            {page !== 'settings-admin-support' && adminKycMessage && <p>{adminKycMessage}</p>}
            {page === 'settings-admin-payments' && <><h3>Payments / भुक्तानी</h3><p>{adminOperationsMessage}</p>{adminPayments.map(x=><details key={x.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0',overflowWrap:'anywhere'}}><summary>रु. {x.amount} {x.currency} · {x.status}</summary><p>Payment ID: {x.id}</p><p>Booking ID: {x.booking_id||'—'}</p><p>भुक्तानी गर्ने User ID: {x.payer_id||'—'}</p><p>पाउने User ID: {x.payee_id||'—'}</p><p>माध्यम: {x.method||'—'}</p><p>Transaction reference: {x.transaction_reference||'—'}</p><p>मिति: {x.created_at?new Date(x.created_at).toLocaleString():'—'}</p></details>)}{adminPayments.length===0&&<p>भुक्तानी विवरण छैन वा डाटाबेस अनुमति जाँच आवश्यक छ।</p>}</>}
{page === 'settings-admin-disputes' && <><h3>Disputes / भुक्तानी विवाद</h3><p>{adminOperationsMessage}</p>{adminDisputes.map(x=><details key={x.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0',overflowWrap:'anywhere'}}><summary>{x.status} · {x.reason}</summary><p>Dispute ID: {x.id}</p><p>Payment ID: {x.payment_id}</p><p>उजुरीकर्ता User ID: {x.raised_by||'—'}</p><p>कारण: {x.reason}</p><p>Admin note: {x.admin_note||'—'}</p>
<select value={x.status} onChange={e=>setAdminDisputes(rows=>rows.map(r=>r.id===x.id?{...r,status:e.target.value}:r))} style={{width:'100%',padding:10,marginTop:8}}><option value="open">खुला</option><option value="investigating">जाँच हुँदै</option><option value="resolved">समाधान भयो</option><option value="rejected">अस्वीकृत</option></select>
<textarea value={x.admin_note||''} onChange={e=>setAdminDisputes(rows=>rows.map(r=>r.id===x.id?{...r,admin_note:e.target.value}:r))} placeholder="Admin टिप्पणी" style={{width:'100%',padding:10,marginTop:8,boxSizing:'border-box'}}/>
<button type="button" onClick={async()=>{const {error}=await supabase.from('payment_disputes').update({status:x.status,admin_note:x.admin_note||null,resolved_at:x.status==='resolved'?new Date().toISOString():null}).eq('id',x.id);setAdminOperationsMessage(error?'विवाद सुरक्षित भएन: '+error.message:'विवादको विवरण सुरक्षित भयो।');}} style={{padding:10,marginTop:8}}>परिवर्तन सुरक्षित गर्नुहोस्</button>
<p>मिति: {x.created_at?new Date(x.created_at).toLocaleString():'—'}</p></details>)}{adminDisputes.length===0&&<p>विवाद विवरण छैन वा डाटाबेस अनुमति जाँच आवश्यक छ।</p>}</>}
{page === 'settings-admin-settings' && <><h3>एप सेटिङ र सेवा अवस्था</h3>
<div style={{border:'1px solid #ddd',borderRadius:10,padding:14,margin:'10px 0'}}>
<p><b>एप:</b> Load</p><p><b>मुख्य सेवा:</b> सामान ढुवानी र बुकिङ</p>
<p><b>भुक्तानी Gateway:</b> जोडिएको छैन</p><p><b>eSewa / Khalti:</b> जोडिएको छैन</p>
<p><b>इमेल OTP:</b> हालको Brevo सेटअप परिवर्तन गरिएको छैन</p>
<p><b>Admin अनुमति:</b> is_app_admin() बाट जाँच</p>
<p><b>सुरक्षा:</b> भुक्तानी र विवादका तालिकामा RLS सक्षम गरिएको छ</p>
</div><p>नोट: यहाँ देखाइएको अवस्था हालको कोड र डाटाबेस सेटअपमा आधारित छ; वास्तविक कारोबार परीक्षण गरिएको छैन।</p></>}
{page === 'settings-admin-users' && <><h3>प्रयोगकर्ता व्यवस्थापन</h3><input value={adminUsersSearch} onChange={e=>setAdminUsersSearch(e.target.value)} placeholder="नाम, फोन, इमेल वा User ID खोज्नुहोस्" style={{width:'100%',padding:12,boxSizing:'border-box'}}/><p>{adminOperationsMessage}</p>{adminUsers.filter(u=>[u.display_name,u.phone,u.email,u.user_id,u.account_status].some(v=>String(v||'').toLowerCase().includes(adminUsersSearch.toLowerCase()))).map(u=><details key={u.user_id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0',overflowWrap:'anywhere'}}><summary>{u.display_name||'नाम छैन'} · {u.account_status||'स्थिति छैन'}</summary><p>फोन: {u.phone||'—'}</p><p>इमेल: {u.email||'—'}</p><p>ठेगाना: {u.address||'—'}</p><p>User ID: {u.user_id}</p><p>खाता स्थिति: {u.account_status||'—'}</p></details>)}{adminUsers.length===0&&<p>प्रयोगकर्ता सूची खाली छ वा डाटाबेसले पहुँच दिएन।</p>}</>}
{page === 'settings-admin-loads' && <><h3>Loads / ढुवानी सूची</h3><input value={adminOperationsSearch} onChange={e=>setAdminOperationsSearch(e.target.value)} placeholder="स्थान, सामान वा स्थिति खोज्नुहोस्" style={{width:'100%',padding:12,boxSizing:'border-box'}}/><select value={adminOperationsFilter} onChange={e=>setAdminOperationsFilter(e.target.value)} style={{width:'100%',padding:12,marginTop:8}}><option value="all">सबै स्थिति</option><option value="open">खुला</option><option value="completed">पूरा</option><option value="cancelled">रद्द</option></select><p>{adminOperationsMessage}</p>{adminLoads.filter(l=>(adminOperationsFilter==='all'||String(l.status||'').toLowerCase()===adminOperationsFilter)&&[l.origin,l.destination,l.cargo,l.status,l.owner_id].some(v=>String(v||'').toLowerCase().includes(adminOperationsSearch.toLowerCase()))).map(l=><details key={l.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0',overflowWrap:'anywhere'}}><summary>{l.origin||'स्थान छैन'} → {l.destination||'स्थान छैन'} · {l.status}</summary><p>सामान: {l.cargo||'—'}</p><p>तौल: {l.weight??'—'}</p><p>भाडा: रु. {l.proposed_price??'—'}</p><p>लोड ID: {l.id}</p><p>मालिक ID: {l.owner_id}</p><p>मिति: {l.created_at?new Date(l.created_at).toLocaleString():'—'}</p></details>)}{adminLoads.length===0&&<p>लोड भेटिएन वा डाटाबेस अनुमति जाँच आवश्यक छ।</p>}</>}
{page === 'settings-admin-bookings' && <><h3>Bookings / बुकिङ सूची</h3><input value={adminOperationsSearch} onChange={e=>setAdminOperationsSearch(e.target.value)} placeholder="बुकिङ ID, स्थिति वा प्रयोगकर्ता ID खोज्नुहोस्" style={{width:'100%',padding:12,boxSizing:'border-box'}}/><select value={adminOperationsFilter} onChange={e=>setAdminOperationsFilter(e.target.value)} style={{width:'100%',padding:12,marginTop:8}}><option value="all">सबै स्थिति</option><option value="pending">प्रतीक्षामा</option><option value="completed">पूरा</option><option value="cancelled">रद्द</option></select><p>{adminOperationsMessage}</p>{adminBookings.filter(b=>(adminOperationsFilter==='all'||String(b.status||'').toLowerCase()===adminOperationsFilter)&&[b.id,b.load_id,b.customer_id,b.driver_id,b.status,b.cancellation_status,b.cancellation_reason].some(v=>String(v||'').toLowerCase().includes(adminOperationsSearch.toLowerCase()))).map(b=><details key={b.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0',overflowWrap:'anywhere'}}><summary>बुकिङ {b.id} · {{completed:'✅ डेलिभरी पूरा',cancelled:'❌ रद्द भयो',pending:'🕒 प्रतीक्षामा',open:'🕒 प्रतीक्षामा',accepted:'🤝 स्वीकार भयो',rejected:'❌ अस्वीकार भयो',in_transit:'🚚 ढुवानी हुँदैछ'}[b.status] || b.status}</summary><p>लोड ID: {b.load_id}</p><p>ग्राहक ID: {b.customer_id}</p><p>ड्राइभर ID: {b.driver_id}</p><p>दूरी: {b.actual_distance_km??'—'} km</p><p>वास्तविक भाडा: रु. {b.actual_fare??'—'}</p><p>रद्द अवस्था: {b.cancellation_status||'—'}</p><p>रद्द कारण: {b.cancellation_reason||'—'}</p><p>मिति: {b.created_at?new Date(b.created_at).toLocaleString():'—'}</p></details>)}{adminBookings.length===0&&<p>बुकिङ भेटिएन वा डाटाबेस अनुमति जाँच आवश्यक छ।</p>}</>}
{page === 'settings-admin-applications' && <><h3>Admin आवेदनहरू / Admin Applications</h3>
            {adminApplicationsMessage && <p>{adminApplicationsMessage}</p>}
            {adminApplications.length===0 && !adminApplicationsMessage && <p>अहिलेसम्म आवेदन छैन।</p>}
            {adminApplications.map(a=><details key={a.id} style={{border:"1px solid #ddd",borderRadius:10,padding:12,margin:"10px 0",overflowWrap:"anywhere"}}><summary style={{fontWeight:700,cursor:"pointer"}}>{a.full_name} · {a.status}</summary><p>इमेल: {a.email}</p><p>फोन: {a.phone}</p><p>कागजात: {a.id_type} · {a.id_number}</p><p>कारण: {a.application_reason||"-"}</p><p>कार्ययोजना: {a.work_plan||"-"}</p>{a.admin_note&&<p>Admin टिप्पणी: {a.admin_note}</p>}{isRootAdmin && a.status==="pending"&&<><button type="button" className="primary" onClick={async()=>{const {error}=await supabase.rpc("review_admin_application",{p_application_id:a.id,p_decision:"approved",p_admin_note:"स्वीकृत"});if(error)setAdminApplicationsMessage("स्वीकृत भएन: "+error.message);else{setAdminApplications(old=>old.map(x=>x.id===a.id?{...x,status:"approved",admin_note:"स्वीकृत"}:x));setAdminApplicationsMessage("आवेदन स्वीकृत भयो।")}}}>Approve / स्वीकृत</button><button type="button" style={{marginLeft:8,padding:10}} onClick={async()=>{const note=prompt("अस्वीकृत गर्नुको कारण लेख्नुहोस्:");if(note===null)return;const {error}=await supabase.rpc("review_admin_application",{p_application_id:a.id,p_decision:"rejected",p_admin_note:note});if(error)setAdminApplicationsMessage("Reject भएन: "+error.message);else{setAdminApplications(old=>old.map(x=>x.id===a.id?{...x,status:"rejected",admin_note:note}:x));setAdminApplicationsMessage("आवेदन अस्वीकृत भयो।")}}}>Reject / अस्वीकृत</button></>}</details>)}
            </>}{page === 'settings-admin-kyc' && <>{adminStats && <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:8,margin:'12px 0'}}>
              {[
                ['कुल खाता',adminStats.total_accounts],
                ['प्रोफाइल',adminStats.profile_count],
                ['Admin',adminStats.admin_count],
                ['KYC प्रतीक्षामा',adminStats.pending_kyc],
                ['KYC स्वीकृत',adminStats.approved_kyc],
                ['KYC अस्वीकृत',adminStats.rejected_kyc]
              ].map(([label,count])=><div key={label} style={{padding:12,border:'1px solid #ddd',borderRadius:10}}><div>{label}</div><strong style={{fontSize:24}}>{count ?? 0}</strong></div>)}
            </div>}
            <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}>
              {['all','pending','approved','rejected'].map(status=><button key={status} type="button" onClick={()=>setAdminKycFilter(status)} style={{padding:8,background:adminKycFilter===status?'#0B192C':'',color:adminKycFilter===status?'white':''}}>{({all:'सबै',pending:'प्रतीक्षामा',approved:'स्वीकृत',rejected:'अस्वीकृत'})[status]} ({adminKyc.filter(k=>status==='all'||k.status===status).length})</button>)}
            </div>
            <input value={adminKycSearch} onChange={e=>setAdminKycSearch(e.target.value)} placeholder="नाम, फोन वा कागजात खोज्नुहोस्" style={{width:'100%',padding:12,marginBottom:10,boxSizing:'border-box'}} />
            {adminKyc.filter(k=>(adminKycFilter==='all'||k.status===adminKycFilter)&&[k.full_name,k.phone,k.document_type,k.document_number].some(v=>String(v||'').toLowerCase().includes(adminKycSearch.toLowerCase()))).map(k=><details key={k.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0',overflowWrap:'anywhere'}}>
              <summary style={{cursor:'pointer',fontWeight:700}}>{k.full_name||'नाम छैन'} · {k.phone||'फोन छैन'}<p style={{fontWeight:400,margin:'6px 0'}}>कागजात: {k.document_type||'उपलब्ध छैन'} · {k.created_at?new Date(k.created_at).toLocaleDateString():'मिति छैन'}</p><span>{({pending:'🟠 प्रतीक्षामा',approved:'🟢 स्वीकृत',rejected:'🔴 अस्वीकृत'})[k.status]||k.status}</span></summary>
              <p>प्रयोगकर्ता ID: {k.user_id}</p><p>कागजात नम्बर: {k.document_number||'उपलब्ध छैन'}</p>
              {k.admin_note&&<p>टिप्पणी: {k.admin_note}</p>}{k.fileError&&<p>फाइल समस्या: {k.fileError}</p>}{k.photoUrl&&<div><p>पासपोर्ट साइजको फोटो</p><a href={k.photoUrl} target="_blank" rel="noreferrer">फोटो खोल्नुहोस्</a><img src={k.photoUrl} alt="पासपोर्ट साइजको फोटो" style={{display:'block',width:100,height:100,objectFit:'cover',borderRadius:'50%',marginTop:8}} /></div>}
              {k.role_details&&Object.entries(k.role_details).some(([key,value])=>value!==''&&value!==null&&value!==undefined)&&<div style={{background:'#eef5ff',padding:12,borderRadius:8,margin:'10px 0',overflowWrap:'anywhere'}}><h4 style={{margin:'0 0 8px'}}>भूमिका अनुसार KYC विवरण</h4>{Object.entries(k.role_details).filter(([key,value])=>value!==''&&value!==null&&value!==undefined).map(([key,value])=><p key={key} style={{margin:'4px 0'}}><b>{{personal_transport_purpose:'ढुवानीको उद्देश्य',personal_goods_type:'सामानको प्रकार',personal_transport_notes:'थप विवरण',business_name:'व्यवसायको नाम',business_type:'व्यवसायको प्रकार',business_address:'व्यवसायको ठेगाना',business_representative_name:'प्रतिनिधिको नाम',business_representative_position:'प्रतिनिधिको पद',business_registration_number:'व्यवसाय दर्ता नम्बर',business_pan_vat_number:'PAN/VAT नम्बर',business_goods_type:'ढुवानी गर्ने सामान',driver_license_number:'लाइसेन्स नम्बर',driver_license_name:'लाइसेन्सधारीको नाम',driver_license_class:'लाइसेन्स वर्ग',driver_license_issue_date:'लाइसेन्स जारी मिति',driver_license_expiry_date:'लाइसेन्स म्याद',vehicle_type:'गाडीको प्रकार',vehicle_number:'गाडी नम्बर',bluebook_number:'ब्लुबुक नम्बर',bluebook_owner_name:'ब्लुबुकमा भएको गाडीधनी',bluebook_issue_date:'ब्लुबुक जारी मिति',bluebook_renewal_date:'ब्लुबुक नवीकरण मिति',bluebook_expiry_date:'ब्लुबुक म्याद',load_capacity:'भारवहन क्षमता',capacity_unit:'क्षमता एकाइ',vehicle_length:'गाडीको लम्बाइ',insurance_company:'बीमा कम्पनी',insurance_policy_number:'बीमा पोलिसी नम्बर',insurance_start_date:'बीमा सुरु मिति',insurance_expiry_date:'बीमा म्याद',company_name:'कम्पनीको नाम',company_registration_number:'कम्पनी दर्ता नम्बर',company_issue_date:'कम्पनी दर्ता मिति',company_expiry_date:'कम्पनी दर्ता म्याद',role_type:'छानिएको भूमिका'}[key]||key}:</b> {String(value)}</p>)}</div>}{k.frontUrl&&<div><p>अगाडिको कागजात</p><a href={k.frontUrl} target="_blank" rel="noreferrer">फोटो खोल्नुहोस्</a><img src={k.frontUrl} alt="अगाडिको कागजात" style={{display:'block',width:'100%',maxWidth:360,marginTop:8,borderRadius:8}} /></div>}
              {k.backUrl&&<div><p>पछाडिको कागजात</p><a href={k.backUrl} target="_blank" rel="noreferrer">फोटो खोल्नुहोस्</a><img src={k.backUrl} alt="पछाडिको कागजात" style={{display:'block',width:'100%',maxWidth:360,marginTop:8,borderRadius:8}} /></div>}
              {adminKycDocuments.filter(d=>d.kyc_record_id===k.id||d.user_id===k.user_id).map(d=><div key={d.id} style={{border:'1px solid #ddd',borderRadius:8,padding:10,margin:'10px 0',overflowWrap:'anywhere'}}><p><b>अतिरिक्त कागजात:</b> {d.document_kind||'प्रकार उल्लेख छैन'} · {d.document_side||'पक्ष उल्लेख छैन'}</p><p>कागजात नम्बर: {d.document_number||'—'}</p>{d.details&&<div style={{background:'#f7f9fc',padding:8,borderRadius:6,margin:'8px 0'}}><b>कागजात/व्यवसाय विवरण:</b>{Object.entries(d.details).filter(([key,value])=>value!==''&&value!==null&&value!==undefined).map(([key,value])=><p key={key} style={{margin:'4px 0',overflowWrap:'anywhere'}}><b>{{business_name:'व्यवसायको नाम',business_type:'व्यवसायको प्रकार',business_address:'व्यवसायको ठेगाना',representative_name:'प्रतिनिधिको नाम',representative_position:'प्रतिनिधिको पद',registration_number:'दर्ता नम्बर',pan_vat_number:'PAN/VAT नम्बर',goods_type:'सामानको प्रकार',role_type:'भूमिका',number:'नम्बर',holder_name:'धनी/लाइसेन्सधारीको नाम',owner_name:'ब्लुबुकमा भएको गाडीधनीको नाम',company_name:'कम्पनी/इन्स्योरेन्सको नाम',policy_number:'बीमा पोलिसी नम्बर',insured_date:'बीमा सुरु मिति',expiry_date:'म्याद सकिने मिति'}[key]||key}:</b> {String(value)}</p>)}</div>}<p>म्याद: {d.expiry_date||'—'}</p><p>स्थिति: {({pending:'प्रतीक्षामा',approved:'स्वीकृत',rejected:'अस्वीकृत'})[d.status]||d.status||'—'}</p>{d.admin_note&&<p>Admin टिप्पणी: {d.admin_note}</p>}{d.fileError&&<p>फाइल समस्या: {d.fileError}</p>}{d.fileUrl&&<><a href={d.fileUrl} target="_blank" rel="noreferrer">कागजात खोल्नुहोस्</a><img src={d.fileUrl} alt="अतिरिक्त KYC कागजात" style={{display:'block',width:'100%',maxWidth:360,marginTop:8,borderRadius:8}} /></>}</div>)}<button type="button" className="primary" onClick={()=>decideKyc(k.id,'approved')}>Approve / स्वीकृत</button><button type="button" style={{marginLeft:8,padding:10}} onClick={()=>decideKyc(k.id,'rejected')}>Reject / अस्वीकृत</button>
            </details>)}
            {adminKyc.length===0&&<p>KYC सूची खाली छ वा लोड हुँदैछ।</p>}</>}
          </>}
        </>}
        {page === 'settings-account' && <>
          <h3>Account / खाता स्थिति</h3>
          {profilePhotoUrl && <img src={profilePhotoUrl} alt="प्रोफाइल फोटो" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',display:'block',margin:'8px 0'}} />}
          <h3>{profileName || 'युजरको नाम'}</h3>
          <p>📍 ठेगाना: {profileAddress || 'प्रोफाइलमा ठेगाना थप्नुहोस्'}</p>
          <p>📞 फोन: {profilePhone || 'प्रोफाइलमा फोन नम्बर थप्नुहोस्'}</p>
          <p>✉️ Email: {profileEmail || 'लगइनपछि उपलब्ध हुनेछ'}</p>
          <p>हालको भूमिका: {role || 'छानिएको छैन'}</p>
          <p>KYC Verification: <b>{accountKycStatus.includes('स्वीकृत') && !accountKycStatus.includes('अस्वीकृत') ? '✅ Verified' : accountKycStatus.includes('अस्वीकृत') ? '❌ Rejected' : accountKycStatus.includes('प्रतीक्षामा') ? '☑️ Pending' : accountKycStatus}</b></p>

          <p>खाता स्थिति: {profileStatus === 'inactive' ? 'निष्क्रिय' : 'सक्रिय'}</p>
          <p>KYC प्रमाणिकरण: <b>{accountKycStatus}</b></p>
          {accountKycNote && <p>Admin टिप्पणी: {accountKycNote}</p>}
          <button type="button" className="primary" onClick={() => go('kyc')}>KYC विवरण खोल्नुहोस्</button>
          <button type="button" style={{marginTop:12,padding:10}} onClick={() => { setShowAdminLogin(v => !v); setAdminLoginMessage(''); }}>Admin Login</button>
          {showAdminLogin && <>
            <h3>Admin Login / प्रशासक लगइन</h3>
            <button type="button" className="primary" style={{display:'block',width:'100%',margin:'8px 0'}} onClick={() => {setAdminApplicationMessage('');setMainMenuOpen(false);setPage('admin-application');setForm({});setMessage('');}}>Create Admin Account / Admin बन्न आवेदन</button>
            <input type="email" autoComplete="username" placeholder="Admin Email / ID" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={{display:'block',width:'100%',boxSizing:'border-box',padding:12,margin:'8px 0'}} />
            <div style={{display:'flex',gap:8,alignItems:'center',margin:'8px 0'}}>
              <input type={showAdminPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} style={{flex:1,minWidth:0,boxSizing:'border-box',padding:12}} />
              <button type="button" aria-label={showAdminPassword ? 'पासवर्ड लुकाउनुहोस्' : 'पासवर्ड देखाउनुहोस्'} onClick={() => setShowAdminPassword(v => !v)} style={{padding:10}}>{showAdminPassword ? '🙈' : '👁️'}</button>
            </div>
            <button type="button" style={{display:'block',margin:'8px 0',padding:8,background:'transparent',border:0,color:'#2563eb',textDecoration:'underline'}} onClick={async () => {
              if (!adminEmail.trim()) {
                setAdminLoginMessage('पहिले Admin Email लेख्नुहोस्।');
                return;
              }
              setAdminLoginMessage('पासवर्ड रिसेट इमेल पठाउँदैछ...');
              const { error } = await supabase.auth.resetPasswordForEmail(adminEmail.trim(), { redirectTo: window.location.origin });
              setAdminLoginMessage(error ? 'इमेल पठाउन सकिएन: ' + error.message : 'पासवर्ड रिसेट लिंक इमेलमा पठाइयो। Inbox वा Spam जाँच गर्नुहोस्।');
            }}>Forgot Password? / पासवर्ड बिर्सनुभयो?</button>
            <button type="button" style={{display:'block',margin:'8px 0',padding:8,background:'transparent',border:0,color:'#2563eb',textDecoration:'underline'}} onClick={() => { setShowResetPassword(v => !v); setResetPasswordMessage(''); }}>Reset Password / नयाँ पासवर्ड राख्नुहोस्</button>
            {showResetPassword && <>
              <p>पासवर्ड रिसेट इमेलको लिंकबाट यो पेज खोलेपछि नयाँ पासवर्ड राख्नुहोस्।</p>
              <div style={{display:'flex',gap:8,alignItems:'center',margin:'8px 0'}}>
                <input type={showAdminPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="नयाँ पासवर्ड (कम्तीमा 8 अक्षर)" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} style={{flex:1,minWidth:0,boxSizing:'border-box',padding:12}} />
                <button type="button" onClick={() => setShowAdminPassword(v => !v)} style={{padding:10}}>{showAdminPassword ? '🙈' : '👁️'}</button>
              </div>
              <input type={showAdminPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="नयाँ पासवर्ड फेरि लेख्नुहोस्" value={confirmAdminPassword} onChange={e => setConfirmAdminPassword(e.target.value)} style={{display:'block',width:'100%',boxSizing:'border-box',padding:12,margin:'8px 0'}} />
              <button type="button" className="primary" onClick={async () => {
                setResetPasswordMessage('');
                if (newAdminPassword.length < 8) { setResetPasswordMessage('पासवर्ड कम्तीमा 8 अक्षरको हुनुपर्छ।'); return; }
                if (newAdminPassword !== confirmAdminPassword) { setResetPasswordMessage('दुवै पासवर्ड मिलेनन्।'); return; }
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !sessionData.session) {
                  setResetPasswordMessage('पहिले Forgot Password बाट इमेल लिंक खोल्नुहोस्, त्यसपछि यो पेजमा फर्कनुहोस्।');
                  return;
                }
                const { error } = await supabase.auth.updateUser({ password: newAdminPassword });
                if (error) { setResetPasswordMessage('पासवर्ड परिवर्तन भएन: ' + error.message); return; }
                setNewAdminPassword('');
                setConfirmAdminPassword('');
                setAdminPassword('');
                setResetPasswordMessage('पासवर्ड सफलतापूर्वक परिवर्तन भयो। अब नयाँ पासवर्डबाट लगइन गर्न सक्नुहुन्छ।');
              }}>Change Password / पासवर्ड परिवर्तन</button>
              {resetPasswordMessage && <p role="status">{resetPasswordMessage}</p>}
            </>}
            {adminLoginMessage && <p>{adminLoginMessage}</p>}
            <button type="button" className="primary" onClick={async () => {
              setAdminLoginMessage('लगइन जाँच हुँदैछ...');
              const { error: loginError } = await supabase.auth.signInWithPassword({ email: adminEmail.trim(), password: adminPassword });
              if (loginError) { setAdminLoginMessage('लगइन भएन: Email/Password जाँच गर्नुहोस्।'); return; }
              const { data: allowed, error: roleError } = await supabase.rpc('is_app_admin');
              if (roleError || allowed !== true) {
                setIsAppAdmin(false);
                setAdminLoginMessage('यो खाता Admin होइन वा अनुमति जाँच भएन।');
                await supabase.auth.signOut();
                return;
              }
              setIsAppAdmin(true);
              setAdminPassword('');
              setShowAdminLogin(false);
              setAdminLoginMessage('');
              go('settings-admin-dashboard');
            }}>Login / लगइन</button>
          </>}


        </>}

        {page === 'admin-application' && <>
          <h3>Admin Account Application / Admin आवेदन</h3>
          <p>आवेदन Root Admin ले जाँच गर्नेछन्। फारम पठाउँदैमा Admin अधिकार प्राप्त हुँदैन।</p>
          <form onSubmit={async e => {
            e.preventDefault();
            setAdminApplicationBusy(true);
            setAdminApplicationMessage('');
            let uploaded = [];
            try {
              const {data,error:authError}=await supabase.auth.getUser();
              if(authError || !data.user) throw new Error('पहिले आफ्नो खातामा लगइन गर्नुहोस्।');
              const f=adminApplicationForm;
              if(!adminApplicantPhoto || !adminDocumentFront || !adminDocumentBack) throw new Error('आफ्नो पासपोर्ट साइज फोटो र परिचयपत्रका दुवै फोटो छान्नुहोस्।');
              if(!adminApplicantPhoto.type.startsWith('image/')) throw new Error('आफ्नो फोटो image हुनुपर्छ।');
              if(adminApplicantPhoto.size > 5*1024*1024) throw new Error('पासपोर्ट साइज फोटो 5 MB भन्दा सानो राख्नुहोस्।');
              const bucket=supabase.storage.from('kyc-private');
              const upload=async(file,label)=>{
                const path=data.user.id+'/admin-'+Date.now()+'-'+label+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
                const r=await bucket.upload(path,file,{contentType:file.type,upsert:false});
                if(r.error) throw r.error;
                uploaded.push(path);
                return path;
              };
              const photo_path=await upload(adminApplicantPhoto,'photo');
              const document_front_path=await upload(adminDocumentFront,'front');
              const document_back_path=await upload(adminDocumentBack,'back');
              const {error}=await supabase.from('admin_applications').insert({
                user_id:data.user.id,full_name:f.full_name.trim(),phone:f.phone.trim(),
                email:f.email.trim(),id_type:f.id_type,id_number:f.id_number.trim(),
                father_name:f.father_name.trim()||null,mother_name:f.mother_name.trim()||null,
                grandfather_name:f.grandfather_name.trim()||null,
                application_reason:[f.application_reason.trim(),'ठेगाना: '+f.address.trim(),'जिम्मेवारी स्वीकार: '+(f.responsibilityAccepted?'हो':'होइन')].filter(Boolean).join('\n'),work_plan:f.work_plan.trim(),
                photo_path,document_front_path,document_back_path,status:'pending'
              });
              if(error) throw error;
              setAdminApplicationMessage('आवेदन पठाइयो। Root Admin को निर्णय पर्खनुहोस्।');
            } catch(err) {
              if(uploaded.length) await supabase.storage.from('kyc-private').remove(uploaded);
              setAdminApplicationMessage('आवेदन पठाउन सकिएन: '+(err.message||'फेरि प्रयास गर्नुहोस्।'));
            } finally {setAdminApplicationBusy(false);}
          }} style={{display:'grid',gap:10}}>
            {[
              ['full_name','नाम र थर *'],['address','पूरा ठेगाना *'],['phone','फोन नम्बर *'],['email','इमेल ठेगाना *'],
              ['id_number','परिचयपत्र नम्बर *'],['father_name','बुबाको नाम'],
              ['mother_name','आमाको नाम'],['grandfather_name','हजुरबुबाको नाम']
            ].map(([k,label])=><input key={k} required={['full_name','address','phone','email','id_number'].includes(k)} type={k==='email'?'email':'text'} placeholder={label} value={adminApplicationForm[k]} onChange={e=>setAdminApplicationForm(v=>({...v,[k]:e.target.value}))} style={{padding:12,width:'100%',boxSizing:'border-box'}}/>)}
            <label>परिचयपत्रको प्रकार *
              <select value={adminApplicationForm.id_type} onChange={e=>setAdminApplicationForm(v=>({...v,id_type:e.target.value}))} style={{display:'block',width:'100%',padding:12}}>
                <option value="Citizenship">नागरिकता</option><option value="National ID">राष्ट्रिय परिचयपत्र</option><option value="Passport">पासपोर्ट</option><option value="Driving License">सवारी चालक अनुमतिपत्र</option>
              </select>
            </label>
            <label>पासपोर्ट साइज फोटो (अनिवार्य, अगाडिबाट खिचेको) *<input required type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setAdminApplicantPhoto(e.target.files?.[0]||null)}/><small>आफ्नो अनुहार स्पष्ट देखिने पासपोर्ट साइज फोटो छान्नुहोस्।</small></label>
            <label>परिचयपत्र अगाडिको फोटो *<input required type="file" accept="image/*" onChange={e=>setAdminDocumentFront(e.target.files?.[0]||null)}/></label>
            <label>परिचयपत्र पछाडिको फोटो *<input required type="file" accept="image/*" onChange={e=>setAdminDocumentBack(e.target.files?.[0]||null)}/></label>
            <label style={{display:'flex',gap:10,alignItems:'flex-start',margin:'12px 0',lineHeight:1.6}}>
              <input type="checkbox" required checked={adminApplicationForm.responsibilityAccepted} onChange={e=>setAdminApplicationForm(v=>({...v,responsibilityAccepted:e.target.checked}))} style={{width:22,height:22,flexShrink:0}} />
              <span>मैले दिएको विवरण सत्य हो। म आफ्नो जिम्मेवारी बुझेर Admin आवेदन दिँदैछु र नियम पालना गर्नेछु। *</span>
            </label>
            <textarea rows={3} placeholder="ऐच्छिक: Admin बन्न चाहनुको कारण लेख्नुहोस्" value={adminApplicationForm.application_reason} onChange={e=>setAdminApplicationForm(v=>({...v,application_reason:e.target.value}))}/>
            <label>Admin बन्ने निवेदन (ऐच्छिक, २ देखि २०० वा बढी शब्द)
            <textarea rows={9} placeholder="ऐच्छिक: आफ्नो अनुभव वा Admin बन्न चाहनुको कारण लेख्नुहोस्—२ देखि २०० वा बढी शब्द, अथवा खाली छोड्न सक्नुहुन्छ।" value={adminApplicationForm.work_plan} onChange={e=>setAdminApplicationForm(v=>({...v,work_plan:e.target.value}))} style={{width:'100%',boxSizing:'border-box',padding:12}}/>
            <small>{adminApplicationForm.work_plan.trim() ? adminApplicationForm.work_plan.trim().split(/\s+/).filter(Boolean).length : 0} शब्द</small>
            </label>
            {adminApplicationMessage && <p role="status">{adminApplicationMessage}</p>}
            <button type="submit" className="primary" disabled={adminApplicationBusy}>{adminApplicationBusy?'पठाउँदैछ...':'आवेदन पठाउनुहोस्'}</button>
            <button type="button" onClick={()=>go('settings-account')}>फर्कनुहोस्</button>
          </form>
        </>}

        {page === 'settings-privacy' && <>
          <h3>Privacy / गोपनीयता</h3>
          <p>आफ्नो खाता बन्द गर्ने र स्थायी रूपमा मेटाउने विकल्प छुट्टाछुट्टै छन्।</p>
          <button type="button" className="primary" onClick={async () => {
            if (!window.confirm('खाता अस्थायी रूपमा बन्द गर्ने? फेरि प्रयोग गर्न सहयोग आवश्यक पर्न सक्छ।')) return;
            setMessage('खाता बन्द गर्दै...');
            const { error } = await supabase.rpc('deactivate_my_account');
            if (error) {
              setMessage('खाता बन्द भएन: ' + error.message);
              return;
            }
            await supabase.auth.signOut();
            setMessage('खाता बन्द भयो।');
            setPage('home');
          }}>Account Deactivate</button>
          <button type="button" style={{display:'block',width:'100%',padding:14,marginTop:12,border:0,borderRadius:10,background:'#b91c1c',color:'white',fontWeight:700}} onClick={async () => {
            if (!window.confirm('तपाईंको खाता स्थायी रूपमा मेटाउने? यो काम फिर्ता गर्न सकिँदैन।')) return;
            setMessage('खाता मेटाउँदै...');
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setMessage('पहिले लग इन गर्नुहोस्।'); return; }
            const { data, error } = await supabase.functions.invoke('delete-account', { headers: { Authorization: `Bearer ${session.access_token}` }, body: {} });
            if (error || !data?.success) { setMessage('खाता मेटिएन। फेरि प्रयास गर्नुहोस्।'); return; }
            await supabase.auth.signOut();
            setMessage('खाता मेटियो।');
            setPage('home');
          }}>Delete Account</button>
        </>}
        {page === 'settings-lists' && <>
          <h3>Lists / सूचीहरू</h3>
          {sections.map(item => <button key={item[0]} type="button" onClick={() => go(item[0])} style={{display:'block',width:'100%',padding:13,margin:'8px 0',textAlign:'left',border:'1px solid #ddd',borderRadius:10,background:'white',color:'#102b46'}}>{item[1]} {item[2]}</button>)}
        </>}
        {page === 'settings-notifications' && <>
          <h3>Notifications / सूचनाहरू</h3>
          <p>लोड, बुकिङ र खातासम्बन्धी सूचनाहरू यहाँ हेर्नुहोस्।</p>
          <button type="button" onClick={() => go('notifications')} style={{padding:'12px 16px',border:0,borderRadius:8,background:'#FF6500',color:'white'}}>🔔 सूचनाहरू हेर्नुहोस्</button>
        </>}
        {page === 'settings-storage' && <>
          <h3>Storage and Data / डाटा</h3>
          <p>लोड सूचीमा हाल देखिएका रेकर्ड: {loads.length}</p>
          <p>मोबाइलमा फाइल र डाटा व्यवस्थापन सुविधा पछि जोड्न सकिन्छ।</p>
        </>}
        {page === 'settings-language' && <>
          <h3>App Language / एपको भाषा</h3>
          {[['नेपाली','🇳🇵'],['English','🇬🇧'],['हिन्दी','🇮🇳'],['中文','🇨🇳']].map(([name,flag]) =>
            <button key={name} type="button" onClick={() => {setLanguage(name);localStorage.setItem('load_language', name);}} style={{display:'block',width:'100%',padding:13,margin:'8px 0',textAlign:'left',border:'1px solid #ddd',borderRadius:10,background:language===name?'#fff0df':'white',color:'#102b46'}}>{flag} {name} {language===name?'✓':''}</button>)}
        </>}
        {page === 'settings-help' && (() => {
          const uid = currentUserId;
          return <>
            <h3>Help Center / सहायता केन्द्र</h3>
              <form onSubmit={async e => {
                e.preventDefault();
                const f = e.currentTarget;
                const subject = f.subject.value.trim();
                const body = f.body.value.trim();
                if (!subject || !body) { setMessage('विषय र सन्देश दुवै लेख्नुहोस्।'); return; }
                const { data: c, error: ce } = await supabase.from('support_conversations').insert({
                  user_id: uid || null, subject, category: f.category.value
                }).select().single();
                if (ce) { setMessage('गुनासो दर्ता भएन: ' + ce.message); return; }
                const { error: me } = await supabase.from('support_messages').insert({
                  conversation_id: c.id, sender_id: uid || null, body
                });
                if (me) { setMessage('गुनासो खुल्यो तर सन्देश पठाउन समस्या भयो: ' + me.message); return; }
                setMessage('तपाईंको सन्देश Admin लाई पठाइयो।');
                f.reset();
                setForm(old => ({...old, supportRefresh: Date.now()}));
              }} style={{padding:12,border:'1px solid #ddd',borderRadius:12,marginBottom:16}}>
                <label>समस्याको प्रकार
                  <select name="category" style={{display:'block',width:'100%',padding:12,margin:'6px 0 12px'}}>
                    <option value="general">सामान्य सहायता</option>
                    <option value="complaint">गुनासो</option>
                    <option value="account">खाता सम्बन्धी</option>
                    <option value="booking">बुकिङ / ढुवानी</option>
                    <option value="payment">भुक्तानी</option>
                    <option value="safety">सुरक्षा समस्या</option>
                  </select>
                </label>
                <label>विषय
                  <input name="subject" required maxLength={120} placeholder="समस्या छोटकरीमा लेख्नुहोस्" style={{display:'block',boxSizing:'border-box',width:'100%',padding:12,margin:'6px 0 12px'}} />
                </label>
                <label>विवरण / सन्देश
                  <textarea name="body" required maxLength={5000} placeholder="आफ्नो समस्या वा गुनासो लेख्नुहोस्" rows={4} style={{display:'block',boxSizing:'border-box',width:'100%',padding:12,margin:'6px 0 12px'}} />
                </label>
                <button className="primary" type="submit">Admin लाई पठाउनुहोस्</button>
              </form>
              {uid && <><h3>मेरा सहायता अनुरोधहरू</h3>
              <button type="button" onClick={() => setForm(old => ({...old,supportRefresh:Date.now()}))}>रिफ्रेस गर्नुहोस्</button>
              {(() => {
                const [unused] = [null];
                return <SupportInbox supabase={supabase} uid={uid} refresh={form.supportRefresh || 0} setMessage={setMessage} />;
              })()}
            </>}
          </>;
        })()}
        {page === 'settings-city' && <>
          <h3>City / सहर</h3>
          <label>आफ्नो सहर
            <input value={form.city || ''} onChange={e => setForm({...form,city:e.target.value})} placeholder="जस्तै: Kathmandu" style={{display:'block',width:'100%',boxSizing:'border-box',padding:13,marginTop:8}}/>
          </label>
          <button type="button" className="primary" onClick={() => setMessage(form.city ? 'सहर छानियो: '+form.city+' (अहिले यो सत्रमा मात्र)' : 'पहिले सहर लेख्नुहोस्।')}>Save City</button>
        </>}
        {page === 'settings-history' && (() => {
          const historyVehicleBookings = vehicleBookings.filter(r => ['completed', 'cancelled'].includes(r.status));
          const completed = historyBookings.filter(b => b.status === 'completed');
          const earnings = completed.reduce((sum, b) => sum + (Number(b.actual_fare) || 0), 0);
          const kilometers = completed.reduce((sum, b) => sum + (Number(b.actual_distance_km) || 0), 0);
          const money = n => 'रु. ' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
          return <>
            <h3>Request History / अनुरोध इतिहास</h3>
            {historyError && <p style={{color:'#b91c1c'}}>{historyError}</p>}
            <div className="stats">
              <div><b>{completed.length}</b><span>पूरा भएका ढुवानी</span></div>
              <div><b>{money(earnings)}</b><span>वास्तविक कमाइ</span></div>
              <div><b>{kilometers.toLocaleString('en-IN', {maximumFractionDigits:2})} km</b><span>वास्तविक दूरी</span></div>
            </div>
            <h4>🗺️ म्यापबाट भएका बुकिङ</h4>
        {historyVehicleBookings.length === 0 && <p>म्याप बुकिङ इतिहास छैन।</p>}
        {historyVehicleBookings.map(r => <div key={'history-map-'+r.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0'}}>
          <b>{r.vehicle_name || r.vehicle_type || 'मालवाहक गाडी'}</b>
          <p>उठाउने स्थान: {r.pickup_location || 'उल्लेख छैन'} → गन्तव्य: {r.destination || 'उल्लेख छैन'}</p>
          <p>सामान: {r.cargo_details || 'विवरण छैन'}</p>
          <p>मिति: {new Date(r.created_at).toLocaleDateString()}</p>
          <p style={{display:'inline-block',padding:'6px 12px',borderRadius:20,fontWeight:700,background:({pending:'#EFF6FF',accepted:'#FFF7E8',rejected:'#F3F4F6',completed:'#ECFDF3',cancelled:'#FEF2F2'}[r.status]||'#F3F4F6'),color:({pending:'#2563EB',accepted:'#B45309',rejected:'#6B7280',completed:'#15803D',cancelled:'#DC2626'}[r.status]||'#374151')}}>स्थिति: {{pending:'🕒 निर्णय बाँकी',accepted:'🤝 स्वीकार भयो',rejected:'❌ अस्वीकार भयो',completed:'✅ डेलिभरी पूरा',cancelled:'❌ रद्द भयो'}[r.status] || r.status}</p>
          <p>प्रस्तावित भाडा: {r.proposed_fare == null ? 'रेकर्ड छैन' : money(Number(r.proposed_fare))}</p>
          <p>वास्तविक दूरी र कमाइ: रेकर्ड छैन</p>
        </div>)}
        <h4>बुकिङ तथा ढुवानी</h4>
            {historyBookings.length === 0 && !historyError && <p>अहिलेसम्म बुकिङ इतिहास छैन।</p>}
            {historyBookings.map(b => {
              const load = historyLoads.find(l => l.id === b.load_id);
              return <div key={b.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0'}}>
                <b>{load ? `${load.origin} → ${load.destination}` : 'लोड #' + String(b.load_id).slice(0,8)}</b>
                {load && <p>{load.cargo || 'कार्गो'}{load.weight ? ` · ${load.weight}` : ''}</p>}
                <p>मिति: {new Date(b.completed_at || b.created_at).toLocaleDateString()}</p>
                <p style={{display:'inline-block',padding:'6px 12px',borderRadius:20,fontWeight:700,background:({completed:'#ECFDF3',cancelled:'#FEF2F2',open:'#EFF6FF',accepted:'#FFF7E8',rejected:'#F3F4F6',in_transit:'#EFF6FF'}[b.status]||'#F3F4F6'),color:({completed:'#15803D',cancelled:'#DC2626',open:'#2563EB',accepted:'#B45309',rejected:'#6B7280',in_transit:'#2563EB'}[b.status]||'#374151')}}>स्थिति: {{completed:'✅ डेलिभरी पूरा',cancelled:'❌ रद्द भयो',open:'🕒 अनुरोध पठाइएको',accepted:'🤝 स्वीकार भयो',rejected:'❌ अस्वीकार भयो',in_transit:'🚚 ढुवानी हुँदैछ'}[b.status] || b.status || 'उपलब्ध छैन'}</p>
                <p>वास्तविक दूरी: {b.actual_distance_km == null ? 'रेकर्ड छैन' : `${b.actual_distance_km} km`}</p>
                <p>वास्तविक भाडा: {b.actual_fare == null ? 'रेकर्ड छैन' : money(Number(b.actual_fare))}</p>
              </div>;
            })}
            <h4>मैले पोस्ट गरेका लोड</h4>
            {historyLoads.length === 0 && <p>पोस्ट गरेका लोड छैनन्।</p>}
            {historyLoads.map(l => {
              const expired = l.status === 'open' && l.expires_at && new Date(l.expires_at).getTime() <= Date.now();
              const shownStatus = expired ? 'expired' : l.status;
              return <div key={l.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,margin:'10px 0'}}>
              <b>{l.origin} → {l.destination}</b>
              <p>{l.cargo || 'कार्गो'}{l.weight ? ` · ${l.weight}` : ''}</p>
              <p>मिति: {new Date(l.created_at).toLocaleDateString()}</p>
              <p style={{display:'inline-block',padding:'6px 12px',borderRadius:20,fontWeight:700,background:({completed:'#ECFDF3',cancelled:'#FEF2F2',open:'#EFF6FF',expired:'#F3F4F6',accepted:'#FFF7E8',rejected:'#F3F4F6',in_transit:'#EFF6FF'}[shownStatus]||'#F3F4F6'),color:({completed:'#15803D',cancelled:'#DC2626',open:'#2563EB',expired:'#6B7280',accepted:'#B45309',rejected:'#6B7280',in_transit:'#2563EB'}[shownStatus]||'#374151')}}>स्थिति: {{completed:'✅ डेलिभरी पूरा',cancelled:'❌ रद्द भयो',open:'🕒 खुला',expired:'⌛ म्याद सकियो',accepted:'🤝 स्वीकार भयो',rejected:'❌ अस्वीकार भयो',in_transit:'🚚 ढुवानी हुँदैछ'}[shownStatus] || shownStatus}</p>
              <p>प्रस्तावित भाडा: {l.proposed_price == null ? 'उपलब्ध छैन' : money(Number(l.proposed_price))}</p>
              {l.status === 'open' && !expired && <button type="button" onClick={() => cancelLoadPost(l)} style={{background:'#b91c1c',color:'white',border:0,borderRadius:8,padding:'10px 14px',marginTop:6}}>पोस्ट रद्द गर्नुहोस्</button>}
              {expired && <button type="button" onClick={() => repostExpiredLoad(l)} style={{background:'#ea580c',color:'white',border:0,borderRadius:8,padding:'10px 14px',marginTop:6}}>🔄 फेरि पोस्ट गर्नुहोस्</button>}
            </div>;
            })}
          </>;
        })()}
      </div>}

      {message && <div className="notice">✓ {tr(message)}</div>}


      {page !== "home" && <button type="button" aria-label="पछाडि फर्कनुहोस्" onClick={goBack} style={floatingBack}>‹</button>}
      <footer>LOAD · LM LOGISTICS & CARGO <small>{tr('ढुवानीको सजिलो साथी')}</small></footer>
    </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
