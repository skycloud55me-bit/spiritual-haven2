// app.js — تحديث 2025: شريط جانبي فخم، بطاقات متجاوبة، تحميل فوري للأدعية/العبادات (30 عنصر)
(function(){
  "use strict";

  /* ---------- DOM elements ---------- */
  const openBtn = document.getElementById('openPanelBtn');
  const sidePanel = document.getElementById('sidePanel');
  const closeBtn = document.getElementById('closePanelBtn');
  const backdrop = document.getElementById('backdrop');
  const navItems = document.querySelectorAll('[data-page]');
  const phrases = ["السلام عليكم ورحمة الله 🌿","مرحبا بكِ في رحاب الإيمان 💫","زادكِ الله نورًا وطمأنينة 💛","اللهم اجعل هذا اليوم بركةً وسعادة 🌸","يا الله اجعل قلوبنا عامرة بذكرك 🤍"];

  const soundClick = document.getElementById('soundClick');
  const soundPop = document.getElementById('soundPop');
  const soundWhoosh = document.getElementById('soundWhoosh');
  function play(el){ try{ if(!el) return; el.currentTime = 0; el.play().catch(()=>{}); } catch(e){} }

  // open/close sidebar
  function openPanel(){
    sidePanel.classList.add('open');
    backdrop.classList.add('show');
    sidePanel.setAttribute('aria-hidden','false');
    play(soundClick);
    // random phrase
    const p = phrases[Math.floor(Math.random()*phrases.length)];
    const phrasesList = document.getElementById('phrasesList');
    if(phrasesList) phrasesList.textContent = p;
    setTimeout(()=> { if(phrasesList) phrasesList.textContent = ''; }, 3000);
  }
  function closePanel(){
    sidePanel.classList.remove('open');
    backdrop.classList.remove('show');
    sidePanel.setAttribute('aria-hidden','true');
    play(soundClick);
  }
  openBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);

  // nav click -> show page
  function showPage(id){
    document.querySelectorAll('.page-content').forEach(p=> p.classList.add('d-none'));
    const t = document.getElementById(id);
    if(t) t.classList.remove('d-none');
    play(soundWhoosh);
    // close panel on small screens for better UX
    if(window.innerWidth < 900) setTimeout(closePanel, 220);
  }
  navItems.forEach(b=> b.addEventListener('click', ()=> { showPage(b.getAttribute('data-page')); }));

  // default open dashboard
  showPage('dashboard');

  /* ---------- Dashboard stats (responsive) ---------- */
  let state = {
    prayerStreak: parseInt(localStorage.getItem('oasis_prayer'))||0,
    goodDeeds: parseInt(localStorage.getItem('oasis_deeds'))||0,
    quranPages: parseInt(localStorage.getItem('oasis_pages'))||0,
    gameScore: parseInt(localStorage.getItem('oasis_game'))||0
  };
  function refreshStats(){
    const p = document.getElementById('prayerStreak'); if(p) p.textContent = state.prayerStreak;
    const g = document.getElementById('goodDeeds'); if(g) g.textContent = state.goodDeeds;
    const q = document.getElementById('quranPages'); if(q) q.textContent = state.quranPages;
    const s = document.getElementById('gameScore'); if(s) s.textContent = state.gameScore;
  }
  refreshStats();

  /* ---------- Quran: unchanged loading logic (keeps original behaviour) ---------- */
  const surahList = document.getElementById('surahList');
  const surahTitle = document.getElementById('surahTitle');
  const surahMeta = document.getElementById('surahMeta');
  const surahText = document.getElementById('surahText');
  const searchInSurah = document.getElementById('searchInSurah');
  const searchResults = document.getElementById('searchResults');
  let currentAyahs = [], fontSize = 20, readerDark=false;

  function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  async function loadSurahIndex(){
    try{
      if(surahList) surahList.innerHTML = '<div class="text-muted">جاري تحميل فهرس السور...</div>';
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const json = await res.json();
      const list = json.data;
      if(surahList) {
        surahList.innerHTML = '';
        list.forEach(s=>{
          const btn = document.createElement('button');
          btn.className = 'surah-list-btn';
          btn.innerHTML = `<strong>${s.number}.</strong> ${s.name} <span class="text-muted" style="float:left">${s.ayahs} آية</span>`;
          btn.addEventListener('click', ()=> loadSurah(s.number, s.englishName + ' — ' + s.name, s.ayahs));
          surahList.appendChild(btn);
        });
      }
    }catch(err){
      if(surahList) surahList.innerHTML = '<div class="text-danger">فشل تحميل فهرس السور.</div>';
      console.error(err);
    }
  }

  async function loadSurah(num,title,ayahCount){
    try{
      if(surahTitle) surahTitle.textContent = 'تحميل السورة...';
      if(surahMeta) surahMeta.textContent = '';
      if(surahText) surahText.innerHTML = '';
      if(searchResults) searchResults.innerHTML = '';
      const res = await fetch('https://api.alquran.cloud/v1/surah/' + num + '/quran-uthmani');
      const json = await res.json();
      const ayahs = json.data.ayahs;
      currentAyahs = ayahs;
      const html = ayahs.map(a=>`<div style="margin-bottom:10px"><span style="font-weight:700;color:var(--gold)">${a.numberInSurah}.</span> <span>${escapeHtml(a.text)}</span></div>`).join('');
      if(surahText) surahText.innerHTML = html;
      if(surahTitle) surahTitle.textContent = title + ` (${ayahCount} آية)`;
      if(surahMeta) surahMeta.textContent = `السورة رقم ${num} — عدد الآيات: ${ayahCount}`;
      if(searchInSurah) searchInSurah.value='';
      if(surahText) surahText.style.fontSize = fontSize + 'px';
      const container = document.querySelector('.surah-container'); if(container) container.scrollTop=0;
      play(soundClick);
    }catch(e){
      if(surahTitle) surahTitle.textContent = 'فشل التحميل';
      if(surahText) surahText.textContent = 'حدثت مشكلة أثناء تحميل السورة.';
      console.error(e);
    }
  }
  if(surahList) loadSurahIndex();
  if(searchInSurah){
    searchInSurah.addEventListener('input', ()=>{
      const q = searchInSurah.value.trim();
      if(!q){ if(searchResults) searchResults.innerHTML=''; return; }
      const results = [];
      currentAyahs.forEach(a=>{ if(a.text.includes(q)) results.push({num:a.numberInSurah,text:a.text}); });
      if(results.length===0){ if(searchResults) searchResults.innerHTML = '<div class="text-muted">لا توجد نتائج</div>'; return; }
      if(searchResults) searchResults.innerHTML = '<div class="text-muted">نتائج البحث:</div>' + results.map(r=>`<div style="padding:6px 8px;border-radius:6px;margin-top:6px;background:rgba(255,250,235,0.06)"><strong>${r.num}.</strong> ${r.text.replace(new RegExp(q,'g'),`<mark>${q}</mark>`)}</div>`).join('');
      play(soundClick);
    });
  }

  /* ---------- Quran Garden (small handlers) ---------- */
  const verses = [
    {text:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',surah:'الرعد - 28',ex:'الذكر يطمئن القلب.'},
    {text:'وَقُلْ رَبِّ زِدْنِي عِلْمًا',surah:'طه - 114',ex:'دعاء لزيادة العلم.'},
    {text:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',surah:'الشرح - 5',ex:'التوكّل والصبر.'}
  ];
  const newVerseBtn = document.getElementById('newVerseBtn');
  if(newVerseBtn) newVerseBtn.addEventListener('click', ()=>{
    const v = verses[Math.floor(Math.random()*verses.length)];
    const dv = document.getElementById('dailyVerse'); const vs = document.getElementById('verseSurah'); const ex = document.getElementById('verseExplanation');
    if(dv) dv.textContent = '"' + v.text + '"';
    if(vs) vs.textContent = v.surah;
    if(ex) ex.textContent = v.ex;
    play(soundPop);
  });

  /* ---------- Obedience: Dua & Worship — immediate populate and caching ---------- */

  function generateThirtyDuas(){
    return [
      "اللهم ارزقنا العلم النافع","اللهم فرّج همّي","اللهم اشف مرضانا","اللهم ثبت قلوبنا",
      "اللهم اهدنا وارزقنا","ربنا آتنا في الدنيا حسنة","اللهم اغفر لنا وارحمنا","اللهم اغننا بحلالك عن حرامك",
      "اللهم اجعل القرآن ربيع قلوبنا","اللهم أعنّا على ذكرك","اللهم بارك في أعمالنا","اللهم ارزقنا العمل الصالح",
      "اللهم سخر لنا الخير","اللهم احفظ بلادنا","اللهم أجرنا من الفتن","اللهم اجعلنا من عبادك الصالحين",
      "اللهم ثبتنا عند الصعاب","اللهم زدنا قربًا إليك","اللهم اجعلنا شاكرين","اللهم سلّم قلوبنا من الحقد",
      "اللهم أنر بصيرتنا","اللهم أسعد قلوبنا","اللهم اجعلنا من المستغفرين","اللهم اغننا بفضلك",
      "اللهم اجعل أعمالنا خالصة لك","اللهم توفنا مسلمين","اللهم اجعلنا من أهل الجنة","اللهم وفقنا للخير",
      "اللهم بارك لأهلي ومالي","اللهم اجعلنا من الذاكرين"
    ].slice(0,30);
  }

  function generateThirtyWorships(){
    return [
      "صلاة الضحى — ركعتان بعد شروق الشمس","صيام الاثنين والخميس — نوافل","قيام الليل — نافلة",
      "ذكر الصباح والمساء — أذكار","الصدقة الجارية — بث تمليك الخير","صلة الرحم — زيارة الأقارب",
      "إماطة الأذى — عمل مستحب","الاستغفار الدائم","الصدقة السرية","التعليم النافع للناس",
      "حفظ القرآن ولو جزءًا","دعاء مستمر في الخفاء","صلاة الاستخارة عند الحيرة","الوتر في الليل",
      "ذكر الله بعد الصلاة","حسن الخلق مع الناس","البتّ في الأمر بالخير","الالتزام بالوعد",
      "إصلاح ذات البين","ترتيب النية قبل العبادة","التواضع في القول والعمل","إعانة الطالب المحتاج",
      "الإحسان إلى الجار","قراءة أذكار النوم","إطعام الجائع","الصدقة على الميت","التحلي بالصبر",
      "الإكثار من الصلاة على النبي","التوبة النصوح","ذكر الله في السر"
    ].slice(0,30);
  }

  function populateDuaWorship(){
    const duaGrid = document.getElementById('duaGrid');
    const worshipGrid = document.getElementById('worshipGrid');

    // try local cache first
    const cacheD = localStorage.getItem('waha_dua30');
    const cacheW = localStorage.getItem('waha_worship30');
    const duas = cacheD ? JSON.parse(cacheD) : generateThirtyDuas();
    const worships = cacheW ? JSON.parse(cacheW) : generateThirtyWorships();
    // store cache if not present
    if(!cacheD) localStorage.setItem('waha_dua30', JSON.stringify(duas));
    if(!cacheW) localStorage.setItem('waha_worship30', JSON.stringify(worships));

    if(duaGrid){
      let html = '';
      duas.forEach((d,i)=> html += `<div class="interactive-card dua-item" data-idx="${i}" tabindex="0"><h6>دعاء ${i+1}</h6><p>${d}</p></div>`);
      duaGrid.innerHTML = html;
      duaGrid.querySelectorAll('.dua-item').forEach(el=>{
        el.addEventListener('click', ()=>{
          const idx = el.getAttribute('data-idx');
          try{ navigator.clipboard.writeText(duas[idx]); }catch(e){}
          play(soundClick);
          showTempToast('نسخ إلى الحافظة');
        });
      });
    }

    if(worshipGrid){
      let html = '';
      worships.forEach((w,i)=> html += `<div class="interactive-card worship-item" data-idx="${i}" tabindex="0"><h6>${w.split('—')[0].trim()}</h6><p>${w}</p></div>`);
      worshipGrid.innerHTML = html;
      worshipGrid.querySelectorAll('.worship-item').forEach(el=>{
        el.addEventListener('click', ()=>{
          const i = el.getAttribute('data-idx');
          const key = 'waha_worship_mark_'+i;
          if(localStorage.getItem(key)){ localStorage.removeItem(key); el.style.opacity = '1'; showTempToast('إزالة العلامة'); }
          else { localStorage.setItem(key,'1'); el.style.opacity = '0.6'; showTempToast('تم التمييز'); }
          play(soundClick);
        });
      });
      // restore marks
      worshipGrid.querySelectorAll('.worship-item').forEach((el, idx)=>{
        if(localStorage.getItem('waha_worship_mark_'+idx)) el.style.opacity = '0.6';
      });
    }
  }

  /* ---------- Games: Memory, Daily Quiz, Fancy Task ---------- */

  // Memory board
  function createMemoryBoard(){
    const board = document.getElementById('memoryBoard');
    if(!board) return;
    board.innerHTML = '';
    const symbols = ['★','✿','☪','✦','❤','☀','✈','✧'];
    const cards = symbols.concat(symbols);
    // shuffle
    for(let i=cards.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]]; }
    cards.forEach(sym=>{
      const col = document.createElement('div'); col.className='col-3';
      const c = document.createElement('div'); c.className='memory-card islamic-card text-center'; c.dataset.face = sym; c.textContent='?';
      c.addEventListener('click', memoryFlip);
      col.appendChild(c); board.appendChild(col);
    });
  }
  let f=null, s=null, lock=false, matches=0;
  function memoryFlip(e){
    if(lock) return; const el = e.currentTarget;
    if(el===f) return;
    el.textContent = el.dataset.face; el.classList.add('flipped');
    if(!f){ f = el; return; }
    s = el; lock = true;
    setTimeout(()=>{
      if(f.dataset.face === s.dataset.face){
        f.style.visibility='hidden'; s.style.visibility='hidden'; matches++;
        state.gameScore += 10; localStorage.setItem('oasis_game', state.gameScore); refreshStats();
        play(soundPop);
      } else {
        f.textContent='?'; s.textContent='?'; f.classList.remove('flipped'); s.classList.remove('flipped'); play(soundClick);
      }
      f=null; s=null; lock=false;
    }, 700);
  }

  const newGameBtn = document.getElementById('newGameBtn');
  if(newGameBtn) newGameBtn.addEventListener('click', ()=>{ createMemoryBoard(); matches=0; state.gameScore=0; localStorage.setItem('oasis_game',0); refreshStats(); play(soundClick); });
  createMemoryBoard();

  // Daily quiz: choose 9 deterministic by date
  const quizPool = [
    {q:'كم ركعة الفجر؟', opts:['2','4','3'], a:0},
    {q:'ما آخر سورة؟', opts:['الناس','الفاتحة','الكوثر'], a:0},
    {q:'كم جزء في القرآن؟', opts:['30','10','60'], a:0},
    {q:'أين نزل القرآن؟', opts:['مكة','المدينة','القدس'], a:0},
    {q:'متى صلاة المغرب؟', opts:['بعد الغروب','قبل الفجر','بعد الظهر'], a:0},
    {q:'ما فائدة الاستغفار؟', opts:['مغفرة الذنوب','زيادة الهم','الكسل'], a:0},
    {q:'ما هي قبلة المسلمين؟', opts:['الكعبة','القدس','البحر'], a:0},
    {q:'كم ركعات العشاء؟', opts:['4','2','3'], a:0},
    {q:'من هو خاتم الأنبياء؟', opts:['محمد ﷺ','عيسى','موسى'], a:0},
    {q:'ما حكم الصدق؟', opts:['مطلوب','ممنوع','غير مهم'], a:0}
  ];

  function pickN(pool, n, seed){
    let s = seed % 2147483647; if(s<=0) s+=2147483646;
    function rand(){ s = (s * 16807) % 2147483647; return (s-1)/2147483646; }
    const copy = pool.slice();
    for(let i=copy.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
    return copy.slice(0, Math.min(n, copy.length));
  }

  function initDailyQuiz(){
    const area = document.getElementById('quizArea'); if(!area) return;
    const today = new Date(); const seed = Number(`${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`);
    const chosen = pickN(quizPool, 9, seed);
    let html = '<form id="quizForm">';
    chosen.forEach((q, i)=>{
      html += `<div style="margin-bottom:12px;padding:10px;border-radius:8px;background:rgba(255,255,255,0.02)"><div style="font-weight:700;margin-bottom:6px">${i+1}. ${q.q}</div>`;
      q.opts.forEach((opt, idx)=> html += `<label style="display:block;margin-bottom:6px"><input type="radio" name="q${i}" value="${idx}"> ${opt}</label>`);
      html += '</div>';
    });
    html += '<button type="submit" class="btn btn-success">إرسال الإجابات</button></form><div id="quizResult" style="margin-top:12px"></div>';
    area.innerHTML = html;
    const form = document.getElementById('quizForm');
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      let score = 0;
      chosen.forEach((q, idx)=>{ const val = form['q'+idx] ? form['q'+idx].value : null; if(String(val) === String(q.a)) score++; });
      const percent = Math.round((score/chosen.length)*100);
      const result = document.getElementById('quizResult');
      result.innerHTML = `<div style="font-weight:700">نتيجتك: ${score}/${chosen.length} — ${percent}%</div>`;
      if(percent === 100) result.innerHTML += '<div>ما شاء الله — ممتاز!</div>';
      else if(percent >= 70) result.innerHTML += '<div>جيد جدًا — أحسنتِ!</div>';
      else result.innerHTML += '<div>حاولي مرة أخرى غدًا — التعلم مستمر</div>';
      play(soundPop);
      // reward small good deeds
      state.goodDeeds += Math.max(0, Math.floor(score/3));
      localStorage.setItem('oasis_deeds', state.goodDeeds);
      refreshStats();
    });
  }
  // init quiz on demand
  const startQuizBtn = document.getElementById('startQuizBtn');
  if(startQuizBtn) startQuizBtn.addEventListener('click', initDailyQuiz);
  // also create initially for quick access
  initDailyQuiz();

  // Fancy task
  function initFancyTask(){
    const el = document.getElementById('fancyTask');
    const btn = document.getElementById('fancyNext');
    if(!el || !btn) return;
    const tasks = [
      "اكتبي 3 نعم تشكرين الله عليها اليوم.",
      "أرسلي رسالة طيبة لأحد الأقارب.",
      "اقرئي آية وتأمليها دقيقة.",
      "قدّمِي صدقة صغيرة وادعي بها.",
      "اقضي 10 دقائق في الذكر بهدوء."
    ];
    function show(){ el.textContent = tasks[Math.floor(Math.random()*tasks.length)]; play(soundPop); }
    btn.addEventListener('click', show);
    show();
  }
  initFancyTask();

  /* ---------- Daily Duas population (replace audio) ---------- */
  const DAILY_DUAS = [
    "دعاء الاستيقاظ: الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.",
    "دعاء الدخول للبيت: بسم الله ولجنا، وبسم الله خرجنا.",
    "دعاء الخروج من المنزل: بسم الله توكلت على الله ولا حول ولا قوة إلا بالله.",
    "دعاء السفر: سبحان الذي سخر لنا هذا وما كنا له مقرنين.",
    "دعاء المطر: اللهم صيبا نافعا.",
    "دعاء الرياح: اللهم اجعلها بردًا وسلامًا.",
    "دعاء الخوف: اللهم إني أعوذ بك من خوف الليالي.",
    "دعاء النجاح: اللهم لا سهل إلا ما جعلته سهلا.",
    "دعاء اللباس: اللهم بارك لنا فيه وجعلنا شاكرين.",
    "دعاء المرض: اللهم اشفه وداوه شفاء لا يغادر سقمًا.",
    "دعاء النوم: باسمك ربي وضعت جنبي...",
    "دعاء الطعام: الحمد لله الذي أطعمنا وسقانا.",
    "دعاء الشكر: اللهم لك الحمد كما ينبغي لجلال وجهك.",
    "دعاء الاستغفار: أستغفر الله وأتوب إليه.",
    "دعاء طلب العلم: اللهم انفعني بما علمتني.",
    "دعاء السفر للرزق: اللهم بارك لنا في سفرنا وعافنا فيه.",
    "دعاء عند الكرب: لا إله إلا أنت سبحانك إني كنت من الظالمين.",
    "دعاء عند رؤية الآية الكريمة: اللهم اجعلها لنا نورًا.",
    "دعاء للوالدين: رب ارحمهما كما ربياني صغيرًا.",
    "دعاء للمريض: رب اشفِ مريض المؤمنين والمؤمنات.",
    "دعاء للرزق الحلال: اللهم ارزقني رزقًا طيبا مباركا.",
    "دعاء القلق: اللهم اطمئن قلبي واغمرني بالسكينة.",
    "دعاء الهم: يا مفرج الهم فرّج همي ويسر أمري.",
    "دعاء العافية: اللهم عافني في بدني وديني ودنياي.",
    "دعاء التوبة: اللهم اغفر لي وتب علي إنك أنت التواب الرحيم.",
    "دعاء عند الدخول للمسجد: اللهم افتح لي أبواب رحمتك.",
    "دعاء عند الخروج من المسجد: اللهم اجعل ما عملت خالصًا لوجهك.",
    "دعاء للرزق في العمل: اللهم بارك لي في عملي وارزقني الخير.",
    "دعاء عند القراءة: اللهم اجعل القرآن ربيع قلبي ونور صدري."
  ];

  function populateDailyDuas(){
    const area = document.getElementById('dailyDuasList');
    if(!area) return;
    let html = '';
    DAILY_DUAS.forEach((d, i)=> html += `<div class="interactive-card" tabindex="0"><h6>دعاء ${i+1}</h6><p>${d}</p></div>`);
    area.innerHTML = html;
    area.querySelectorAll('.interactive-card').forEach((el, idx)=> el.addEventListener('click', ()=>{
      try{ navigator.clipboard.writeText(DAILY_DUAS[idx]); }catch(e){}
      play(soundClick); showTempToast('نسخ الدعاء');
    }));
  }

  /* ---------- azkar counters ---------- */
  function incAzkar(type){
    const key = 'oasis_azkar_' + type;
    let v = parseInt(localStorage.getItem(key))||0; v++;
    if(v > 33) v = 0;
    localStorage.setItem(key, v);
    const el = document.getElementById('count' + capitalize(type));
    if(el) el.textContent = v;
    if(v === 0) { play(soundPop); alert('انتهيت من 33 ذكرًا — بارك الله فيك'); } else play(soundClick);
  }
  function resetAzkar(type){ localStorage.setItem('oasis_azkar_' + type, 0); const el = document.getElementById('count' + capitalize(type)); if(el) el.textContent = 0; play(soundClick); }
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  ['incMorning','incEvening','incAfter'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', ()=> incAzkar(el.getAttribute('data-counter')));
  });
  ['resetMorning','resetEvening','resetAfter'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', ()=> resetAzkar(el.getAttribute('data-counter')));
  });

  /* ---------- Righteous goods select population ---------- */
  const defaultDeeds = ['مساعدة الوالدين','زيارة الأقارب','إطعام طائر','تبسم في وجه أخيك','إماطة الأذى عن الطريق','إطعام صائم','التصدق بقطعة خبز','حفظ صفحة من القرآن','برّ الجار','الاستغفار 100 مرة','تعليم شخص حكمة بسيطة','زيارة مريض','مساعدة طالب في دراسته'];
  (function fillGoodDeeds(){
    const sel = document.getElementById('goodDeedsSelect');
    if(!sel) return;
    sel.innerHTML = defaultDeeds.map(d=>`<option>${d}</option>`).join('');
  })();

  const recordDeedBtn = document.getElementById('recordDeedBtn');
  if(recordDeedBtn) recordDeedBtn.addEventListener('click', ()=> { state.goodDeeds++; localStorage.setItem('oasis_deeds', state.goodDeeds); refreshStats(); play(soundClick); });

  const calculatePrayerBtn = document.getElementById('calculatePrayerBtn');
  if(calculatePrayerBtn) calculatePrayerBtn.addEventListener('click', ()=>{
    const checks = document.querySelectorAll('.prayer-check'); let c=0; checks.forEach(ch=>{ if(ch.checked) c++; });
    if(c === 5){ state.prayerStreak++; localStorage.setItem('oasis_prayer', state.prayerStreak); refreshStats(); play(soundPop); alert('مبروك! سلسلة الصلاة زادت'); }
    else { play(soundClick); alert('تم احتساب الصلوات ('+c+'/5)'); }
  });

  /* ---------- small utilities ---------- */
  function showTempToast(msg){
    const t = document.createElement('div'); t.style.position='fixed'; t.style.left='18px'; t.style.bottom='18px'; t.style.zIndex=99999; t.style.background='rgba(0,0,0,0.7)'; t.style.color='#fff'; t.style.padding='8px 12px'; t.style.borderRadius='8px'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2000);
  }

  /* ---------- Theme & language controls (persisted) ---------- */
  const LANG_KEY = 'waha_lang', THEME_KEY='waha_theme';
  const wahaLang = document.getElementById('wahaLangSelect');
  const wahaTheme = document.getElementById('wahaThemeSelect');

  function applyLang(l){
    if(!wahaLang) return;
    wahaLang.value = l;
    // simple translation of nav captions (keeps structure)
    document.querySelectorAll('[data-page]').forEach(btn=>{
      const id = btn.getAttribute('data-page');
      if(id === 'dashboard') btn.innerHTML = `<i class="fas fa-home"></i> ${ l==='en' ? 'Dashboard' : (l==='fr' ? 'Tableau' : 'الرئيسية') }`;
      if(id === 'quran') btn.innerHTML = `<i class="fas fa-book-open"></i> ${ l==='en' ? 'Quran' : (l==='fr' ? 'Coran' : 'القرآن الكريم') }`;
      if(id === 'quran-garden') btn.innerHTML = `<i class="fas fa-seedling"></i> ${ l==='en' ? 'Quran Garden' : (l==='fr' ? 'Jardin' : 'بستان القرآن') }`;
      if(id === 'righteous-path') btn.innerHTML = `<i class="fas fa-hands-praying"></i> ${ l==='en' ? 'Righteous' : (l==='fr' ? 'Vertueux' : 'رياض الصالحين') }`;
      if(id === 'obedience-gardens') btn.innerHTML = `<i class="fas fa-mosque"></i> ${ l==='en' ? 'Obedience' : (l==='fr' ? 'Obéissance' : 'جنات الطاعة') }`;
      if(id === 'educational-games') btn.innerHTML = `<i class="fas fa-gamepad"></i> ${ l==='en' ? 'Games' : (l==='fr' ? 'Jeux' : 'ألعاب تربوية') }`;
      if(id === 'progress-tracker') btn.innerHTML = `<i class="fas fa-chart-line"></i> ${ l==='en' ? 'Progress' : (l==='fr' ? 'Progrès' : 'سجل تطورك') }`;
      if(id === 'daily-duas') btn.innerHTML = `<i class="fas fa-moon"></i> ${ l==='en' ? 'Daily Duas' : (l==='fr' ? 'Duas' : 'الأدعية اليومية') }`;
    });
  }
  function applyTheme(t){
    if(!wahaTheme) return;
    wahaTheme.value = t;
    document.body.classList.remove('theme-normal','theme-dark','theme-royal');
    if(t === 'dark') document.body.classList.add('theme-dark');
    else if(t === 'royal') document.body.classList.add('theme-royal');
    else document.body.classList.add('theme-normal');
    localStorage.setItem(THEME_KEY, t);
  }

  // wire selectors
  if(wahaLang){
    const saved = localStorage.getItem(LANG_KEY) || 'ar';
    applyLang(saved);
    wahaLang.addEventListener('change', (e)=>{ localStorage.setItem(LANG_KEY, e.target.value); applyLang(e.target.value); play(soundClick); });
  }
  if(wahaTheme){
    const savedT = localStorage.getItem(THEME_KEY) || 'normal';
    applyTheme(savedT);
    wahaTheme.addEventListener('change', (e)=>{ applyTheme(e.target.value); play(soundPop); });
  }

  /* ---------- Initialization: populate fast items ---------- */
  function init(){
    populateDuaWorship();
    populateDailyDuas();
    createMemoryBoard();
    initDailyQuiz();
    initFancyTask();

    // restore azkar counters
    ['morning','evening','after'].forEach(k=>{ const v = parseInt(localStorage.getItem('oasis_azkar_'+k))||0; const el = document.getElementById('count'+capitalize(k)); if(el) el.textContent = v; });

    // ensure stats
    refreshStats();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // expose for debugging
  window.Oasis = { showPage, loadSurahIndex, loadSurah };

})();
