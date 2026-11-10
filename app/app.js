const $=s=>document.querySelector(s),ls=localStorage;
const S={l:ls.l||'en',t:ls.t||(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'),g:'home',cfg:{},cats:[],svc:[],offers:[],f:{},ip:null};
const T={en:{home:'Home',business:'Business',emergency:'Emergency',hi:'Namaste',sub:'What do you need fixed today?',ph:'Search plumber, lock, website…',search:'Search',contact:'Contact',offers:'Offers',call:'Call',wa:'WhatsApp',inc:'What is included',exc:'Not included',all:'All',cats:'Categories',svcs:'Services',none:'No services found.',install:'Install the app on your phone',ibtn:'Install',ios:'Tap Share, then Add to Home Screen',price:'Lowest price',notif:'No new notifications',hot:'24/7 emergency hotline',hotsub:'A mistri is dispatched across Janakpur.',about:'About this service',addr:'Address',hrs:'Open daily, 6 AM – 10 PM',tos:'Terms',priv:'Privacy'},
ne:{home:'घर',business:'व्यवसाय',emergency:'आपतकालीन',hi:'नमस्ते',sub:'आज के मर्मत गर्नुपर्ने छ?',ph:'प्लम्बर, ताला, वेबसाइट खोज्नुहोस्…',search:'खोज',contact:'सम्पर्क',offers:'अफरहरू',call:'कल',wa:'व्हाट्सएप',inc:'के समावेश छ',exc:'समावेश छैन',all:'सबै',cats:'वर्गहरू',svcs:'सेवाहरू',none:'कुनै सेवा भेटिएन।',install:'फोनमा एप इन्स्टल गर्नुहोस्',ibtn:'इन्स्टल',ios:'Share थिचेर Add to Home Screen छान्नुहोस्',price:'कम मूल्य',notif:'नयाँ सूचना छैन',hot:'२४/७ आपतकालीन हटलाइन',hotsub:'जनकपुरभर मिस्त्री पठाइन्छ।',about:'सेवाको बारेमा',addr:'ठेगाना',hrs:'दैनिक खुला, बिहान ६ – राति १०',tos:'सर्तहरू',priv:'गोपनीयता'}};
const t=k=>T[S.l][k],L=o=>o?(o[S.l]||o.en):'',esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const GR=[['home','home'],['business','brief'],['emergency','alert']],go=h=>location.hash='#/'+h,cat=id=>S.cats.find(c=>c.id==id)||{};
async function init(){
 (await fetch('config.md').then(r=>r.text()).catch(()=>'')).split('\n').forEach(x=>{const m=x.match(/^(\w+):\s*(.+)$/);if(m)S.cfg[m[1]]=m[2].trim()});
 S.cats=await fetch('data/categories.json').then(r=>r.json());S.offers=await fetch('data/offers.json').then(r=>r.json());
 S.svc=(await Promise.all(S.cats.map(c=>fetch(c.file).then(r=>r.json()).catch(()=>[])))).flat();
 addEventListener('hashchange',route);addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.ip=e;route()});
 if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');shell();route()}
function shell(){document.documentElement.dataset.t=S.t;document.documentElement.lang=S.l;
 $('#top').innerHTML=`<label class=loc>${ic('pin',18)}<select aria-label=Location><option>${esc(S.cfg.city||'Janakpur')}</option></select>${ic('down',16)}</label><div class=sp></div>
 <button class=ib onclick="go('offers')" aria-label=Offers>${ic('tag',20)}</button><button class=ib onclick="toast(t('notif'))" aria-label=Notifications>${ic('bell',20)}<i></i></button>
 <button class=ib id=lg aria-label=Language>${S.l=='en'?'ने':'EN'}</button><button class=ib id=th aria-label=Theme>${ic(S.t=='dark'?'sun':'moon',20)}</button>`;
 $('#lg').onclick=()=>{S.l=S.l=='en'?'ne':'en';ls.l=S.l;shell();route()};$('#th').onclick=()=>{S.t=S.t=='dark'?'light':'dark';ls.t=S.t;shell()};
 $('#tabs').innerHTML=[['','home','home'],['search','search','search'],['contact','chat','contact']].map(([h,i,k])=>`<button data-h="${h}" onclick="go('${h}')">${ic(i,22)}${t(k)}</button>`).join('')}
function mark(h){$('#tabs').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.h==(['search','contact'].includes(h)?h:'')))}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('s');setTimeout(()=>e.classList.remove('s'),1800)}
const price=s=>`<div class=pr>Rs. ${s.price.toLocaleString('en-IN')}${s.priceBefore?`<s>Rs. ${s.priceBefore.toLocaleString('en-IN')}</s>`:''}</div>`;
const card=s=>`<button class=card onclick="go('s/${s.id}')" style="--c:${cat(s.category).color}"><div class=ban style="background-image:url(${s.image})"><div class=ov>${L(s.tags).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div><div class=cb><b>${esc(L(s.title))}</b><p>${esc(L(s.short))}</p><div class=pf>${price(s)}<span class=go>${ic('arrow',18)}</span></div></div></button>`;
const ins=()=>S.ip?`<div class=ins>${ic('install')}<span>${t('install')}</span><button onclick="S.ip.prompt();S.ip=null;route()">${t('ibtn')}</button></div>`:(/iphone|ipad/i.test(navigator.userAgent)&&!navigator.standalone?`<div class=ins>${ic('install')}<span>${t('ios')}</span></div>`:'');
function route(){const h=(location.hash||'#/').slice(2).split('/'),v=$('#view');mark(h[0]);if(h[0]=='s')return detail(h[1]);$('#detail').hidden=true;
 if(['','home','business','emergency'].includes(h[0])){S.g=h[0]||S.g;v.innerHTML=groupView()}
 else if(h[0]=='search'){v.innerHTML=`<div class=hi style="margin-bottom:12px">${t('search')}</div><input class=sb id=q type=search placeholder="${t('ph')}" autofocus><div class=list id=res style=margin-top:0></div>`;
  $('#q').oninput=e=>{const w=e.target.value.toLowerCase().trim(),r=w?S.svc.filter(s=>JSON.stringify(s).toLowerCase().includes(w)):[];$('#res').innerHTML=r.length?r.map(card).join(''):(w?`<p style=color:var(--mute)>${t('none')}</p>`:'')}}
 else if(h[0]=='offers')v.innerHTML=`<div class=hi>${t('offers')}</div><div class=list style=margin-top:0>${S.offers.map(offer).join('')}</div>`;
 else v.innerHTML=`<div class=hi>${t('contact')}</div><div class=ct><a class=b href="tel:${esc(S.cfg.phone)}">${ic('phone',20)}${t('call')}</a><a class="b w" href="https://wa.me/${S.cfg.whatsapp}" target=_blank rel=noopener>${ic('chat',20)}${t('wa')}</a><div class=bx><h4>${t('addr')}</h4><li>${ic('pin',20)}${esc(S.cfg.default_address||'')}</li><li>${ic('clock',20)}${t('hrs')}</li></div><div class=bx><li><a href=/terms.html>${t('tos')}</a></li><li><a href=/privacy.html>${t('priv')}</a></li></div></div>`}
const offer=o=>`<div class=of style="background-image:url(${o.image});flex:none;max-width:none;width:100%"><b>${esc(L(o.title))}</b><span>${esc(L(o.text))}</span></div>`;
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
function link(s){const m=(S.cfg['message_'+S.l]||S.cfg.message_en).replace('{title}',L(s.title)).replace('{id}',s.id),ne=S.l=='ne';
 return `https://wa.me/${S.cfg.whatsapp}?text=${encodeURIComponent(`${m}\n\n${ne?'नाम':'Name'}: \n${ne?'फोन':'Phone'}: \n${ne?'ठेगाना':'Address'}: ${S.cfg.default_address||''}`)}`}
function detail(id){const s=S.svc.find(x=>x.id==id),d=$('#detail');if(!s)return go('');const c=cat(s.category);document.title=L(s.title)+' – Call Mistri Sewa';d.hidden=false;
 const li=(a,i)=>L(a).map(x=>`<li>${ic(i,18)}${esc(x)}</li>`).join('');
 d.innerHTML=`<button class="ib bk" onclick="history.back()" aria-label=Back>${ic('back',22)}</button><div class=ban style="--c:${c.color};background-image:url(${s.image})"></div>
 <div class=sh><div class=gl>${t(s.group)} · ${esc(L(c.name))}</div><h1>${esc(L(s.title))}</h1>${L(s.tags).map(x=>`<span class=tg>${esc(x)}</span>`).join('')}${price(s)}<p><b style=color:var(--ink)>${t('about')}</b><br>${esc(L(s.short))} ${esc(L(s.detail))}</p>
 <div class=bx><h4>${t('inc')}</h4>${li(s.included,'check')}</div><div class="bx x"><h4>${t('exc')}</h4>${li(s.excluded,'x')}</div></div>
 <div class=cta><a class=b href="tel:${esc(S.cfg.phone)}">${ic('phone',20)}${t('call')}</a><a class="b w" href="${link(s)}" target=_blank rel=noopener>${ic('chat',20)}${t('wa')}</a></div>`;d.scrollTop=0}
init();
