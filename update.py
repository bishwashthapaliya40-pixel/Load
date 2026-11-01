from pathlib import Path
import re

p = Path("src.jsx")
s = p.read_text()

def replace_once(old, new, name):
    global s
    if old not in s:
        raise SystemExit("परिवर्तन रोकियो: " + name + " भेटिएन। पुरानो कोड सुरक्षित छ।")
    s = s.replace(old, new, 1)

replace_once(
    "  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);",
    "  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);\n"
    "  const [mainMenuOpen, setMainMenuOpen] = useState(false);",
    "मेनु state"
)

header = r'''<header className="top">
        <div className="brandmark">LM</div>
        <div><h1>Load</h1><small>LOGISTICS & CARGO</small></div>
        <span className="truck">🚛</span>
        <div style={{display:'flex',gap:8,marginLeft:'auto',position:'relative'}}>
          <button type="button" aria-label="भाषा"
            onClick={() => {setLanguageMenuOpen(!languageMenuOpen);setMainMenuOpen(false);}}
            style={{fontSize:23,border:0,borderRadius:10,padding:'8px',background:'#102b46',color:'white'}}>🌐</button>
          <button type="button" aria-label="मुख्य मेनु"
            onClick={() => {setMainMenuOpen(!mainMenuOpen);setLanguageMenuOpen(false);}}
            style={{fontSize:27,border:0,borderRadius:10,padding:'4px 10px',background:'#102b46',color:'white'}}>⋮</button>
          {languageMenuOpen && <div style={{position:'absolute',right:48,top:'110%',zIndex:10001,minWidth:145,background:'white',color:'#102b46',borderRadius:12,boxShadow:'0 4px 16px #0003',padding:6}}>
            {[['नेपाली','🇳🇵'],['English','🇬🇧'],['हिन्दी','🇮🇳'],['中文','🇨🇳']].map(([name,flag]) =>
              <button key={name} type="button" onClick={() => {setLanguage(name);setLanguageMenuOpen(false);}}
                style={{display:'block',width:'100%',textAlign:'left',padding:10,border:0,borderRadius:8,background:language===name?'#e8f0f8':'white',color:'#102b46'}}>{flag} {name}</button>)}
          </div>}
          {mainMenuOpen && <div style={{position:'absolute',right:0,top:'110%',zIndex:10000,width:235,maxHeight:'75vh',overflowY:'auto',background:'white',color:'#102b46',borderRadius:12,boxShadow:'0 4px 18px #0005',padding:6}}>
            {[
              ['settings-account','👤','Account'],
              ['settings-privacy','🔐','Privacy'],
              ['settings-lists','📋','Lists'],
              ['settings-notifications','🔔','Notifications'],
              ['settings-storage','💾','Storage and Data'],
              ['settings-language','🌐','App Language'],
              ['settings-help','❓','Help'],
              ['settings-city','📍','City'],
              ['settings-history','🕘','Request History']
            ].map(([key,icon,label]) => <button key={key} type="button"
              onClick={() => {setMainMenuOpen(false);go(key);}}
              style={{display:'block',width:'100%',textAlign:'left',padding:'12px 10px',border:0,borderRadius:8,background:'white',color:'#102b46',fontSize:15}}>{icon} {label}</button>)}
            <button type="button" onClick={() => {setMainMenuOpen(false);logout();}}
              style={{display:'block',width:'100%',textAlign:'left',padding:'12px 10px',border:0,borderTop:'1px solid #ddd',background:'white',color:'#c62828',fontSize:15}}>🚪 Logout</button>
          </div>}
        </div>
      </header>'''

s, n = re.subn(r'<header className="top">.*?</header>', lambda m: header, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit("Header भेटिएन। पुरानो कोड सुरक्षित छ।")

replace_once(
    "<h2>{page === 'home' ? tr('तपाईंको ढुवानी, अब सजिलो!') : titles[page]}</h2>",
    "<h2>{page === 'home' ? tr('तपाईंको ढुवानी, अब सजिलो!') : (titles[page] || ({'settings-account':'Account','settings-privacy':'Privacy','settings-lists':'Lists','settings-notifications':'Notifications','settings-storage':'Storage and Data','settings-language':'App Language','settings-help':'Help','settings-city':'City','settings-history':'Request History'}[page] || page))}</h2>",
    "पेज शीर्षक"
)

settings = r'''
      {page.startsWith('settings-') && <div className="panel">
        {page === 'settings-account' && <>
          <h3>Account / खाता</h3>
          <p>हालको भूमिका: {role || 'छानिएको छैन'}</p>
          <p>लगइन र खाता विवरण यहाँ व्यवस्थापन गर्न सकिनेछ।</p>
          <button type="button" className="primary" onClick={() => setMessage('खाता व्यवस्थापनका थप विवरण जोड्न बाँकी छ।')}>Account Details</button>
        </>}
        {page === 'settings-privacy' && <>
          <h3>Privacy / गोपनीयता</h3>
          <p>आफ्नो खाता बन्द गर्ने र स्थायी रूपमा मेटाउने विकल्प छुट्टाछुट्टै छन्।</p>
          <button type="button" className="primary" onClick={() => setMessage('Account Deactivate सुविधा सुरक्षित server-side प्रक्रिया जोड्न बाँकी छ। अहिले खाता बन्द भएको छैन।')}>Account Deactivate</button>
          <button type="button" style={{display:'block',width:'100%',padding:14,marginTop:12,border:0,borderRadius:10,background:'#b91c1c',color:'white',fontWeight:700}} onClick={() => setMessage('Delete Account सुविधा सुरक्षित server-side प्रक्रिया र पहिचान प्रमाणीकरण जोड्न बाँकी छ। खाता मेटिएको छैन।')}>Delete Account</button>
        </>}
        {page === 'settings-lists' && <>
          <h3>Lists / सूचीहरू</h3>
          {sections.map(item => <button key={item[0]} type="button" onClick={() => go(item[0])} style={{display:'block',width:'100%',padding:13,margin:'8px 0',textAlign:'left',border:'1px solid #ddd',borderRadius:10,background:'white',color:'#102b46'}}>{item[1]} {item[2]}</button>)}
        </>}
        {page === 'settings-notifications' && <>
          <h3>Notifications / सूचनाहरू</h3>
          <p>लोड, बुकिङ र खातासम्बन्धी सूचनाहरू यहाँ देखाइनेछन्।</p>
          <p>Push notification सेवा जोड्न बाँकी छ।</p>
        </>}
        {page === 'settings-storage' && <>
          <h3>Storage and Data / डाटा</h3>
          <p>लोड सूचीमा हाल देखिएका रेकर्ड: {loads.length}</p>
          <p>मोबाइलमा फाइल र डाटा व्यवस्थापन सुविधा पछि जोड्न सकिन्छ।</p>
        </>}
        {page === 'settings-language' && <>
          <h3>App Language / एपको भाषा</h3>
          {[['नेपाली','🇳🇵'],['English','🇬🇧'],['हिन्दी','🇮🇳'],['中文','🇨🇳']].map(([name,flag]) =>
            <button key={name} type="button" onClick={() => setLanguage(name)} style={{display:'block',width:'100%',padding:13,margin:'8px 0',textAlign:'left',border:'1px solid #ddd',borderRadius:10,background:language===name?'#fff0df':'white',color:'#102b46'}}>{flag} {name} {language===name?'✓':''}</button>)}
        </>}
        {page === 'settings-help' && <>
          <h3>Help / सहायता</h3>
          <p>Load एप प्रयोग गर्दा समस्या आएमा यहाँ सहायता र प्रतिक्रिया सुविधा राखिनेछ।</p>
          <p>सम्पर्क विवरण जोड्न बाँकी छ।</p>
        </>}
        {page === 'settings-city' && <>
          <h3>City / सहर</h3>
          <label>आफ्नो सहर
            <input value={form.city || ''} onChange={e => setForm({...form,city:e.target.value})} placeholder="जस्तै: Kathmandu" style={{display:'block',width:'100%',boxSizing:'border-box',padding:13,marginTop:8}}/>
          </label>
          <button type="button" className="primary" onClick={() => setMessage(form.city ? 'सहर छानियो: '+form.city+' (अहिले यो सत्रमा मात्र)' : 'पहिले सहर लेख्नुहोस्।')}>Save City</button>
        </>}
        {page === 'settings-history' && <>
          <h3>Request History / अनुरोध इतिहास</h3>
          <p>तपाईंले गरेका अनुरोध र बुकिङहरूको इतिहास यहाँ देखाइनेछ।</p>
          <p>हाल छुट्टै अनुरोध इतिहास डेटाबेस जोडिएको छैन।</p>
        </>}
      </div>}
'''
replace_once(
    "      {message && <div className=\"notice\">",
    settings + "\n      {message && <div className=\"notice\">",
    "सेटिङ पेजहरू"
)

replace_once(
    "      {page !== 'home' && <button className=\"back\" onClick={() => go('home')}>{tr('← मुख्य पृष्ठमा फर्कनुहोस्')}</button>}",
    "      {page !== 'home' && <button type=\"button\" aria-label=\"पछाडि फर्कनुहोस्\" onClick={goBack} style={floatingBack}>‹</button>}",
    "तलको Back बटन"
)

p.write_text(s)
print("परिवर्तन सुरक्षित भयो।")
