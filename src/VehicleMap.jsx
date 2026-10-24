import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { supabase } from '../supabase.js';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';

setWorkerUrl(workerUrl);

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[c]));

const distanceKm = (a, b, c, d) => {
  const rad = n => n * Math.PI / 180;
  const x = Math.sin(rad(c-a)/2) ** 2 +
    Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d-b)/2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
};

export default function NearbyVehicleMap() {
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const markers = useRef(null);
  const watchId = useRef(null);
  const myPoint = useRef(null);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [count, setCount] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requesterType, setRequesterType] = useState('व्यक्तिगत');
  const [requesterName, setRequesterName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [cargo, setCargo] = useState('');
  const [fare, setFare] = useState('');
  const [saving, setSaving] = useState(false);

  const role = localStorage.getItem('load_role') || '';
  const roleType = localStorage.getItem('load_role_type') || role;
  const canShare = ['driver', 'owner', 'transport'].includes(role);

  const loadRequests = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;
    const { data, error } = await supabase
      .from('vehicle_booking_requests')
      .select('*')
      .eq('vehicle_owner_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error) setRequests(data || []);
    else setNotice('आएका रिक्वेस्ट लोड भएनन्: ' + error.message);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([27.7172, 85.3240], 6);
    mapObj.current = map;
    markers.current = L.layerGroup().addTo(map);
    maplibreGL({ style: 'https://tiles.openfreemap.org/styles/liberty' }).addTo(map);
    loadRequests();
    return () => {
      if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current);
      map.remove();
      mapObj.current = null;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const { data, error } = await supabase
        .from('vehicle_locations')
        .select('user_id,latitude,longitude,vehicle_type,vehicle_status,vehicle_name,wheel_count,capacity_kg,vehicle_photo_url,updated_at')
        .eq('is_available', true)
        .eq('vehicle_status', 'available')
        .gte('updated_at', new Date(Date.now() - 2 * 60 * 1000).toISOString())
        .limit(300);

      if (!active) return;
      if (error) {
        setNotice('गाडीको सूची लोड भएन: ' + error.message);
        return;
      }
      setVehicles(data || []);
      setCount(data?.length || 0);
      if (!markers.current) return;
      markers.current.clearLayers();

      (data || []).forEach(v => {
        const km = myPoint.current
          ? distanceKm(myPoint.current.lat, myPoint.current.lng, v.latitude, v.longitude)
          : null;
        const eta = km == null ? null : Math.max(1, Math.round(km / 25 * 60));
        const icon = L.divIcon({
          className: 'load-vehicle-marker',
          html: '<div style="font-size:30px;line-height:36px;text-align:center;filter:drop-shadow(0 1px 2px #777)">🚚</div>',
          iconSize: [36,36], iconAnchor: [18,18]
        });
        const marker = L.marker([v.latitude, v.longitude], { icon });
        marker.bindPopup(`
          <div style="min-width:190px;max-width:260px">
            <b>${esc(v.vehicle_name || v.vehicle_type || 'मालवाहक गाडी')}</b>
            <p>अवस्था: खाली / उपलब्ध</p>
            <p>चक्काको सङ्ख्या: ${esc(v.wheel_count || 'विवरण छैन')}</p>
            <p>क्षमता: ${v.capacity_kg ? esc(v.capacity_kg)+' kg' : 'विवरण छैन'}</p>
            <p>तपाईंबाट दूरी: ${km == null ? 'आफ्नो GPS सुरु गर्नुहोस्' : km.toFixed(1)+' km (सीधा दूरी)'}</p>
            <p>अनुमानित समय: ${eta == null ? 'GPS चाहिन्छ' : eta+' मिनेट (अनुमान)'}</p>
            <p>GPS अपडेट: ${new Date(v.updated_at).toLocaleTimeString()}</p>
            <button type="button" data-vehicle-book="${esc(v.user_id)}"
              style="width:100%;padding:10px;background:#ff6500;color:white;border:0;border-radius:8px;font-weight:bold">
              यस गाडीका लागि रिक्वेस्ट
            </button>
          </div>`);
        marker.on('popupopen', event => {
          const btn = event.popup.getElement()?.querySelector('[data-vehicle-book]');
          if (btn) btn.onclick = () => {
            setSelected(v);
            setNotice('');
            map.closePopup();
          };
        });
        marker.addTo(markers.current);
      });
    };
    refresh();
    const timer = setInterval(refresh, 15000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const stopSharing = async () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    setAvailable(false);
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      const { error } = await supabase.from('vehicle_locations')
        .update({ is_available: false, updated_at: new Date().toISOString() })
        .eq('user_id', auth.user.id);
      setNotice(error ? 'स्थान बन्द भयो, उपलब्धता अपडेट भएन: ' + error.message : 'GPS साझेदारी बन्द भयो।');
    }
  };

  const startSharing = async () => {
    if (!canShare) {
      setNotice('GPS साझेदारी चालक, गाडीधनी वा यातायात सेवा प्रदायकका लागि हो।');
      return;
    }
    if (!navigator.geolocation) {
      setNotice('यस उपकरणमा GPS उपलब्ध छैन।');
      return;
    }
    setBusy(true);
    setNotice('');
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) throw new Error('पहिले लगइन गर्नुहोस्।');

      watchId.current = navigator.geolocation.watchPosition(async pos => {
        const point = {
          user_id: auth.user.id,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          vehicle_type: localStorage.getItem('load_role_type') || role,
          is_available: true,
          updated_at: new Date().toISOString()
        };
        myPoint.current = { lat: point.latitude, lng: point.longitude };
        const { error } = await supabase.from('vehicle_locations')
          .upsert(point, { onConflict: 'user_id' });
        if (error) {
          setNotice('GPS सुरक्षित भएन: ' + error.message);
          return;
        }
        setAvailable(true);
        setNotice('GPS सक्रिय छ। उपलब्ध गाडीका रूपमा देखिनुहुन्छ।');
        mapObj.current?.setView([point.latitude, point.longitude], 12);
      }, err => {
        setNotice('GPS अनुमति वा स्थान उपलब्ध भएन: ' + err.message);
        setAvailable(false);
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
      setNotice('GPS स्थान प्राप्त हुँदैछ…');
    } catch (err) {
      setNotice(err.message || 'GPS सुरु भएन।');
    } finally {
      setBusy(false);
    }
  };

  const sendRequest = async e => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setNotice('');
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth?.user) throw new Error('रिक्वेस्ट पठाउन पहिले लगइन गर्नुहोस्।');
      if (auth.user.id === selected.user_id) throw new Error('आफ्नै गाडीमा बुकिङ रिक्वेस्ट पठाउन मिल्दैन।');
      if (!requesterName.trim()) throw new Error('आफ्नो नाम वा कम्पनीको नाम लेख्नुहोस्।');
      const { error } = await supabase.from('vehicle_booking_requests').insert({
        vehicle_owner_id: selected.user_id,
        requester_id: auth.user.id,
        requester_type: requesterType,
        requester_name: requesterName.trim(),
        requester_company: company.trim() || null,
        requester_phone: phone.trim() || null,
        vehicle_type: selected.vehicle_type || null,
        vehicle_name: selected.vehicle_name || null,
        pickup_location: pickup.trim() || null,
        destination: destination.trim() || null,
        cargo_details: cargo.trim() || null,
        proposed_fare: fare ? Number(fare) : null,
        status: 'pending'
      });
      if (error) throw error;
      setNotice('बुकिङ रिक्वेस्ट गाडीवालालाई पठाइयो। स्वीकार नभएसम्म बुकिङ पक्का भएको मानिँदैन।');
      setSelected(null);
      setPickup(''); setDestination(''); setCargo(''); setFare('');
    } catch (err) {
      setNotice('रिक्वेस्ट पठाउन सकिएन: ' + (err.message || 'फेरि प्रयास गर्नुहोस्।'));
    } finally {
      setSaving(false);
    }
  };

  const decideRequest = async (request, decision) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user || auth.user.id !== request.vehicle_owner_id) {
        throw new Error('यो रिक्वेस्टको निर्णय सम्बन्धित गाडीवालाले मात्र गर्न सक्छ।');
      }
      if (decision === 'accepted') {
        const { data: existing, error: checkError } = await supabase
          .from('vehicle_booking_requests')
          .select('id')
          .eq('vehicle_owner_id', auth.user.id)
          .eq('status', 'accepted')
          .limit(1);
        if (checkError) throw checkError;
        if (existing?.length) throw new Error('यस गाडीधनीको एउटा रिक्वेस्ट पहिले नै स्वीकार भएको छ।');
      }
      const { error } = await supabase.from('vehicle_booking_requests')
        .update({ status: decision, updated_at: new Date().toISOString() })
        .eq('id', request.id)
        .eq('status', 'pending');
      if (error) throw error;
      if (decision === 'accepted') {
        await supabase.from('vehicle_locations')
          .update({ vehicle_status: 'booked', is_available: false, updated_at: new Date().toISOString() })
          .eq('user_id', auth.user.id);
      }
      setNotice(decision === 'accepted' ? 'रिक्वेस्ट स्वीकार गरियो।' : 'रिक्वेस्ट अस्वीकार गरियो।');
      await loadRequests();
    } catch (err) {
      setNotice('निर्णय सुरक्षित भएन: ' + (err.message || 'फेरि प्रयास गर्नुहोस्।'));
    }
  };

  return (
    <section style={{margin:'24px 0',padding:14,background:'#fff',borderRadius:14,color:'#172033'}}>
      <h3>🗺️ नजिकका उपलब्ध मालवाहक सवारी</h3>
      <p style={{fontSize:13,color:'#555'}}>हालै GPS अपडेट भएका खाली गाडी: {count}</p>
      {canShare && <button type="button" disabled={busy} onClick={available ? stopSharing : startSharing}
        style={{padding:12,border:0,borderRadius:9,background:available?'#b91c1c':'#ff6500',color:'#fff',fontWeight:700,marginBottom:10}}>
        {busy ? 'कृपया पर्खनुहोस्…' : available ? 'GPS बन्द गर्नुहोस्' : '📍 GPS सुरु — सवारी उपलब्ध'}
      </button>}
      {notice && <p role="status" style={{fontSize:13,overflowWrap:'anywhere',background:'#fff7ed',padding:10,borderRadius:8}}>{notice}</p>}
      <div ref={mapRef} style={{height:320,width:'100%',borderRadius:10,overflow:'hidden'}} />
      <small>दूरी सीधा GPS दूरी हो; सडकको वास्तविक दूरी र ट्राफिक ETA होइन।</small>

      {selected && <form onSubmit={sendRequest} style={{border:'1px solid #ddd',borderRadius:12,padding:12,marginTop:14}}>
        <h4>🚚 गाडी बुकिङ रिक्वेस्ट</h4>
        <p><b>{selected.vehicle_name || selected.vehicle_type || 'मालवाहक गाडी'}</b></p>
        <p>गाडीधनी ID: {selected.user_id}</p>
        <label>तपाईं को हो?
          <select value={requesterType} onChange={e=>setRequesterType(e.target.value)} style={{display:'block',width:'100%',padding:10,marginTop:5}}>
            <option>व्यक्तिगत</option><option>कम्पनी</option><option>ठेकेदार</option><option>पार्टीवाला</option><option>व्यापारी</option><option>अन्य</option>
          </select>
        </label>
        {[
          ['नाम / कम्पनीको नाम',requesterName,setRequesterName],
          ['सम्पर्क फोन (वैकल्पिक)',phone,setPhone],
          ['सामान उठाउने स्थान',pickup,setPickup],
          ['गन्तव्य',destination,setDestination],
          ['सामानको विवरण',cargo,setCargo],
          ['प्रस्तावित भाडा (रु.)',fare,setFare]
        ].map(([label,value,setter])=><label key={label} style={{display:'block',marginTop:9}}>{label}
          <input value={value} onChange={e=>setter(e.target.value)} required={label==='नाम / कम्पनीको नाम'}
            type={label.includes('भाडा')?'number':'text'} min={label.includes('भाडा')?'0':undefined}
            style={{display:'block',width:'100%',boxSizing:'border-box',padding:10,marginTop:4}}/>
        </label>)}
        <button disabled={saving} type="submit" style={{marginTop:12,padding:12,width:'100%',background:'#ff6500',color:'#fff',border:0,borderRadius:8,fontWeight:700}}>
          {saving?'पठाउँदै…':'बुकिङ रिक्वेस्ट पठाउनुहोस्'}
        </button>
        <button type="button" onClick={()=>setSelected(null)} style={{marginTop:8,padding:10,width:'100%'}}>रद्द गर्नुहोस्</button>
      </form>}

      {canShare && <div style={{marginTop:18}}>
        <h4>📥 तपाईंको गाडीमा आएका रिक्वेस्ट</h4>
        <button type="button" onClick={loadRequests} style={{padding:8,marginBottom:8}}>रिक्वेस्ट रिफ्रेस गर्नुहोस्</button>
        {requests.length===0 && <p>अहिलेसम्म रिक्वेस्ट छैन।</p>}
        {requests.map(r=><div key={r.id} style={{border:'1px solid #ddd',borderRadius:10,padding:12,marginBottom:10,overflowWrap:'anywhere'}}>
          <b>{r.requester_name || 'नाम उपलब्ध छैन'} · {r.requester_type || 'प्रकार उपलब्ध छैन'}</b>
          {r.requester_company && <p>कम्पनी: {r.requester_company}</p>}
          {r.requester_phone && <p>फोन: {r.requester_phone}</p>}
          <p>सामान: {r.cargo_details || 'विवरण छैन'}</p>
          <p>उठाउने: {r.pickup_location || 'विवरण छैन'} → गन्तव्य: {r.destination || 'विवरण छैन'}</p>
          <p>प्रस्तावित भाडा: {r.proposed_fare == null ? 'उल्लेख छैन' : 'रु. '+Number(r.proposed_fare).toLocaleString('en-IN')}</p>
          <p>स्थिति: {r.status}</p>
          {r.status==='pending' && <div style={{display:'flex',gap:8}}>
            <button type="button" onClick={()=>decideRequest(r,'accepted')} style={{flex:1,padding:10,background:'#15803d',color:'#fff',border:0,borderRadius:8}}>स्वीकार</button>
            <button type="button" onClick={()=>decideRequest(r,'rejected')} style={{flex:1,padding:10,background:'#b91c1c',color:'#fff',border:0,borderRadius:8}}>अस्वीकार</button>
          </div>}
        </div>)}
      </div>}
      <small>OpenFreeMap © OpenMapTiles · Data from OpenStreetMap</small>
    </section>
  );
}
