/* ==========================================================
   Panou de administrare – autentificare, editor de conținut, cereri
   (se încarcă după app.js și se înregistrează în App.admin)
   ========================================================== */
(function(){
'use strict';
var A=window.App,S=A.S,$=A.$,esc=A.esc,imgSrc=A.imgSrc,CATS=A.CATS,STATUS=A.STATUS;

function h(tag,attrs){
  var e=document.createElement(tag),k,v,i,c;
  for(k in (attrs||{})){v=attrs[k];if(k==='class')e.className=v;else if(k.indexOf('on')===0)e.addEventListener(k.slice(2),v);else if(v!==false&&v!=null)e.setAttribute(k,v===true?'':v)}
  for(i=2;i<arguments.length;i++){c=arguments[i];if(c==null||c===false)continue;if(Array.isArray(c))c.forEach(function(x){if(x)e.append(x)});else e.append(c.nodeType?c:document.createTextNode(c))}
  return e;
}
var uid=0;
/* append care ignoră null/false (append(null) scrie textul „null”) */
function add(el){for(var i=1;i<arguments.length;i++){var c=arguments[i];if(c!=null&&c!==false)el.append(c)}return el}
function touch(){setStatus('Modificări nepublicate',true);var b=$('#pubBtn');if(b)b.disabled=false}
function setStatus(t,warn){var s=$('#admStatus');if(s){s.textContent=t;s.className='st'+(warn?' warn':'')}}

function imageField(obj,f){
  var id='f'+(++uid),box=h('div',{class:'fld'}),prev=h('div',{class:'imgf'}),msg=h('small',{},'');
  function draw(){
    prev.textContent='';
    var u=imgSrc(obj[f.k]);
    if(u)prev.append(h('img',{src:u,alt:''}));
    var inp=h('input',{id:id,type:'url',placeholder:'https://exemplu.md/imagine.jpg',value:obj[f.k]||'',oninput:function(e){obj[f.k]=e.target.value.trim();drawPreview();touch()}});
    prev.append(inp);
    if(u)prev.append(h('button',{type:'button',class:'mini del',onclick:function(){obj[f.k]='';draw();touch()}},'Elimină'));
  }
  function drawPreview(){
    var imgs=prev.querySelectorAll('img');
    imgs.forEach(function(img){img.remove()});
    var u=imgSrc(obj[f.k]);
    if(u)prev.prepend(h('img',{src:u,alt:''}));
  }
  draw();
  add(box,h('div',{class:'lb'},f.l),prev,msg,f.hint?h('small',{},f.hint):null);
  return box;
}
function field(obj,f){
  if(f.t==='image')return imageField(obj,f);
  var id='f'+(++uid),ctl;
  if(f.t==='select'){
    if(obj[f.k]==null)obj[f.k]=f.opts[0];
    ctl=h('select',{id:id,onchange:function(e){obj[f.k]=e.target.value;touch()}},f.opts.map(function(o){return h('option',{value:o,selected:o===obj[f.k]},o)}));
  }else if(f.t==='area'){
    ctl=h('textarea',{id:id,oninput:function(e){obj[f.k]=e.target.value;touch()}});ctl.value=obj[f.k]||'';
  }else{
    ctl=h('input',{id:id,type:f.t==='date'?'date':'text',oninput:function(e){obj[f.k]=e.target.value;touch()}});ctl.value=obj[f.k]||'';
  }
  return h('div',{class:'fld'},h('label',{for:id},f.l),ctl,f.hint?h('small',{},f.hint):null);
}

function strings(obj,f){
  var box=h('div',{class:'fld'}),list=h('div',{style:'display:grid;gap:8px'});
  if(!Array.isArray(obj[f.k]))obj[f.k]=[];
  function draw(){
    list.textContent='';
    obj[f.k].forEach(function(v,i){
      var inp=h('input',{type:'text','aria-label':f.l+' '+(i+1),oninput:function(e){obj[f.k][i]=e.target.value;touch()}});inp.value=v;
      list.append(h('div',{class:'strrow'},inp,h('button',{type:'button',class:'mini del',onclick:function(){obj[f.k].splice(i,1);draw();touch()}},'Șterge')));
    });
  }
  draw();
  add(box,h('div',{class:'lb'},f.l),f.hint?h('small',{},f.hint):null,list,h('button',{type:'button',class:'mini add',onclick:function(){obj[f.k].push('');draw();touch();var ins=list.querySelectorAll('input');ins[ins.length-1].focus()}},'+ Adaugă'));
  return box;
}

function items(obj,f){
  var box=h('div',{class:'fld'}),list=h('div',{style:'display:grid;gap:14px'});
  if(!Array.isArray(obj[f.k]))obj[f.k]=[];
  function draw(){
    list.textContent='';
    obj[f.k].forEach(function(it,i){
      var arr=obj[f.k],delBtn;
      delBtn=h('button',{type:'button',class:'mini del',onclick:function(){
        if(!delBtn.classList.contains('arm')){delBtn.classList.add('arm');delBtn.textContent='Sigur? Apasă din nou';setTimeout(function(){delBtn.classList.remove('arm');delBtn.textContent='Șterge'},3000);return}
        arr.splice(i,1);draw();touch();
      }},'Șterge');
      var body=h('div',{style:'display:grid;gap:14px'});fields(it,f.item,body);
      list.append(h('div',{class:'item'},h('div',{class:'item-h'},h('b',{},(f.title&&it[f.title])||((f.noun||'Element')+' '+(i+1))),
        i>0?h('button',{type:'button',class:'mini','aria-label':'Mută mai sus',onclick:function(){arr.splice(i-1,0,arr.splice(i,1)[0]);draw();touch()}},'↑'):null,
        i<arr.length-1?h('button',{type:'button',class:'mini','aria-label':'Mută mai jos',onclick:function(){arr.splice(i+1,0,arr.splice(i,1)[0]);draw();touch()}},'↓'):null,delBtn),body));
    });
    if(!obj[f.k].length)list.append(h('div',{class:'note'},'Nu există încă niciun element. Apasă „Adaugă”.'));
  }
  draw();
  add(box,f.l?h('div',{class:'lb'},f.l):null,f.hint?h('small',{},f.hint):null,list,h('button',{type:'button',class:'mini add',onclick:function(){obj[f.k].push(JSON.parse(JSON.stringify(f.blank||{})));draw();touch();var its=list.querySelectorAll('.item');its[its.length-1].scrollIntoView({block:'center'})}},'+ Adaugă '+(f.noun||'element').toLowerCase()));
  return box;
}

function fields(obj,fs,root){
  fs.forEach(function(f){
    if(f.t==='group'){if(!obj[f.k])obj[f.k]={};var g=h('fieldset',{class:'grp'},h('legend',{},f.l));fields(obj[f.k],f.fields,g);root.append(g)}
    else if(f.t==='strings')root.append(strings(obj,f));
    else if(f.t==='items')root.append(items(obj,f));
    else root.append(field(obj,f));
  });
}


var SCHEMA=[
 {id:'general',label:'Setări generale',hint:'Datele de bază ale organizației. Modificările apar pe site după ce apeși „Publică modificările”.',fields:[
  {t:'group',k:'site',l:'Organizația',fields:[{t:'text',k:'name',l:'Denumire'},{t:'text',k:'nameEn',l:'Denumire în engleză'},{t:'text',k:'motto',l:'Motto'},{t:'text',k:'domain',l:'Adresa site-ului'}]}]},
 {id:'home',label:'Pagina principală',hint:'Textele din partea de sus a site-ului, cifrele, misiunea și viziunea.',fields:[
  {t:'group',k:'hero',l:'Text sub motto',fields:[{t:'area',k:'lead',l:'Prezentare scurtă'}]},
  {t:'group',k:'welcome',l:'Mesaj de bun venit',fields:[{t:'text',k:'title',l:'Titlu'},{t:'area',k:'text',l:'Text',hint:'Un rând nou începe un paragraf nou.'}]},
  {t:'items',k:'stats',l:'Cifre afișate pe prima pagină',noun:'Cifră',title:'label',blank:{label:'',value:'',note:''},item:[{t:'text',k:'label',l:'Titlu'},{t:'text',k:'value',l:'Valoare',hint:'De exemplu 120 sau 15+'},{t:'text',k:'note',l:'Descriere'}]},
  {t:'area',k:'mission',l:'Misiunea'},{t:'area',k:'vision',l:'Viziunea'},
  {t:'group',k:'join',l:'Apel la implicare',fields:[{t:'text',k:'title',l:'Titlu'},{t:'area',k:'text',l:'Text'}]}]},
 {id:'adn',label:'ADN-ul CĂLĂRAȘI',hint:'Literele din numele orașului și semnificația lor.',fields:[
  {t:'items',k:'adn',noun:'Literă',title:'word',blank:{letter:'',word:'',text:''},item:[{t:'text',k:'letter',l:'Literă'},{t:'text',k:'word',l:'Cuvânt'},{t:'area',k:'text',l:'Semnificație'}]}]},
 {id:'about',label:'Despre noi',hint:'Cine suntem, scopurile și valorile.',fields:[
  {t:'group',k:'about',l:'Despre Asociație',fields:[{t:'area',k:'intro',l:'Cine suntem',hint:'Un rând nou începe un paragraf nou.'},{t:'strings',k:'purposes',l:'Asociația a fost creată pentru'},
   {t:'items',k:'values',l:'Valorile organizației',noun:'Valoare',title:'title',blank:{title:'',text:''},item:[{t:'text',k:'title',l:'Valoare'},{t:'area',k:'text',l:'Descriere'}]}]}]},
 {id:'team',label:'Echipa',hint:'Membrii echipei, în ordinea în care apar pe site.',fields:[
  {t:'items',k:'team',noun:'Persoană',title:'name',blank:{name:'',role:'',text:'',members:[]},item:[{t:'image',k:'photo',l:'Fotografie (opțional)'},{t:'text',k:'name',l:'Nume'},{t:'text',k:'role',l:'Funcție'},{t:'area',k:'text',l:'Descriere'},{t:'strings',k:'members',l:'Membri (pentru Consiliu)',hint:'Lasă gol pentru o singură persoană.'}]}]},
 {id:'membership',label:'Devino membru',hint:'Beneficii, responsabilități și formularul de aderare.',fields:[
  {t:'group',k:'membership',l:'Aderare',fields:[{t:'strings',k:'benefits',l:'Ca membru al Asociației'},{t:'strings',k:'duties',l:'Responsabilitățile membrilor'},{t:'strings',k:'involve',l:'Cum te poți implica'}]}]},
 {id:'membershipApplications',label:'Cereri de aderare',hint:'Cereri trimise prin formularul „Devino membru”.',fields:[]},
 {id:'diaspora',label:'Diaspora',hint:'Țările și orașele unde locuiesc călărășeni și ambasadorii Călărașiului.',fields:[
  {t:'group',k:'diaspora',l:'Diaspora călărășeană',fields:[{t:'area',k:'intro',l:'Text de prezentare'},
   {t:'items',k:'countries',l:'Harta diasporei',noun:'Țară',title:'country',blank:{country:'',cities:'',count:''},item:[{t:'text',k:'country',l:'Țara'},{t:'text',k:'cities',l:'Orașe'},{t:'text',k:'count',l:'Număr de călărășeni'}]},
   {t:'items',k:'ambassadors',l:'Ambasadorii Călărașiului',noun:'Ambasador',title:'name',blank:{name:'',place:'',role:''},item:[{t:'image',k:'photo',l:'Fotografie (opțional)'},{t:'text',k:'name',l:'Nume'},{t:'text',k:'place',l:'Țara și orașul'},{t:'text',k:'role',l:'Profesie sau domeniu'}]}]}]},
 {id:'projects',label:'Proiecte',hint:'Proiectele în desfășurare și cele finalizate se separă automat după stare.',fields:[
  {t:'group',k:'projects',l:'Proiecte',fields:[{t:'items',k:'list',l:'Lista proiectelor',noun:'Proiect',title:'title',blank:{title:'',status:'În desfășurare',period:'',text:''},item:[{t:'image',k:'image',l:'Fotografie (opțional)'},{t:'text',k:'title',l:'Titlu'},{t:'select',k:'status',l:'Stare',opts:STATUS},{t:'text',k:'period',l:'Perioadă'},{t:'area',k:'text',l:'Descriere'}]},
   {t:'group',k:'fund',l:'Fond de cofinanțare',fields:[{t:'text',k:'title',l:'Titlu'},{t:'area',k:'text',l:'Text'}]}]}]},
 {id:'news',label:'Știri și evenimente',hint:'Adaugă anunțuri și evenimente. Cele mai noi apar primele, iar ultimele trei se văd și pe prima pagină.',fields:[
  {t:'items',k:'news',noun:'Știre',title:'title',blank:{title:'',date:'',category:CATS[0],text:''},item:[{t:'image',k:'image',l:'Fotografie (opțional)'},{t:'text',k:'title',l:'Titlu'},{t:'date',k:'date',l:'Data'},{t:'select',k:'category',l:'Categorie',opts:CATS},{t:'area',k:'text',l:'Text'}]}]},
 {id:'gallery',label:'Galerie foto',hint:'Fotografii de la evenimente. Apar într-o secțiune separată, dacă există cel puțin una.',fields:[
  {t:'items',k:'gallery',noun:'Fotografie',title:'caption',blank:{image:'',caption:''},item:[{t:'image',k:'image',l:'Fotografie'},{t:'text',k:'caption',l:'Descriere'}]}]},
 {id:'partners',label:'Parteneri',hint:'Instituțiile partenere. Linkul este opțional.',fields:[
  {t:'items',k:'partners',noun:'Partener',title:'name',blank:{name:'',text:'',url:''},item:[{t:'image',k:'image',l:'Sigla (opțional)'},{t:'text',k:'name',l:'Denumire'},{t:'area',k:'text',l:'Descriere'},{t:'text',k:'url',l:'Link către site'}]}]},
 {id:'donate',label:'Donații',hint:'Metodele de donație și destinația fondurilor.',fields:[
  {t:'group',k:'donate',l:'Donează',fields:[{t:'area',k:'intro',l:'Text de prezentare'},
   {t:'items',k:'methods',l:'Metode de donație',noun:'Metodă',title:'title',blank:{title:'',detail:'',url:''},item:[{t:'text',k:'title',l:'Denumire'},{t:'area',k:'detail',l:'Detalii',hint:'De exemplu IBAN, banca, scopul plății.'},{t:'text',k:'url',l:'Link de plată (opțional)'}]},
   {t:'strings',k:'purposes',l:'Pentru ce colectăm fonduri'}]}]},
 {id:'contacts',label:'Contacte',hint:'Datele de contact afișate în pagina Contacte și în subsol.',fields:[
  {t:'group',k:'contacts',l:'Contacte',fields:[{t:'text',k:'email',l:'E-mail'},{t:'text',k:'phone',l:'Telefon (opțional)'},{t:'text',k:'address',l:'Adresa (opțional)'},{t:'text',k:'facebookName',l:'Nume pagină Facebook'},{t:'text',k:'facebookUrl',l:'Link Facebook'},{t:'text',k:'instagramName',l:'Nume cont Instagram'},{t:'text',k:'instagramUrl',l:'Link Instagram'}]}]}
];


function adminShell(){
  var root=$('#admin');root.textContent='';
  var top=h('div',{class:'adm-top band-full'},h('div',{class:'wrap'},
    h('img',{src:App.LOGO,alt:''}),h('h1',{},'Administrare site'),h('span',{id:'admStatus',class:'st'},''),
    h('a',{class:'btn ghost',href:'#acasa',style:'padding:9px 16px'},'Vezi site-ul'),
    h('button',{type:'button',class:'btn ghost',style:'padding:9px 16px',onclick:DB.signOut},'Ieși'),
    h('button',{type:'button',id:'pubBtn',class:'btn yel',style:'padding:9px 18px',disabled:true,onclick:save},'Publică modificările')));
  var nav=h('div',{class:'adm-nav',role:'tablist'}),sel=h('select',{class:'adm-sel','aria-label':'Secțiune',onchange:function(e){go(e.target.value)}});
  SCHEMA.forEach(function(s){
    nav.append(h('button',{type:'button','data-id':s.id,class:s.id===S.curTab?'on':'',onclick:function(){go(s.id)}},s.label));
    sel.append(h('option',{value:s.id,selected:s.id===S.curTab},s.label));
  });
  var main=h('div',{class:'adm-main',id:'admMain'});
  root.append(top,h('div',{class:'wrap adm-body'},h('div',{},nav,sel),main));
  drawTab();
  try{var ok=sessionStorage.getItem('adm-ok');if(ok){sessionStorage.removeItem('adm-ok');setStatus('Publicat '+ok)}}catch(e){}
  checkDraft();
}
function go(id){S.curTab=id;try{sessionStorage.setItem('adm-tab',id)}catch(e){}document.querySelectorAll('.adm-nav button').forEach(function(b){b.classList.toggle('on',b.dataset.id===id)});var s=$('.adm-sel');if(s)s.value=id;drawTab();window.scrollTo(0,0)}
function drawTab(){
  var s=SCHEMA.filter(function(x){return x.id===S.curTab})[0]||SCHEMA[0],m=$('#admMain');m.textContent='';
  m.append(h('h2',{},s.label),h('p',{class:'hint'},s.hint));
  if(S.curTab==='membershipApplications'){drawMembershipApplications(m);return}
  fields(S.data,s.fields,m);
}
function checkDraft(){
  try{
    var d=sessionStorage.getItem('adm-draft');if(!d)return;
    if(d===JSON.stringify(S.data)){sessionStorage.removeItem('adm-draft');return}
    var m=$('#admMain');
    m.prepend(h('div',{class:'note'},'Ai o ciornă nepublicată dintr-o sesiune anterioară. ',
      h('button',{type:'button',class:'mini',onclick:function(){S.data=DB.normalize(JSON.parse(d));sessionStorage.removeItem('adm-draft');adminShell();touch()}},'Restaurează'),' ',
      h('button',{type:'button',class:'mini',onclick:function(){sessionStorage.removeItem('adm-draft');adminShell()}},'Șterge ciorna')));
  }catch(e){}
}

function drawMembershipApplications(root){
  root.querySelectorAll('.application-list').forEach(function(el){el.remove()});
  var list=h('div',{class:'application-list'});
  root.append(list);
  if(!DB.live){list.append(h('div',{class:'note'},'Firestore nu este disponibil.'));return}
  list.append(h('div',{class:'note'},'Se încarcă cererile…'));
  DB.listApplications().then(function(apps){
    list.textContent='';
    if(!apps.length){list.append(h('div',{class:'note'},'Nu există încă cereri de aderare.'));return}
    apps.forEach(function(d){
      var card=h('div',{class:'application-card'});
      var date=d.createdAt&&d.createdAt.toDate?d.createdAt.toDate().toLocaleString('ro-RO'):'';
      var status=d.status||'new';
      var statusText=status==='accepted'?'Acceptată':status==='declined'?'Respinsă':status==='review'?'În analiză':'Nouă';
      add(card,
        h('h3',{},esc(d.firstName+' '+d.lastName)),
        h('div',{class:'meta'},'Telefon: '+esc(d.phone)+' · E-mail: '+esc(d.email)+(date?' · Trimisa la '+esc(date):'')),
        h('p',{},'Localitate: '+esc(d.locality)+(d.address?' · Adresa: '+esc(d.address):'')),
        d.birthDate?h('p',{},'Data nașterii: '+esc(d.birthDate)):null,
        d.motivation?h('p',{},esc(d.motivation)):null,
        h('div',{class:'actions'},h('span',{class:'st'},statusText))
      );
      ['review','accepted','declined'].forEach(function(next){
        var label=next==='review'?'Marchează în analiză':next==='accepted'?'Acceptă':'Respinge';
        add(card,h('button',{type:'button',class:'mini',onclick:function(){
          DB.setApplicationStatus(d.id,next).then(function(){drawMembershipApplications(root)});
        }},label));
      });
      list.append(card);
    });
  }).catch(function(e){
    list.textContent='';
    list.append(h('div',{class:'note'},'Cererea nu poate fi încărcată. Verifică regulile Firestore. '+esc(e.message||'')));
  });
}

function save(){
  var b=$('#pubBtn');
  b.disabled=true;setStatus('Se publică…');
  if(!DB.live||!DB.user){b.disabled=false;setStatus('Autentifică-te pentru a publica.',true);return}
  DB.saveSite(S.data).then(function(){
    b.disabled=false;setStatus('Publicat');
  }).catch(function(e){
    b.disabled=false;
    setStatus(e&&e.code==='permission-denied'?'Nu ai permisiunea de administrare.':'Publicarea a eșuat. Verifică regulile Firebase.',true);
  });
}

function loginView(){
  var a=$('#admin');a.textContent='';
  var err=h('p',{style:'color:var(--red);margin:0'},'');
  var email=h('input',{type:'email',required:true,autocomplete:'username',placeholder:'admin@adb.md'});
  var password=h('input',{type:'password',required:true,autocomplete:'current-password',placeholder:'Parola'});
  var form=h('form',{class:'gate',onsubmit:function(e){
    e.preventDefault();
    if(!DB.live){err.textContent='Firebase nu este disponibil.';return}
    err.textContent='Se autentifică…';
    DB.signIn(email.value.trim(),password.value).catch(function(e){
      err.textContent=e&&e.code==='auth/invalid-credential'?'E-mail sau parolă incorecte.':'Autentificarea a eșuat. Verifică contul Firebase.';
    });
  }});
  form.append(h('h2',{},'Autentificare administrare'),h('p',{style:'color:var(--muted)'},'Autentifică-te pentru a modifica conținutul site-ului.'),h('div',{class:'fld',style:'width:min(100%,420px)'},h('label',{for:'adb-email'},'E-mail'),email),h('div',{class:'fld',style:'width:min(100%,420px)'},h('label',{for:'adb-password'},'Parolă'),password),err,h('button',{type:'submit',class:'btn red'},'Intră în panou'),h('a',{class:'mini',href:'#acasa'},'Înapoi la site'));
  a.append(form);
}

A.admin={show:function(){
  if(!DB.user){loginView();return}
  try{S.curTab=sessionStorage.getItem('adm-tab')||S.curTab}catch(e){}
  adminShell();
}};
})();
