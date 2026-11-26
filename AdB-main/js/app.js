/* ==========================================================
   Asociația de Băștinași „Călărășenii” – aplicația (partea publică + nucleu)
   ========================================================== */
(function(){
'use strict';
var CATS=['Noutăți ale Asociației','Evenimente locale','Întâlniri cu diaspora','Zilele Diasporei','Comunicate și anunțuri'];
var STATUS=['În desfășurare','Finalizat'];
var $=function(s,r){return (r||document).querySelector(s)};
/* starea comună a aplicației (partajată cu admin.js prin window.App) */
var S={data:DB.data,mode:'',curTab:'general',adnIdx:0,newsFilter:'Toate'};

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function paras(t){return String(t||'').split(/\n+/).filter(function(x){return x.trim()}).map(function(x){return '<p>'+esc(x)+'</p>'}).join('')}
function url(u){u=String(u||'').trim();if(!u)return '';if(/^https?:\/\//i.test(u))return u;return /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(u)?'https://'+u:''}
function fmtDate(d){if(!d)return '';var t=new Date(d+'T12:00:00');return isNaN(t)?esc(d):t.toLocaleDateString('ro-RO',{day:'numeric',month:'long',year:'numeric'})}
function empty(t,d){return '<div class="empty"><b>'+esc(t)+'</b><span>'+esc(d)+'</span></div>'}
function checks(a){a=(a||[]).filter(function(x){return String(x).trim()});return a.length?'<ul class="checks">'+a.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':''}
function initials(n){return String(n||'?').replace(/[„”"]/g,'').split(/\s+/).filter(Boolean).filter(function(w){return w.length>2}).slice(0,2).map(function(w){return w[0].toUpperCase()}).join('')}
function sec(id,cls,inner){return '<section class="s band-full '+(cls||'')+'" id="'+id+'"><div class="wrap">'+inner+'</div></section>'}
function sh(title,lead){return '<div class="sh"><h2>'+esc(title)+'</h2>'+(lead?'<p>'+esc(lead)+'</p>':'')+'</div>'}
function imgSrc(id){id=String(id||'').trim();if(/^https?:\/\//i.test(id)||/^data:image\//i.test(id))return id;return /^assets\//.test(id)?id:''}
function pic(id,cls,alt){var u=imgSrc(id);return u?'<img class="'+cls+'" src="'+esc(u)+'" alt="'+esc(alt||'')+'" loading="lazy">':''}
function sortedNews(){return (S.data.news||[]).slice().sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''))})}

function newsCard(n){
  var t=String(n.text||''),short=t.length>200?t.slice(0,200).replace(/\s+\S*$/,'')+'…':t;
  return '<article class="card">'+pic(n.image,'ph',n.title)+'<div class="meta">'+esc(n.category||'')+(n.date?' · '+fmtDate(n.date):'')+'</div><h3>'+esc(n.title)+'</h3>'
   +(t.length>200?'<p>'+esc(short)+'</p><details><summary>Citește tot</summary>'+paras(t)+'</details>':(t?'<p>'+esc(t)+'</p>':''))+'</article>';
}

function newsList(filter){
  var l=sortedNews().filter(function(n){return filter==='Toate'||n.category===filter});
  return l.length?'<div class="grid">'+l.map(newsCard).join('')+'</div>':empty('Nicio înregistrare încă','Anunțurile și evenimentele Asociației vor apărea aici.');
}

function siteHTML(){
  var D=S.data,s=D.site,c=D.contacts,m=D.membership,i;
  var logo=App.LOGO;
  var email=esc(c.email);
  var nav=[['acasa','Acasă'],['despre-noi','Despre noi'],['devino-membru','Devino membru'],['diaspora','Diaspora'],['proiecte','Proiecte'],['stiri','Știri'],['parteneri','Parteneri'],['contacte','Contacte']];
  var h='';
  h+='<div class="util band-full"><div class="wrap"><span>'+esc(s.nameEn)+' · Republica Moldova</span><span>'+email+'</span></div></div>';
  h+='<header class="top band-full"><div class="tri" style="margin-inline:calc(-1*max(16px,env(safe-area-inset-left,0px)))"><i></i><i></i><i></i></div><div class="wrap bar"><a class="brand" href="#acasa"><img src="'+logo+'" alt="Sigla asociației"><span>'+esc(s.name)+'</span></a><button class="menu" id="menuBtn" aria-expanded="false" aria-controls="nav">Meniu</button><nav id="nav" aria-label="Meniu principal"><ul>'
    +nav.map(function(n){return '<li><a href="#'+n[0]+'">'+n[1]+'</a></li>'}).join('')+'<li><a class="cta" href="#doneaza">Donează</a></li></ul></nav></div></header>';
  h+='<main>';
  // 1 acasa
  h+='<div class="hero band-full" id="acasa"><div class="wrap"><div><h1>'+esc(s.motto)+'</h1><p class="lead">'+esc(D.hero.lead)+'</p><div class="actions"><a class="btn red" href="#devino-membru">Devino membru</a><a class="btn yel" href="#doneaza">Donează</a><a class="btn ghost" href="#despre-noi">Despre noi</a></div></div><div class="ring"><img src="'+logo+'" alt="Sigla: un călăreț pe cal, înconjurat de ornamente tradiționale și frunze de viță-de-vie"></div></div></div>';
  h+='<div class="wrap"><div class="stats" aria-label="Asociația în cifre">'+(D.stats||[]).map(function(x){return '<div class="stat"><small>'+esc(x.label)+'</small><b>'+esc(x.value||'—')+'</b><span>'+esc(x.note)+'</span></div>'}).join('')+'</div></div>';
  h+=sec('bun-venit','','<div class="welcome"><div class="rich"><h2>'+esc(D.welcome.title)+'</h2>'+paras(D.welcome.text)+'</div><div class="mv"><article><h3>Misiunea</h3><p>'+esc(D.mission)+'</p></article><article><h3>Viziunea</h3><p>'+esc(D.vision)+'</p></article></div></div>');
  // ADN
  var a=D.adn||[];
  if(S.adnIdx>=a.length)S.adnIdx=0;
  h+=sec('adn','alt',sh('ADN-ul CĂLĂRAȘI','Fiecare literă din numele orașului ne amintește ce ne unește.')+'<div class="adn-row" role="tablist" aria-label="ADN-ul CĂLĂRAȘI">'+a.map(function(x,k){return '<button type="button" role="tab" data-k="'+k+'" class="c'+(k%3)+(k===S.adnIdx?' on':'')+'" aria-selected="'+(k===S.adnIdx)+'">'+esc(x.letter)+'</button>'}).join('')+'</div><div class="adn-panel" id="adnPanel" role="tabpanel">'+adnPanel()+'</div>');
  // join
  h+='<div class="join band-full"><div class="wrap"><div><h2>'+esc(D.join.title)+'</h2><p>'+esc(D.join.text)+'</p></div><div class="actions"><a class="btn yel" href="#devino-membru">Devino membru</a><a class="btn ghost" href="#doneaza">Donează</a></div></div></div>';
  // recent news
  var rn=sortedNews().slice(0,3);
  h+=sec('recente','',sh('Noutăți și evenimente recente')+(rn.length?'<div class="grid">'+rn.map(newsCard).join('')+'</div><div class="actions"><a class="btn out" href="#stiri">Toate știrile</a></div>':empty('Primul anunț urmează','Noutățile și evenimentele Asociației vor apărea aici.')));
  // despre noi
  var ab=D.about;
  h+=sec('despre-noi','alt',sh('Despre noi')+'<div class="two"><div class="rich">'+paras(ab.intro)+'<h3 class="sub" style="margin-top:12px">Asociația a fost creată pentru</h3>'+checks(ab.purposes)+'</div><div><h3 class="sub">Valorile organizației</h3><div style="display:grid;gap:14px">'+(ab.values||[]).map(function(v){return '<div class="card"><h3>'+esc(v.title)+'</h3><p>'+esc(v.text)+'</p></div>'}).join('')+'</div></div></div>');
  // echipa
  h+=sec('echipa','',sh('Echipa')+'<div class="team">'+(D.team||[]).map(function(p){
    return '<div class="person"><div class="avatar" '+(p.photo?'':'aria-hidden="true"')+'>'+(p.photo?pic(p.photo,'',p.name):esc(initials(p.name)))+'</div><div><h3>'+esc(p.name)+'</h3><div class="role">'+esc(p.role)+'</div>'+(p.text?'<p>'+esc(p.text)+'</p>':'')
      +((p.members||[]).filter(Boolean).length?'<div class="names">'+p.members.filter(Boolean).map(function(n){return '<span>'+esc(n)+'</span>'}).join('')+'</div>':'')+'</div></div>'}).join('')+'</div>');
  // membru
  h+=sec('devino-membru','alt',sh('Devino membru')+'<div class="two"><div><h3 class="sub">Ca membru al Asociației</h3>'+checks(m.benefits)+'</div><div><h3 class="sub">Responsabilitățile membrilor</h3>'+checks(m.duties)+'</div></div>'
    +'<div style="margin-top:48px;display:grid;gap:16px"><h3 class="sub">Cum te poți implica?</h3><ul class="chips">'+(m.involve||[]).filter(Boolean).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>'
    +'<div class="card membership-card" style="margin-top:36px"><h3>Formular de aderare</h3><p>Completează datele și te vom contacta.</p><form id="membershipForm" class="membership-form"><div class="two"><div class="fld"><label for="memberFirstName">Prenume *</label><input id="memberFirstName" name="firstName" required maxlength="80"></div><div class="fld"><label for="memberLastName">Nume *</label><input id="memberLastName" name="lastName" required maxlength="80"></div></div><div class="two"><div class="fld"><label for="memberPhone">Număr de telefon *</label><input id="memberPhone" name="phone" type="tel" required maxlength="30"></div><div class="fld"><label for="memberEmail">Adresa de e-mail *</label><input id="memberEmail" name="email" type="email" required maxlength="120"></div></div><div class="two"><div class="fld"><label for="memberBirth">Data nașterii</label><input id="memberBirth" name="birthDate" type="date"></div><div class="fld"><label for="memberLocality">Localitatea *</label><input id="memberLocality" name="locality" required maxlength="120"></div></div><div class="fld"><label for="memberAddress">Adresa</label><input id="memberAddress" name="address" maxlength="180"></div><div class="fld"><label for="memberMotivation">De ce vrei să devii membru?</label><textarea id="memberMotivation" name="motivation" maxlength="1500"></textarea></div><label class="consent"><input type="checkbox" name="consent" required><span>Sunt de acord ca datele mele să fie folosite pentru a mă contacta în legătură cu aderarea.</span></label><p id="membershipStatus" class="membership-status" role="status"></p><button class="btn red" type="submit">Trimite cererea</button></form></div>');
  // diaspora
  var di=D.diaspora;
  h+=sec('diaspora','',sh('Diaspora călărășeană',di.intro)
    +'<h3 class="sub" style="margin-bottom:16px">Harta diasporei</h3>'+((di.countries||[]).length?'<div class="grid">'+di.countries.map(function(x){return '<div class="card"><h3>'+esc(x.country)+'</h3>'+(x.cities?'<p>'+esc(x.cities)+'</p>':'')+(x.count?'<div class="meta">'+esc(x.count)+' călărășeni</div>':'')+'</div>'}).join('')+'</div>':empty('Țările și orașele vor fi marcate aici','Locurile unde trăiesc călărășenii se adaugă pe măsură ce membrii se înscriu.'))
    +'<h3 class="sub" style="margin:44px 0 16px">Ambasadorii Călărașiului</h3>'+((di.ambassadors||[]).length?'<div class="grid">'+di.ambassadors.map(function(x){return '<div class="card">'+pic(x.photo,'ph sq',x.name)+'<h3>'+esc(x.name)+'</h3><div class="meta">'+esc(x.place)+'</div><p>'+esc(x.role)+'</p></div>'}).join('')+'</div>':empty('Ambasadorii urmează','Membrii activi, profesioniștii și experții din diaspora vor fi prezentați aici.')));
  // proiecte
  var pr=D.projects,act=(pr.list||[]).filter(function(p){return p.status!=='Finalizat'}),fin=(pr.list||[]).filter(function(p){return p.status==='Finalizat'});
  function pc(p){return '<div class="card">'+pic(p.image,'ph',p.title)+'<h3>'+esc(p.title)+'</h3>'+(p.period?'<div class="meta">'+esc(p.period)+'</div>':'')+(p.text?'<p>'+esc(p.text)+'</p>':'')+'</div>'}
  h+=sec('proiecte','alt',sh('Proiecte')+'<div class="cols"><div><h3>Proiecte în desfășurare</h3>'+(act.length?act.map(pc).join(''):empty('Niciun proiect încă','Inițiativele active vor fi listate aici.'))+'</div><div><h3>Proiecte finalizate</h3>'+(fin.length?fin.map(pc).join(''):empty('Niciun proiect încă','Rezultatele proiectelor încheiate vor fi publicate aici.'))+'</div></div>'
    +'<div class="card" style="margin-top:28px"><h3>'+esc(pr.fund.title)+'</h3>'+(pr.fund.text?paras(pr.fund.text):'<p>Detaliile fondului vor fi adăugate în curând.</p>')+'</div>');
  // stiri
  h+=sec('stiri','',sh('Știri și evenimente')+'<div class="chips filter" id="newsChips">'+['Toate'].concat(CATS).map(function(c){return '<button type="button" data-c="'+esc(c)+'" class="'+(c===S.newsFilter?'on':'')+'">'+esc(c)+'</button>'}).join('')+'</div><div id="newsBox">'+newsList(S.newsFilter)+'</div>');
  // galerie
  var gl=(D.gallery||[]).filter(function(g){return g.image});
  if(gl.length)h+=sec('galerie','',sh('Galerie foto')+'<div class="gal">'+gl.map(function(g){var u=imgSrc(g.image);return '<figure><a href="'+esc(u)+'" target="_blank" rel="noopener"><img src="'+esc(u)+'" alt="'+esc(g.caption||'Fotografie')+'" loading="lazy"></a>'+(g.caption?'<figcaption>'+esc(g.caption)+'</figcaption>':'')+'</figure>'}).join('')+'</div>');
  // parteneri
  h+=sec('parteneri','alt',sh('Instituții partenere')+((D.partners||[]).length?'<div class="grid">'+D.partners.map(function(p){var u=url(p.url);return '<div class="card">'+pic(p.image,'plogo',p.name)+'<h3>'+(u?'<a class="t" href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(p.name)+'</a>':esc(p.name))+'</h3>'+(p.text?'<p>'+esc(p.text)+'</p>':'')+'</div>'}).join('')+'</div>':empty('Partenerii urmează','Instituțiile care colaborează cu Asociația vor fi prezentate aici.')));
  // doneaza
  var dn=D.donate;
  h+=sec('doneaza','',sh('Donează',dn.intro)+'<div class="two"><div><h3 class="sub">Cum poți dona</h3><div style="display:grid;gap:14px">'+(dn.methods||[]).map(function(x){var u=url(x.url);return '<div class="card"><h3>'+esc(x.title)+'</h3>'+(x.detail?'<p style="white-space:pre-line">'+esc(x.detail)+'</p>':'<p>Detaliile vor fi publicate în curând.</p>')+(u?'<div class="actions" style="margin-top:6px"><a class="btn red" href="'+esc(u)+'" target="_blank" rel="noopener">Donează</a></div>':'')+'</div>'}).join('')+'</div></div><div><h3 class="sub">Pentru ce colectăm fonduri?</h3>'+checks(dn.purposes)+'</div></div>');
  // contacte
  function link(label,v,name){var u=url(v);return '<div class="row"><b>'+label+'</b>'+(u?'<a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(name)+'</a>':'<span>'+esc(name)+'</span>')+'</div>'}
  h+=sec('contacte','alt',sh('Contacte')+'<div class="rows"><div class="row"><b>E-mail</b><span id="mail">'+email+'</span><button class="copy" id="copyMail" type="button">Copiază</button></div>'
    +(c.phone?'<div class="row"><b>Telefon</b><span>'+esc(c.phone)+'</span></div>':'')+(c.address?'<div class="row"><b>Adresa</b><span>'+esc(c.address)+'</span></div>':'')
    +link('Facebook',c.facebookUrl,c.facebookName||s.name)+link('Instagram',c.instagramUrl,c.instagramName||s.name)+'</div>');
  h+='</main>';
  h+='<footer class="foot band-full"><div class="wrap"><div><img src="'+logo+'" alt=""><p class="m">'+esc(s.motto)+'</p><p>'+esc(s.name)+'</p><p>'+esc(s.domain)+'</p></div><div><h4>Navigare</h4><ul>'+nav.slice(0,5).map(function(n){return '<li><a href="#'+n[0]+'">'+n[1]+'</a></li>'}).join('')+'</ul></div><div><h4>Mai mult</h4><ul>'+nav.slice(5).map(function(n){return '<li><a href="#'+n[0]+'">'+n[1]+'</a></li>'}).join('')+(gl.length?'<li><a href="#galerie">Galerie foto</a></li>':'')+'<li><a href="#doneaza">Donează</a></li></ul></div></div><div class="wrap legal"><span>© '+new Date().getFullYear()+' '+esc(s.name)+'</span><a href="#admin">Administrare</a></div><div class="tri" style="margin-inline:calc(-1*max(16px,env(safe-area-inset-left,0px)))"><i></i><i></i><i></i></div></footer>';
  return h;
}
function adnPanel(){var x=(S.data.adn||[])[S.adnIdx];return x?'<h3>'+esc(x.word)+'</h3><p>'+esc(x.text)+'</p>':''}

function bindSite(root){
  root.addEventListener('click',function(e){
    var link=e.target.closest('a[href^="#devino-membru"]');
    if(!link)return;
    var section=document.getElementById('devino-membru');
    if(section){
      e.preventDefault();
      section.scrollIntoView({behavior:'smooth',block:'start'});
      history.replaceState(null,'','#devino-membru');
      var first=document.getElementById('memberFirstName');
      if(first)setTimeout(function(){first.focus({preventScroll:true})},450);
    }
  });
  root.addEventListener('submit',async function(e){
    if(e.target.id!=='membershipForm')return;
    e.preventDefault();
    var form=e.target,status=$('#membershipStatus',root),button=form.querySelector('button[type=submit]');
    if(!DB.live){status.textContent='Cererea nu poate fi trimisă momentan.';status.className='membership-status error';return}
    var fd=new FormData(form),g=function(k){return String(fd.get(k)||'').trim()};
    var data={firstName:g('firstName'),lastName:g('lastName'),phone:g('phone'),email:g('email'),birthDate:g('birthDate'),locality:g('locality'),address:g('address'),motivation:g('motivation')};
    button.disabled=true;status.textContent='Se trimite cererea…';status.className='membership-status';
    try{
      await DB.addApplication(data);
      form.reset();
      status.textContent='Cererea a fost trimisă. Îți vom răspunde în curând.';
      status.className='membership-status success';
    }catch(err){
      console.error(err);
      var message=err&&err.code==='permission-denied'
        ?'Cererea este blocată de regulile Firestore. Verifică că regulile au fost publicate.'
        :err&&err.code==='unavailable'
          ?'Nu există conexiune la Firestore. Verifică internetul.'
          :'Cererea nu a putut fi trimisă: '+esc(err&&err.message?err.message:'eroare necunoscută');
      status.textContent=message;
      status.className='membership-status error';
    }finally{
      button.disabled=false;
    }
  });
  root.addEventListener('click',function(e){
    var t=e.target.closest('button,a');if(!t)return;
    if(t.id==='menuBtn'){var n=$('#nav',root),o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);return}
    if(t.tagName==='A'&&t.closest('#nav')){$('#nav',root).classList.remove('open');$('#menuBtn',root).setAttribute('aria-expanded','false')}
    if(t.closest('.adn-row')&&t.dataset.k!=null){S.adnIdx=+t.dataset.k;root.querySelectorAll('.adn-row button').forEach(function(b){b.classList.toggle('on',+b.dataset.k===S.adnIdx);b.setAttribute('aria-selected',+b.dataset.k===S.adnIdx)});$('#adnPanel',root).innerHTML=adnPanel();return}
    if(t.closest('#newsChips')){S.newsFilter=t.dataset.c;root.querySelectorAll('#newsChips button').forEach(function(b){b.classList.toggle('on',b.dataset.c===S.newsFilter)});$('#newsBox',root).innerHTML=newsList(S.newsFilter);return}
    if(t.id==='copyMail'){
      var txt=S.data.contacts.email;
      var sel=function(){var r=document.createRange();r.selectNodeContents($('#mail',root));var g=getSelection();g.removeAllRanges();g.addRange(r);t.textContent='Selectat'};
      try{navigator.clipboard.writeText(txt).then(function(){t.textContent='Copiat'},sel)}catch(err){sel()}
    }
  });
}

/* ---------------- navigare ---------------- */
function showSite(){
  var s=$('#site');
  if(S.mode!=='site'){s.innerHTML=siteHTML();S.mode='site'}
  s.hidden=false;$('#admin').hidden=true;
  DB.watchSite(function(d){S.data=d;if(S.mode==='site')$('#site').innerHTML=siteHTML()});
  var id=location.hash.slice(1),el=id&&document.getElementById(id);
  if(el)el.scrollIntoView();else window.scrollTo(0,0);
}
function showAdmin(){
  $('#site').hidden=true;$('#admin').hidden=false;S.mode='admin';window.scrollTo(0,0);
  if(App.admin)App.admin.show();
}
function route(){location.hash==='#admin'?showAdmin():showSite()}

/* API comun, folosit de admin.js */
var App=window.App={S:S,$:$,esc:esc,imgSrc:imgSrc,siteHTML:siteHTML,CATS:CATS,STATUS:STATUS,LOGO:'assets/logo.jpg',admin:null};

function boot(){
  bindSite($('#site'));
  DB.onAuth(function(user){
    if(S.mode==='admin'&&App.admin)App.admin.show();
  });
  window.addEventListener('hashchange',route);
  route();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
