const $=s=>document.querySelector(s),ls=localStorage;
const S={l:ls.l||'en',t:ls.t||(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'),g:'home',cfg:{},cats:[],svc:[],offers:[],news:[],np:null,f:{},ip:null};
const T={en:{home:'Home',business:'Business',emergency:'Emergency',hi:'Namaste',sub:'What do you need fixed today?',ph:'Search plumber, lock, website…',search:'Search',more:'More',notifs:'Notifications',offers:'Offers',updates:'Updates',call:'Call',wa:'WhatsApp',inc:'What is included',exc:'Not included',all:'All',cats:'Categories',svcs:'Services',none:'No services found.',install:'Install the app on your phone',ibtn:'Install',ios:'Tap Share, then Add to Home Screen',brow:'Open this page in Chrome or Safari to install',done:'Installed',price:'Lowest price',hot:'24/7 emergency hotline',hotsub:'A mistri is dispatched across Janakpur.',about:'About this service',prof:'Your details',pnote:'Saved on this device only. Used to fill your WhatsApp message.',name:'Name',phone:'Phone number',prov:'Province',dist:'District',muni:'Municipality',ward:'Ward',tole:'Tole, street or landmark',loc:'Use my current location',lok:'Location added',lno:'Could not get location',pinned:'Map pin saved',look:'Appearance',light:'Light',dark:'Dark',app:'App',web:'Back to website',tos:'Terms of Service',priv:'Privacy Policy',ver:'Version',rights:'All rights reserved.',contact:'Contact us'},
ne:{home:'घर',business:'व्यवसाय',emergency:'आपतकालीन',hi:'नमस्ते',sub:'आज के मर्मत गर्नुपर्ने छ?',ph:'प्लम्बर, ताला, वेबसाइट खोज्नुहोस्…',search:'खोज',more:'थप',notifs:'सूचनाहरू',offers:'अफरहरू',updates:'अपडेटहरू',call:'कल',wa:'व्हाट्सएप',inc:'के समावेश छ',exc:'समावेश छैन',all:'सबै',cats:'वर्गहरू',svcs:'सेवाहरू',none:'कुनै सेवा भेटिएन।',install:'फोनमा एप इन्स्टल गर्नुहोस्',ibtn:'इन्स्टल',ios:'Share थिचेर Add to Home Screen छान्नुहोस्',brow:'इन्स्टल गर्न Chrome वा Safari मा खोल्नुहोस्',done:'इन्स्टल भइसकेको',price:'कम मूल्य',hot:'२४/७ आपतकालीन हटलाइन',hotsub:'जनकपुरभर मिस्त्री पठाइन्छ।',about:'सेवाको बारेमा',prof:'तपाईंको विवरण',pnote:'यही फोनमा मात्र सुरक्षित। व्हाट्सएप सन्देशमा प्रयोग हुन्छ।',name:'नाम',phone:'फोन नम्बर',prov:'प्रदेश',dist:'जिल्ला',muni:'पालिका',ward:'वडा',tole:'टोल, सडक वा चिनारी',loc:'मेरो हालको स्थान प्रयोग गर्नुहोस्',lok:'स्थान थपियो',lno:'स्थान पाउन सकिएन',pinned:'नक्सा पिन सुरक्षित',look:'स्वरूप',light:'उज्यालो',dark:'अँध्यारो',app:'एप',web:'वेबसाइटमा फर्कनुहोस्',tos:'सेवाका सर्तहरू',priv:'गोपनीयता नीति',ver:'संस्करण',rights:'सर्वाधिकार सुरक्षित।',contact:'सम्पर्क गर्नुहोस्'}};
const t=k=>T[S.l][k],L=o=>o?(o[S.l]||o.en):'',esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const GR=[['home','home'],['business','brief'],['emergency','alert']],go=h=>location.hash='#/'+h,cat=id=>S.cats.find(c=>c.id==id)||{};
const P=()=>{const q=JSON.parse(ls.p||'{}');if(S.np&&q.pi==null){const f=(a,fn)=>Math.max(0,a.findIndex(fn));q.pi=f(S.np,x=>/Madhesh/.test(x[0]));const d=S.np[q.pi][2];q.di=f(d,x=>x[0]=='Dhanusha');q.mi=f(d[q.di][2],x=>/^Janakpur/.test(x[0]));q.w=0}return q},sv=q=>ls.p=JSON.stringify(q);
function ptext(q){if(!S.np||q.pi==null)return S.cfg.default_address||'';const p=S.np[q.pi],d=p[2][q.di],m=d[2][q.mi],i=S.l=='ne'?1:0;return [q.tole,`${m[i]}-${q.w+1}`,d[i],p[i]].filter(Boolean).join(', ')}
const standalone=()=>matchMedia('(display-mode:standalone)').matches||navigator.standalone;
async function init(){
 (await fetch('config.md').then(r=>r.text()).catch(()=>'')).split('\n').forEach(x=>{const m=x.match(/^(\w+):\s*(.+)$/);if(m)S.cfg[m[1]]=m[2].trim()});
 S.cats=await fetch('data/categories.json').then(r=>r.json());S.offers=await fetch('data/offers.json').then(r=>r.json());S.news=await fetch('data/notifications.json').then(r=>r.json()).catch(()=>[]);
 S.svc=(await Promise.all(S.cats.map(c=>fetch(c.file).then(r=>r.json()).catch(()=>[])))).flat();
 addEventListener('hashchange',route);addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.ip=e;route()});
 if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');shell();route();
 S.np=await fetch('data/nepal.json').then(r=>r.json()).catch(()=>null);if(location.hash.startsWith('#/more'))route()}
function shell(){document.documentElement.dataset.t=S.t;document.documentElement.lang=S.l;
 $('#top').innerHTML=`<label class=loc>${ic('pin',18)}<select aria-label=Location><option>${esc(S.cfg.city||'Janakpur')}</option></select>${ic('down',16)}</label><div class=sp></div>
 <button class=ib id=lg aria-label=Language>${S.l=='en'?'ने':'EN'}</button><button class=ib onclick="go('notifications')" aria-label=Notifications>${ic('bell',20)}${ls.seen?'':'<i></i>'}</button>`;
 $('#lg').onclick=()=>{S.l=S.l=='en'?'ne':'en';ls.l=S.l;shell();route()};
 $('#tabs').innerHTML=[['','home','home'],['search','search','search'],['more','more','more']].map(([h,i,k])=>`<button data-h="${h}" onclick="go('${h}')">${ic(i,22)}${t(k)}</button>`).join('')}
function mark(h){$('#tabs').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.h==(['search','more'].includes(h)?h:'')))}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('s');setTimeout(()=>e.classList.remove('s'),1800)}
const price=s=>`<div class=pr>Rs. ${s.price.toLocaleString('en-IN')}${s.priceBefore?`<s>Rs. ${s.priceBefore.toLocaleString('en-IN')}</s>`:''}</div>`;
const card=s=>`<button class=card onclick="go('s/${s.id}')" style="--c:${cat(s.category).color}"><div class=ban style="background-image:url(${s.image})"><div class=ov>${L(s.tags).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div><div class=cb><b>${esc(L(s.title))}</b><p>${esc(L(s.short))}</p><div class=pf>${price(s)}<span class=go>${ic('arrow',18)}</span></div></div></button>`;
const ins=()=>S.ip?`<div class=ins>${ic('install')}<span>${t('install')}</span><button onclick="inst()">${t('ibtn')}</button></div>`:'';
const inst=()=>{S.ip.prompt();S.ip=null;route()};
const offer=o=>`<div class=of onclick="go('notifications')" style="background-image:url(${o.image})"><b>${esc(L(o.title))}</b><span>${esc(L(o.text))}</span></div>`;
function route(){const h=(location.hash||'#/').slice(2).split('/'),v=$('#view');mark(h[0]);if(h[0]=='s')return detail(h[1]);$('#detail').hidden=true;
 if(['','home','business','emergency'].includes(h[0])){S.g=h[0]||S.g;v.innerHTML=groupView()}
 else if(h[0]=='search'){v.innerHTML=`<div class=hi style="margin-bottom:12px">${t('search')}</div><input class=sb id=q type=search placeholder="${t('ph')}" autofocus><div class=list id=res style=margin-top:0></div>`;
  $('#q').oninput=e=>{const w=e.target.value.toLowerCase().trim(),r=w?S.svc.filter(s=>JSON.stringify(s).toLowerCase().includes(w)):[];$('#res').innerHTML=r.length?r.map(card).join(''):(w?`<p style=color:var(--mute)>${t('none')}</p>`:'')}}
 else if(h[0]=='notifications'){ls.seen=1;shell();v.innerHTML=`<div class=hi>${t('notifs')}</div><h3 style=margin-top:6px>${t('offers')}</h3><div class=list style=margin-top:0>${S.offers.map(offer).join('')}</div><h3>${t('updates')}</h3><div class=bx style=padding:0>${S.news.map(n=>`<li style="padding:14px 16px;align-items:flex-start"><span class=nd>${ic('bell',18)}</span><div><b>${esc(L(n.title))}</b><p style="color:var(--mute);font-size:13px">${esc(L(n.text))}</p><small style=color:var(--mute)>${esc(L(n.time))}</small></div></li>`).join('')}</div>`}
 else v.innerHTML=more()}
function groupView(){const g=S.g;if(S.f.g!=g)S.f={g,cat:'all',tag:'all',sort:0};
 return `${ins()}<div class=hi>${t('hi')}<small>${t('sub')}</small></div>
 <div class=seg>${GR.map(([k,i])=>`<button class="${g==k?'on':''} ${k=='emergency'?'r':''}" onclick="go('${k}')">${ic(i,18)}${t(k)}</button>`).join('')}</div>
 <button class=sb onclick="go('search')">${ic('search',20)}${t('ph')}</button>
 ${g=='emergency'?`<div class=hot>${ic('alert',34)}<div><b>${t('hot')}</b><span>${t('hotsub')}</span></div><a href="tel:${esc(S.cfg.phone)}" aria-label=Call>${ic('phone',22)}</a></div>`:`<div class=row>${S.offers.map(offer).join('')}</div>`}
 <div id=lw>${lower()}</div>`}
function lower(){const g=S.g,cs=S.cats.filter(c=>c.group==g);let r=S.svc.filter(s=>s.group==g);if(S.f.cat!='all')r=r.filter(s=>s.category==S.f.cat);
 const tags=[...new Set(r.flatMap(s=>L(s.tags)))];if(S.f.tag!='all')r=r.filter(s=>L(s.tags).includes(S.f.tag));if(S.f.sort)r=[...r].sort((a,b)=>a.price-b.price);
 return `<h3>${t('cats')}</h3><div class=cats>${cs.map(c=>`<button class="cat ${S.f.cat==c.id?'on':''}" style="--c:${c.color}" onclick="F('cat','${S.f.cat==c.id?'all':c.id}')"><span>${ic(c.icon,26)}</span>${esc(L(c.name))}</button>`).join('')}</div>
 <h3>${t('svcs')}</h3><div class=chips><button class="chip ${S.f.tag=='all'?'on':''}" onclick="F('tag','all')">${t('all')}</button>${tags.map(x=>`<button class="chip ${S.f.tag==x?'on':''}" onclick="F('tag','${esc(x)}')">${esc(x)}</button>`).join('')}<button class="chip ${S.f.sort?'on':''}" onclick="F('sort',${S.f.sort?0:1})">${ic('sliders',15)}${t('price')}</button></div>
 <div class=list>${r.map(card).join('')||`<p style=color:var(--mute)>${t('none')}</p>`}</div>`}
function F(k,v){S.f[k]=v;$('#lw').innerHTML=lower()}
/* ---- More ---- */
function more(){const q=P(),rw=(h,i,x,ext)=>`<a class=rw href="${h}">${ic(i,20)}<span>${x}</span>${ic('arrow',16)}</a>`;
 return `<div class=hi>${t('more')}</div><div class=ct>
 <div class=bx><h4>${t('prof')}</h4><p class=nt2>${t('pnote')}</p>
  <label class=fl>${t('name')}<input id=pn value="${esc(q.name)}" autocomplete=name oninput="pi_()"></label>
  <label class=fl>${t('phone')}<input id=pp value="${esc(q.phone)}" type=tel inputmode=tel autocomplete=tel oninput="pi_()"></label>
  <div id=pf>${addrForm()}</div>
  <label class=fl>${t('tole')}<input id=pt value="${esc(q.tole)}" oninput="pi_()"></label>
  <button class="b" style="margin:6px 0 4px;width:100%" onclick="locate()">${ic('locate',20)}${t('loc')}</button>${q.lat?`<p class=nt2><a href="https://maps.google.com/?q=${q.lat},${q.lng}" target=_blank rel=noopener>${t('pinned')}: ${q.lat}, ${q.lng}</a></p>`:''}</div>
 <div class=bx><h4>${t('look')}</h4><div class=seg style="margin:4px 0 12px"><button class="${S.t=='light'?'on':''}" onclick="setT('light')">${ic('sun',18)}${t('light')}</button><button class="${S.t=='dark'?'on':''}" onclick="setT('dark')">${ic('moon',18)}${t('dark')}</button></div></div>
 <div class=bx><h4>${t('app')}</h4>${S.ip?`<div class=rw onclick="inst()">${ic('install',20)}<span>${t('install')}</span><b class=pl>${t('ibtn')}</b></div>`:`<div class=rw>${ic('install',20)}<span>${standalone()?t('done'):(/iphone|ipad/i.test(navigator.userAgent)?t('ios'):t('brow'))}</span></div>`}</div>
 <div class=bx><h4>${t('contact')}</h4>${rw('tel:'+esc(S.cfg.phone),'phone',t('call'))}${rw('https://wa.me/'+S.cfg.whatsapp,'chat',t('wa'))}</div>
 <div class=bx>${rw('../','globe',t('web'))}${rw('../terms.html','file',t('tos'))}${rw('../privacy.html','shield',t('priv'))}</div>
 <p class=nt2 style="text-align:center;padding:6px 0">${esc(S.cfg.brand||'Call Mistri Sewa')} · ${t('ver')} ${esc(S.cfg.version||'1.0.0')}<br>© 2026 ${t('rights')}</p></div>`}
function addrForm(){const q=P();if(!S.np)return '';const p=S.np[q.pi],d=p[2][q.di],m=d[2][q.mi],i=S.l=='ne'?1:0;
 const sel=(id,l,v,lab)=>`<label class=fl>${lab}<select id=${id} onchange="pc('${id}')">${l.map((x,j)=>`<option value=${j} ${j==v?'selected':''}>${esc(x)}</option>`).join('')}</select></label>`;
 return sel('pi',S.np.map(x=>x[i]),q.pi,t('prov'))+sel('di',p[2].map(x=>x[i]),q.di,t('dist'))+sel('mi',d[2].map(x=>x[i]),q.mi,t('muni'))+sel('pw',Array.from({length:m[2]},(_,j)=>String(j+1)),q.w,t('ward'))}
function pi_(){const q=P();q.name=$('#pn').value;q.phone=$('#pp').value;q.tole=$('#pt').value;sv(q)}
function pc(id){const q=P(),v=+$('#'+id).value;if(id=='pi'){q.pi=v;q.di=0;q.mi=0;q.w=0}else if(id=='di'){q.di=v;q.mi=0;q.w=0}else if(id=='mi'){q.mi=v;q.w=0}else q.w=v;sv(q);$('#pf').innerHTML=addrForm()}
function setT(v){S.t=v;ls.t=v;shell();route()}
function locate(){if(!navigator.geolocation)return toast(t('lno'));navigator.geolocation.getCurrentPosition(async p=>{const q=P();pi_();const z=P();Object.assign(q,{name:z.name,phone:z.phone,tole:z.tole});q.lat=+p.coords.latitude.toFixed(5);q.lng=+p.coords.longitude.toFixed(5);
 try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=17&lat=${q.lat}&lon=${q.lng}`).then(r=>r.json());if(!q.tole&&r.display_name)q.tole=r.display_name.split(',').slice(0,2).join(',').trim()}catch{}
 sv(q);toast(t('lok'));route()},()=>toast(t('lno')),{enableHighAccuracy:true,timeout:12000})}
function link(s){const m=(S.cfg['message_'+S.l]||S.cfg.message_en).replace('{title}',L(s.title)).replace('{id}',s.id),q=P(),ne=S.l=='ne',a=[m,'',`${ne?'नाम':'Name'}: ${q.name||''}`,`${ne?'फोन':'Phone'}: ${q.phone||''}`,`${ne?'ठेगाना':'Address'}: ${ptext(q)}`];if(q.lat)a.push(`Map: https://maps.google.com/?q=${q.lat},${q.lng}`);
 return `https://wa.me/${S.cfg.whatsapp}?text=${encodeURIComponent(a.join('\n'))}`}
function detail(id){const s=S.svc.find(x=>x.id==id),d=$('#detail');if(!s)return go('');const c=cat(s.category);document.title=L(s.title)+' – Call Mistri Sewa';d.hidden=false;
 const li=(a,i)=>L(a).map(x=>`<li>${ic(i,18)}${esc(x)}</li>`).join('');
 d.innerHTML=`<button class="ib bk" onclick="history.back()" aria-label=Back>${ic('back',22)}</button><div class=ban style="--c:${c.color};background-image:url(${s.image})"></div>
 <div class=sh><div class=gl>${t(s.group)} · ${esc(L(c.name))}</div><h1>${esc(L(s.title))}</h1>${L(s.tags).map(x=>`<span class=tg>${esc(x)}</span>`).join('')}${price(s)}<p><b style=color:var(--ink)>${t('about')}</b><br>${esc(L(s.short))} ${esc(L(s.detail))}</p>
 <div class=bx><h4>${t('inc')}</h4>${li(s.included,'check')}</div><div class="bx x"><h4>${t('exc')}</h4>${li(s.excluded,'x')}</div></div>
 <div class=cta><a class=b href="tel:${esc(S.cfg.phone)}">${ic('phone',20)}${t('call')}</a><a class="b w" href="${link(s)}" target=_blank rel=noopener>${ic('chat',20)}${t('wa')}</a></div>`;d.scrollTop=0}
init();
