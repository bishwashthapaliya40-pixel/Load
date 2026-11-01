import fs from 'node:fs';
const p = 'src.jsx';
let s = fs.readFileSync(p, 'utf8');

if (!s.includes("const [selectedBooking, setSelectedBooking]")) {
  s = s.replace(
    "const [notificationsError, setNotificationsError] = useState('');",
    "const [notificationsError, setNotificationsError] = useState('');\n  const [bookings, setBookings] = useState([]);\n  const [selectedBooking, setSelectedBooking] = useState(null);\n  const [chatMessages, setChatMessages] = useState([]);\n  const [chatDraft, setChatDraft] = useState('');\n  const [chatError, setChatError] = useState('');\n  const [currentUserId, setCurrentUserId] = useState('');"
  );
}

if (!s.includes('const sendChatText = async')) {
  const marker = '  const save = async (e) => {';
  if (!s.includes(marker)) throw Error('save function भेटिएन।');
  const code = `
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

  useEffect(() => {
    if (page !== 'bookings') return;
    let active = true;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      setCurrentUserId(auth.user.id);
      const { data, error } = await supabase.from('load_bookings')
        .select('id,load_id,customer_id,driver_id,status,created_at')
        .or('customer_id.eq.' + auth.user.id + ',driver_id.eq.' + auth.user.id)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) setChatError(error.message);
      else setBookings(data || []);
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

`;
  s = s.replace(marker, code + marker);
}

if (!s.includes('CHAT_BOOKINGS_PAGE')) {
  const marker = "      {page === 'notifications' && <div className=";
  const i = s.indexOf(marker);
  if (i < 0) throw Error('Notifications पेज भेटिएन।');
  const ui = `
      {/* CHAT_BOOKINGS_PAGE */}
      {page === 'bookings' && <div className="panel">
        <h3>मेरा बुकिङ</h3>
        {chatError && <p>{chatError}</p>}
        {bookings.length === 0 ? <p>अहिलेसम्म बुकिङ छैन।</p> :
          bookings.map(b => {
            const l = loads.find(x => x.id === b.load_id);
            return <div className="loadcard" key={b.id}>
              <b>{l ? l.origin + ' → ' + l.destination : 'लोड बुकिङ'}</b>
              <p>अवस्था: {b.status}</p>
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

`;
  s = s.slice(0, i) + ui + s.slice(i);
}

if (!s.includes("['bookings', '📋'")) {
  s = s.replace(
    "['notifications', '🔔', tr('सूचनाहरू'), tr('सबै सूचनाहरू')],",
    "['notifications', '🔔', tr('सूचनाहरू'), tr('सबै सूचनाहरू')],\n    ['bookings', '📋', 'मेरा बुकिङ', 'बुकिङ सूची'],"
  );
}

fs.copyFileSync(p, p + '.before-chat-ui');
fs.writeFileSync(p, s);
console.log('बुकिङ सूची र च्याट कोड थपियो। अब Build जाँच्नुहोस्।');
