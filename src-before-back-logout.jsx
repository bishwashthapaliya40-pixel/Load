import { supabase } from './supabase.js';
import './style.css';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [page, setPage] = useState('home');
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const fetchLoads = async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('id, origin, destination, cargo, weight, proposed_price, status, created_at')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setLoads(data.map(l => ({
          ...l,
          price: l.proposed_price
        })));
      }
    };
    fetchLoads();
  }, []);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  const [language, setLanguage] = useState('नेपाली');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [welcomeAction, setWelcomeAction] = useState('');
  const [role, setRole] = useState('');
  const [authStep, setAuthStep] = useState('details');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    const finishLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const savedRole = localStorage.getItem('load_role');
        if (savedRole) setRole(savedRole);
        setAuthStep('complete');
      }
    };
    finishLogin();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const savedRole = localStorage.getItem('load_role');
          if (savedRole) setRole(savedRole);
          setAuthStep('complete');
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);


  const translations = {
    'English': {
      'तपाईंको ढुवानी, अब सजिलो!':'Your transport, made easy!',
      'लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।':'Find loads. Connect vehicles. Manage documents.',
      'तपाईंलाई के चाहिएको छ?':'What do you need?',
      'लोड पोस्ट गर्नुहोस्':'Post a Load','नयाँ सामान ढुवानीको विवरण':'New shipment details',
      'लोड खोज्नुहोस्':'Find Loads','उपलब्ध ढुवानीका कामहरू':'Available shipments',
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
      'लोड पोस्ट गरिएको छैन।':'No loads posted yet.'
    },
    'हिन्दी': {
      'तपाईंको ढुवानी, अब सजिलो!':'आपकी ढुलाई, अब आसान!',
      'लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।':'लोड खोजें। वाहन जोड़ें। दस्तावेज़ व्यवस्थित रखें।',
      'तपाईंलाई के चाहिएको छ?':'आपको क्या चाहिए?',
      'लोड पोस्ट गर्नुहोस्':'लोड पोस्ट करें','नयाँ सामान ढुवानीको विवरण':'नई खेप का विवरण',
      'लोड खोज्नुहोस्':'लोड खोजें','उपलब्ध ढुवानीका कामहरू':'उपलब्ध ढुलाई के काम',
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
      'ढुवानीको सजिलो साथी':'आपका ढुलाई साथी','विवरण यस एपमा सुरक्षित भयो।':'विवरण इस ऐप में सेव हुआ।'
    },
    '中文': {
      'तपाईंको ढुवानी, अब सजिलो!':'让货运更简单！',
      'लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।':'寻找货源、连接车辆、管理文件。',
      'तपाईंलाई के चाहिएको छ?':'您需要什么？',
      'लोड पोस्ट गर्नुहोस्':'发布货源','नयाँ सामान ढुवानीको विवरण':'新货运信息',
      'लोड खोज्नुहोस्':'寻找货源','उपलब्ध ढुवानीका कामहरू':'可用运输任务',
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
      'ढुवानीको सजिलो साथी':'您的运输伙伴','विवरण यस एपमा सुरक्षित भयो।':'信息已保存在此应用中。'
    }
  };
  const tr = (text) => translations[language]?.[text] || text;




  const go = (p) => {
    setPage(p);
    setForm({});
    setMessage('');
  };


  const roleOptions = {
    'नेपाली': [
      ['customer', 'ग्राहक', 'सामान पठाउने वा मगाउने'],
      ['driver', 'ड्राइभर', 'लोड खोज्ने र ढुवानी गर्ने'],
      ['owner', 'गाडी साहु', 'गाडी र ड्राइभर व्यवस्थापन गर्ने'],
      ['transport', 'यातायात कम्पनी', 'ढुवानी व्यवसाय सञ्चालन गर्ने'],
      ['shipper', 'सामान पठाउने कम्पनी वा पार्टी', 'फ्याक्ट्री, ठेकेदार, सप्लायर तथा व्यापारी']
    ],
    'English': [
      ['customer', 'Customer', 'Send or receive goods'],
      ['driver', 'Driver', 'Find loads and deliver goods'],
      ['owner', 'Vehicle Owner', 'Manage vehicles and drivers'],
      ['transport', 'Transport Company', 'Manage transport operations'],
      ['shipper', 'Shipper / Business', 'Factory, contractor, supplier or trader']
    ],
    'हिन्दी': [
      ['customer', 'ग्राहक', 'सामान भेजें या मँगाएँ'],
      ['driver', 'ड्राइवर', 'लोड खोजें और सामान पहुँचाएँ'],
      ['owner', 'वाहन मालिक', 'वाहन और ड्राइवर सँभालें'],
      ['transport', 'परिवहन कंपनी', 'परिवहन व्यवसाय चलाएँ'],
      ['shipper', 'माल भेजने वाली कंपनी / पार्टी', 'फैक्ट्री, ठेकेदार, सप्लायर या व्यापारी']
    ],
    '中文': [
      ['customer', '客户', '寄送或接收货物'],
      ['driver', '司机', '寻找货运并运送货物'],
      ['owner', '车主', '管理车辆和司机'],
      ['transport', '运输公司', '管理运输业务'],
      ['shipper', '发货企业 / 商户', '工厂、承包商、供应商或贸易商']
    ]
  };


  if (!role && !welcomeAction && authStep !== 'complete') return (
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
            {['नेपाली','English','हिन्दी','中文'].map(name => <button key={name} type="button" onClick={() => {setLanguage(name);setLanguageMenuOpen(false);}} style={{display:'block',width:'100%',textAlign:'left',padding:10,border:0,borderRadius:8,background:language===name?'#e8f0f8':'white',color:'#102b46',fontSize:14}}>{name}</button>)}
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
        <button type="button" onClick={async () => {const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(error)setAuthMessage('Google Login समस्या: '+error.message);}} style={{width:'100%',padding:15,border:'1px solid #ffffff60',borderRadius:12,background:'#fff',color:'#102b46',fontSize:16,fontWeight:700}}>Google बाट लगइन गर्नुहोस्</button>
        {authMessage && <p style={{color:'#ffd6a8',fontSize:13,textAlign:'center'}}>{authMessage}</p>}
      </div>
    </div>
  );

  if (!role && authStep === 'complete') return (

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
              onClick={() => {setLanguage(name);setLanguageMenuOpen(false);}}
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
      {roleOptions[language].map(([key, name, desc]) => (
        <button key={key} onClick={() => { localStorage.setItem('load_role', key); setRole(key); }}
          style={{
            display:'block',width:'100%',textAlign:'left',
            padding:'16px',margin:'12px 0',
            border:'1px solid #ffffff45',borderRadius:14,
            background:'#ffffff',color:'#102b46',
            fontSize:16,fontWeight:700
          }}>
          {name}
          <div style={{
            fontSize:12,fontWeight:400,color:'#64748b',
            marginTop:6,lineHeight:1.5
          }}>{desc}</div>
        </button>
      ))}
      <p style={{fontSize:12,color:'#c5d5e5',marginTop:22}}>
        भूमिका छानेपछि खाता प्रमाणीकरण र सेवा सेटअप थप्नेछौँ।
      </p>
    </div>
  );


  if (welcomeAction && authStep !== 'complete') return (
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
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin }
            });
            if (error) setAuthMessage('Google Login समस्या: ' + error.message);
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

  const save = async (e) => {
    e.preventDefault();
    if (page !== 'post') {
      setMessage('विवरण प्राप्त भयो।');
      return;
    }
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        setMessage('पहिले इमेल OTP बाट लगइन गर्नुहोस्।');
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('phone_verified, kyc_status')
        .eq('user_id', auth.user.id)
        .single();
      if (profileError || !profile || !profile.phone_verified || profile.kyc_status !== 'approved') {
        setMessage('लोड पोस्ट गर्न फोन प्रमाणित र KYC स्वीकृत हुनुपर्छ।');
        return;
      }
      const { data, error } = await supabase.from('loads').insert({
        owner_id: auth.user.id,
        origin: form.origin,
        destination: form.destination,
        cargo: form.cargo,
        weight: form.weight,
        proposed_price: form.price ? Number(form.price) : null,
        status: 'open'
      }).select().single();
      if (error) throw error;
      setLoads(previous => [ { ...form, id: data.id }, ...previous ]);
      setForm({});
      setMessage('लोड डेटाबेसमा सुरक्षित भयो।');
    } catch (error) {
      setMessage('लोड सुरक्षित भएन: ' + (error.message || 'फेरि प्रयास गर्नुहोस्।'));
    }
  };

  const sections = [
    ['post', '📦', tr('लोड पोस्ट गर्नुहोस्'), tr('नयाँ सामान ढुवानीको विवरण')],
    ['loads', '🔎', tr('लोड खोज्नुहोस्'), tr('उपलब्ध ढुवानीका कामहरू')],
    ['truck', '🚛', tr('गाडी दर्ता गर्नुहोस्'), tr('गाडी र क्षमता विवरण')],
    ['license', '🪪', tr('ड्राइभरको लाइसेन्स'), tr('लाइसेन्स विवरण र फोटो')],
    ['bluebook', '📘', tr('गाडीको ब्लुबुक'), tr('गाडी दर्ता कागजात')],
    ['insurance', '🛡️', tr('गाडीको इन्सुरेन्स'), tr('बीमा पोलिसी र म्याद')],
    ['company', '🏢', tr('कम्पनीको विवरण'), tr('कम्पनीको नाम र दर्ता')],
    ['waybill', '🧾', tr('भाडाको चलानी'), tr('ढुवानी चलानी तयार गर्नुहोस्')],
  ];

  const titles = Object.fromEntries(sections.map(s => [s[0], s[2]]));

  return (
    <div className="app">
      <header className="top">
        <div className="brandmark">LM</div>
        <div><h1>Load</h1><small>LOGISTICS & CARGO</small></div>
        <span className="truck">🚛</span>

      </header>

      <div className="welcome">
        <small>LM LOGISTICS & CARGO</small>
        <h2>{page === 'home' ? tr('तपाईंको ढुवानी, अब सजिलो!') : titles[page]}</h2>
        <p>{tr('लोड खोज्नुहोस्। गाडी जोड्नुहोस्। कागजात व्यवस्थित राख्नुहोस्।')}</p>
      </div>

      {page === 'home' && <>
        <div className="stats">
          <div><b>{loads.length}</b><span>पोस्ट भएका लोड</span></div>
          <div><b>8</b><span>मुख्य सुविधाहरू</span></div>
        </div>
        <h3>{tr('तपाईंलाई के चाहिएको छ?')}</h3>
        <div className="menu">
          {sections.map(s => (
            <button className="tile" key={s[0]} onClick={() => go(s[0])}>
              <span className="tileicon">{s[1]}</span>
              <b>{s[2]}</b><small>{s[3]}</small><span className="arrow">›</span>
            </button>
          ))}
        </div>
      </>}

      {page === 'post' && <form onSubmit={save} className="panel">
        <h3>{tr('नयाँ लोडको विवरण')}</h3>
        {field(tr('लोड दिने व्यक्ति/कम्पनी'), 'sender')}
        {field(tr('सामान कहाँबाट उठाउने?'), 'origin')}
        {field(tr('सामान कहाँ पुर्‍याउने?'), 'destination')}
        {field(tr('सामानको नाम'), 'cargo')}
        {field(tr('तौल (टन/केजी)'), 'weight')}
        {field(tr('प्रस्तावित भाडा (रु.)'), 'price', 'number')}
        {field(tr('सम्पर्क नम्बर'), 'phone', 'tel')}
        <button className="primary">{tr('लोड सुरक्षित गर्नुहोस्')}</button>
      </form>}

      {page === 'loads' && <div className="panel">
        <h3>{tr('उपलब्ध लोडहरू')}</h3>
        {loads.length === 0 ? <p>अहिलेसम्म लोड पोस्ट गरिएको छैन। सुरु गर्न तलको बटन थिच्नुहोस्।</p> :
          loads.map(l => <div className="loadcard" key={l.id}>
            <b>{l.origin} → {l.destination}</b>
            <p>{l.cargo} · {l.weight}</p>
            <strong>रु. {l.price || 'तोकिएको छैन'}</strong>
            <p>सम्पर्क: {l.phone}</p>
          </div>)}
        <button className="primary" onClick={() => go('post')}>＋ {tr('नयाँ लोड पोस्ट')}</button>
      </div>}

      {page === 'truck' && <form onSubmit={save} className="panel">
        <h3>{tr('गाडीको विवरण')}</h3>
        {field(tr('गाडी नम्बर'), 'vehicleNo')}
        {field(tr('गाडीको प्रकार'), 'vehicleType')}
        {field(tr('सामान बोक्ने क्षमता'), 'capacity')}
        {field(tr('गाडी धनीको नाम'), 'owner')}
        {field(tr('सम्पर्क नम्बर'), 'phone', 'tel')}
        {field(tr('ब्लुबुक फोटो (पछि अपलोड गर्न मिल्ने)'), 'bluebookPhoto', 'file')}
        <button className="primary">{tr('गाडीको विवरण सुरक्षित गर्नुहोस्')}</button>
      </form>}

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

      {message && <div className="notice">✓ {tr(message)}<p>यो अहिलेको डेमोमा सुरक्षित भएको हो।</p></div>}

      {page !== 'home' && <button className="back" onClick={() => go('home')}>{tr('← मुख्य पृष्ठमा फर्कनुहोस्')}</button>}

      <footer>LOAD · LM LOGISTICS & CARGO <small>{tr('ढुवानीको सजिलो साथी')}</small></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
