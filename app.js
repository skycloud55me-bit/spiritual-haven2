// app.js — محدث: ترجمة، ثيم، تعبئة 30 دعاء/عبادة، ألعاب منفصلة (ذاكرة، اختبار يومي، تحدي فاخر)، استبدال الأدعية الصوتية بالأدعية اليومية
(function(){
  "use strict";

  // ====== elements ======
  const openBtn = document.getElementById('openPanelBtn');
  const sidePanel = document.getElementById('sidePanel');
  const closeBtn = document.getElementById('closePanelBtn');
  const backdrop = document.getElementById('backdrop');
  const navItems = document.querySelectorAll('.nav-item');
  const welcomeMsg = document.getElementById('welcomeMsg');
  const phrases = ["السلام عليكم ورحمة الله 🌿","مرحبا بكِ في رحاب الإيمان 💫","زادكِ الله نورًا وطمأنينة 💛","اللهم اجعل هذا اليوم بركةً وسعادة 🌸","يا الله اجعل قلوبنا عامرة بذكرك 🤍"];

  // sound elements (can be replaced with local files)
  const soundClick = document.getElementById('soundClick');
  const soundPop = document.getElementById('soundPop');
  const soundWhoosh = document.getElementById('soundWhoosh');
  function play(el){ try{ if(!el) return; el.currentTime = 0; el.play().catch(()=>{}); } catch(e){} }

  // open/close panel
  function openPanel(){
    sidePanel.classList.add('open'); backdrop.classList.add('show'); sidePanel.setAttribute('aria-hidden','false');
    play(soundClick);
    welcomeMsg.textContent = phrases[Math.floor(Math.random()*phrases.length)];
    welcomeMsg.classList.add('show');
    play(soundWhoosh);
    setTimeout(()=> welcomeMsg.classList.remove('show'), 2600);
  }
  function closePanel(){
    sidePanel.classList.remove('open'); backdrop.classList.remove('show'); sidePanel.setAttribute('aria-hidden','true');
    play(soundClick);
  }
  openBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
  navItems.forEach(btn=> btn.addEventListener('click', ()=>{
    const page = btn.getAttribute('data-page');
    showPage(page);
    setTimeout(closePanel, 220);
  }));

  function showPage(id){
    document.querySelectorAll('.page-content').forEach(p=> p.classList.add('d-none'));
    const target = document.getElementById(id);
    if(target) target.classList.remove('d-none');
    play(soundClick);
  }

  // ====== phrases list fast populate ======
  const phrasesList = document.getElementById('phrasesList');
  if(phrasesList){
    phrasesList.innerHTML = phrases.map(p=>`<li style="padding:6px 0;color:#6b4b0d">${p}</li>`).join('');
  }

  // =========================
  // Quran features (kept original behaviour — text unchanged)
  // =========================
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
      if(surahList){
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
      const html = ayahs.map(a=>`<div style="margin-bottom:10px"><span style="font-weight:700;color:var(--primary)">${a.numberInSurah}.</span> <span>${escapeHtml(a.text)}</span></div>`).join('');
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

  if(searchInSurah){
    searchInSurah.addEventListener('input', ()=>{
      const q = searchInSurah.value.trim();
      if(!q){ if(searchResults) searchResults.innerHTML=''; return; }
      const results = [];
      currentAyahs.forEach(a=>{ if(a.text.includes(q)) results.push({num:a.numberInSurah,text:a.text}); });
      if(results.length===0){ if(searchResults) searchResults.innerHTML = '<div class="text-muted">لا توجد نتائج</div>'; return; }
      if(searchResults) searchResults.innerHTML = '<div class="text-muted">نتائج البحث:</div>' + results.map(r=>`<div style="padding:6px 8px;border-radius:6px;margin-top:6px;background:rgba(255,250,235,0.8)"><strong>${r.num}.</strong> ${r.text.replace(new RegExp(q,'g'),`<mark>${q}</mark>`)}</div>`).join('');
      play(soundClick);
    });
  }

  // reader controls
  const incFontBtn = document.getElementById('increaseFont');
  const decFontBtn = document.getElementById('decreaseFont');
  const toggleReaderBtn = document.getElementById('toggleReaderTheme');
  if(incFontBtn) incFontBtn.addEventListener('click', ()=>{ fontSize = Math.min(30,fontSize+2); if(surahText) surahText.style.fontSize = fontSize+'px'; play(soundClick); });
  if(decFontBtn) decFontBtn.addEventListener('click', ()=>{ fontSize = Math.max(14,fontSize-2); if(surahText) surahText.style.fontSize = fontSize+'px'; play(soundClick); });
  if(toggleReaderBtn) toggleReaderBtn.addEventListener('click', ()=>{ readerDark=!readerDark; const container=document.querySelector('.surah-container'); if(readerDark){ container.style.background='#0b2b2b'; container.style.color='#f1f1f1'; } else { container.style.background='rgba(255,255,255,0.98)'; container.style.color='#111'; } play(soundClick); });

  loadSurahIndex();

  // =========================
  // Quran Garden (verse & duas)
  // =========================
  const verses = [
    {text:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',surah:'الرعد - 28',ex:'الذكر يطمئن القلب.'},
    {text:'وَقُلْ رَبِّ زِدْنِي عِلْمًا',surah:'طه - 114',ex:'دعاء لزيادة العلم.'},
    {text:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',surah:'الشرح - 5',ex:'التوكّل والصبر.'}
  ];
  const duas = {
    knowledge:[
      'اللهم أنفعنا بالعلم وعلّمنا ما ينفعنا',
      'اللهم ارزقنا علمًا نافعًا وعملاً متقبلاً',
      'اللهم اجعلنا من أهل العلم النافع'
    ],
    ease:[
      'اللهم لا سهل إلا ما جعلته سهلاً',
      'اللهم فكّ كربتي ويسّر أمري',
      'اللهم يسّر لنا أمورنا'
    ],
    worries:[
      'اللهم الطّمأنينة لقلبي',
      'اللهم فرّج همّي واغفر لي',
      'اللهم اجعل الهم بعيدًا عنا'
    ],
    general:[
      'اللهم اغفر لنا وارحمنا',
      'اللهم اهدنا واجعلنا من الصالحين',
      'اللهم ثبّت قلوبنا'
    ]
  };

  const newVerseBtn = document.getElementById('newVerseBtn');
  if(newVerseBtn) newVerseBtn.addEventListener('click', ()=>{
    const v = verses[Math.floor(Math.random()*verses.length)];
    const dv = document.getElementById('dailyVerse'); const vs = document.getElementById('verseSurah'); const ex = document.getElementById('verseExplanation');
    if(dv) dv.textContent = '"' + v.text + '"';
    if(vs) vs.textContent = v.surah;
    if(ex) ex.textContent = v.ex;
    play(soundPop);
  });

  const newDuaBtn = document.getElementById('newDuaBtn');
  if(newDuaBtn) newDuaBtn.addEventListener('click', ()=>{
    const cat = (document.getElementById('duaCategory')||{}).value || 'all';
    let list = [];
    if(cat==='all'){ Object.values(duas).forEach(a=> list = list.concat(a)); }
    else list = duas[cat] || [];
    if(list.length===0) return;
    const d = list[Math.floor(Math.random()*list.length)];
    const duaText = document.getElementById('duaText'); const duaCatText = document.getElementById('duaCategoryText');
    if(duaText) duaText.textContent = d;
    if(duaCatText) duaCatText.textContent = 'نوع الدعاء: ' + (cat==='all' ? 'عام' : document.getElementById('duaCategory').selectedOptions[0].text);
    play(soundClick);
  });

  // pages goal
  const pagesGoalEl = document.getElementById('pagesGoal');
  if(pagesGoalEl){
    pagesGoalEl.addEventListener('input', ()=>{
      const out = document.getElementById('goalValue');
      if(out) out.textContent = pagesGoalEl.value;
      localStorage.setItem('oasis_pagesGoal', pagesGoalEl.value);
      play(soundClick);
    });
  }
  const recordReadingBtn = document.getElementById('recordReadingBtn');
  if(recordReadingBtn) recordReadingBtn.addEventListener('click', ()=>{
    const added = Math.max(1, Math.round(Math.random() * (parseInt(pagesGoalEl.value || '1'))));
    state.quranPages += added; localStorage.setItem('oasis_pages', state.quranPages);
    const qEl = document.getElementById('quranPages'); if(qEl) qEl.textContent = state.quranPages;
    const ach = document.getElementById('achievementsList'); if(ach) ach.insertAdjacentHTML('afterbegin','<li class="list-group-item">قراءة: +'+added+' صفحة - '+new Date().toLocaleDateString()+'</li>');
    play(soundClick);
  });

  // =========================
  // Righteous: good deeds and prayers
  // =========================
  const defaultDeeds = ['مساعدة الوالدين','زيارة الأقارب','إطعام طائر','تبسم في وجه أخيك','إماطة الأذى عن الطريق','إطعام صائم','التصدق بقطعة خبز','حفظ صفحة من القرآن','برّ الجار','الاستغفار 100 مرة','تعليم شخص حكمة بسيطة','زيارة مريض','مساعدة طالب في دراسته'];
  const goodDeedsSelect = document.getElementById('goodDeedsSelect');
  if(goodDeedsSelect){
    goodDeedsSelect.innerHTML = defaultDeeds.map(d=>`<option>${d}</option>`).join('');
  }
  const recordDeedBtn = document.getElementById('recordDeedBtn');
  if(recordDeedBtn) recordDeedBtn.addEventListener('click', ()=>{
    state.goodDeeds++; localStorage.setItem('oasis_deeds', state.goodDeeds);
    const gd = document.getElementById('goodDeeds'); if(gd) gd.textContent = state.goodDeeds;
    play(soundClick);
  });
  const calculatePrayerBtn = document.getElementById('calculatePrayerBtn');
  if(calculatePrayerBtn) calculatePrayerBtn.addEventListener('click', ()=>{
    const checks = document.querySelectorAll('.prayer-check'); let c=0; checks.forEach(ch=>{ if(ch.checked) c++; });
    if(c===5){ state.prayerStreak++; localStorage.setItem('oasis_prayer', state.prayerStreak); const ps = document.getElementById('prayerStreak'); if(ps) ps.textContent = state.prayerStreak; play(soundPop); alert('مبروك! سلسلة الصلاة زادت'); }
    else { play(soundClick); alert('تم احتساب الصلوات ('+c+'/5)'); }
  });

  // azkar counters: fast handlers (keeping existing API but wiring faster)
  function incAzkar(t){ const key='oasis_azkar_'+t; let v=parseInt(localStorage.getItem(key))||0; v++; if(v>33) v=0; localStorage.setItem(key,v); const el=document.getElementById('count'+capitalize(t)); if(el) el.textContent = v; if(v===0){ play(soundPop); alert('انتهيت من 33 ذكرًا - بارك الله فيك'); } else play(soundClick); }
  function resetAzkar(t){ localStorage.setItem('oasis_azkar_'+t,0); const el=document.getElementById('count'+capitalize(t)); if(el) el.textContent = 0; play(soundClick); }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  ['incMorning','incEvening','incAfter'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('click', ()=> incAzkar(el.getAttribute('data-counter'))); });
  ['resetMorning','resetEvening','resetAfter'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('click', ()=> resetAzkar(el.getAttribute('data-counter'))); });

  // =========================
  // Obedience: fill duaGrid & worshipGrid with 30 items each (fast)
  // =========================
  function generateThirtyDuas(){
    const base = [
      "اللهم ارزقنا العلم النافع","اللهم فرّج همّي","اللهم اشف مرضانا","اللهم ثبت قلوبنا",
      "اللهم اهدنا وارزقنا","ربنا آتنا في الدنيا حسنة","اللهم اغفر لنا وارحمنا","اللهم اغننا بحلالك عن حرامك",
      "اللهم اجعل القرآن ربيع قلوبنا","اللهم أعنّا على ذكرك","اللهم بارك في أعمالنا","اللهم ارزقنا العمل الصالح",
      "اللهم سخر لنا الخير","اللهم احفظ بلادنا","اللهم أجرنا من الفتن","اللهم اجعلنا من عبادك الصالحين",
      "اللهم ثبتنا عند الصعاب","اللهم زدنا قربًا إليك","اللهم اجعلنا شاكرين","اللهم سلّم قلوبنا من الحقد",
      "اللهم أنر بصيرتنا","اللهم أسعد قلوبنا","اللهم اجعلنا من المستغفرين","اللهم اغننا بفضلك",
      "اللهم اجعل أعمالنا خالصة لك","اللهم توفنا مسلمين","اللهم اجعلنا من أهل الجنة","اللهم وفقنا للخير",
      "اللهم بارك لأهلي ومالي","اللهم اجعلنا من الذاكرين"
    ];
    return base.slice(0,30);
  }
  function generateThirtyWorships(){
    const base = [
      "صلاة الضحى — ركعتان بعد شروق الشمس","صيام الاثنين والخميس — نوافل","قيام الليل — نافلة",
      "ذكر الصباح والمساء — أذكار","الصدقة الجارية — بث تمليك الخير","صلة الرحم — زيارة الأقارب",
      "إماطة الأذى — عمل مستحب","الاستغفار الدائم","الصدقة السرية","التعليم النافع للناس",
      "حفظ القرآن ولو جزءًا","دعاء مستمر في الخفاء","صلاة الاستخارة عند الحيرة","الوتر في الليل",
      "ذكر الله بعد الصلاة","حسن الخلق مع الناس","البتّ في الأمر بالخير","الالتزام بالوعد",
      "إصلاح ذات البين","ترتيب النية قبل العبادة","التواضع في القول والعمل","إعانة الطالب المحتاج",
      "الإحسان إلى الجار","قراءة أذكار النوم","إطعام الجائع","الصدقة على الميت","التحلي بالصبر",
      "الإكثار من الصلاة على النبي","التوبة النصوح","ذكر الله في السر"
    ];
    return base.slice(0,30);
  }

  function populateDuaWorshipFast(){
    const duaGrid = document.getElementById('duaGrid');
    const worshipGrid = document.getElementById('worshipGrid');
    const duasList = generateThirtyDuas();
    const worshipList = generateThirtyWorships();

    if(duaGrid){
      let html = '';
      duasList.forEach((d,i)=>{ html += `<div class="interactive-card dua-item" data-idx="${i}" tabindex="0"><h6>دعاء ${i+1}</h6><p>${d}</p></div>`; });
      duaGrid.innerHTML = html;
      duaGrid.querySelectorAll('.dua-item').forEach(el=> el.addEventListener('click', ()=>{
        const idx = el.getAttribute('data-idx'); try{ navigator.clipboard.writeText(duasList[idx]); }catch(e){}
        play(soundClick); showTempToast('نسخ إلى الحافظة');
      }));
    }

    if(worshipGrid){
      let html = '';
      worshipList.forEach((w,i)=>{ html += `<div class="interactive-card worship-item" data-idx="${i}" tabindex="0"><h6>${w.split('—')[0].trim()}</h6><p>${w}</p></div>`; });
      worshipGrid.innerHTML = html;
      worshipGrid.querySelectorAll('.worship-item').forEach(el=>{
        el.addEventListener('click', ()=>{
          const i = el.getAttribute('data-idx');
          const key = 'waha_worship_'+i;
          if(localStorage.getItem(key)){ localStorage.removeItem(key); el.style.opacity='1'; showTempToast('تم إزالة العلامة'); }
          else { localStorage.setItem(key,'done'); el.style.opacity='0.7'; showTempToast('تم التمييز'); }
          play(soundClick);
        });
      });
      // restore marks quickly
      worshipGrid.querySelectorAll('.worship-item').forEach((el, idx)=>{ if(localStorage.getItem('waha_worship_'+idx)) el.style.opacity='0.7'; });
    }
  }

  // =========================
  // Games: Memory, Daily Quiz (9 q/day), Fancy game
  // =========================

  // Memory game
  function createMemoryBoard(){
    const board = document.getElementById('memoryBoard');
    if(!board) return;
    board.innerHTML = '';
    const symbols = ['★','✿','☪','✦','❤','☀','✈','✧'];
    const cards = symbols.concat(symbols).map((v,i)=>({id:i, face:v}));
    // shuffle simple
    for(let i=cards.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]]; }
    cards.forEach((c,idx)=>{
      const wrapper = document.createElement('div'); wrapper.className='col-3';
      const card = document.createElement('div'); card.className='memory-card islamic-card text-center'; card.dataset.face = c.face; card.textContent='?';
      card.style.userSelect='none'; card.addEventListener('click', onFlip);
      wrapper.appendChild(card); board.appendChild(wrapper);
    });
  }
  let mFirst=null, mSecond=null, mLock=false, mMatches=0;
  function onFlip(e){
    if(mLock) return;
    const el = e.currentTarget;
    if(el===mFirst) return;
    el.textContent = el.dataset.face;
    el.classList.add('flipped');
    if(!mFirst){ mFirst = el; return; }
    mSecond = el; mLock = true;
    setTimeout(()=>{
      if(mFirst.dataset.face === mSecond.dataset.face){
        mFirst.style.visibility='hidden'; mSecond.style.visibility='hidden';
        mMatches++;
        state.gameScore += 10; localStorage.setItem('oasis_game', state.gameScore);
        const gs = document.getElementById('gameScore'); if(gs) gs.textContent = state.gameScore;
        play(soundPop);
        if(mMatches === 8){ showTempToast('مبروك! أكملت كل الأزواج'); }
      } else {
        mFirst.textContent='?'; mSecond.textContent='?'; mFirst.classList.remove('flipped'); mSecond.classList.remove('flipped');
        play(soundClick);
      }
      mFirst=null; mSecond=null; mLock=false;
    }, 700);
  }
  const newGameBtn = document.getElementById('newGameBtn');
  if(newGameBtn) newGameBtn.addEventListener('click', ()=>{ createMemoryBoard(); mMatches=0; state.gameScore=0; localStorage.setItem('oasis_game', state.gameScore); const gs = document.getElementById('gameScore'); if(gs) gs.textContent = state.gameScore; play(soundClick); });
  createMemoryBoard();

  // Daily Quiz: deterministic selection by date -> 9 questions (or fewer if pool smaller)
  const quizPool = [
    {q:'كم عدد ركعات صلاة الفجر؟',opts:['2','4','3'],a:0},
    {q:'ما اسم آخر سورة في القرآن؟',opts:['الناس','الفاتحة','الكوثر'],a:0},
    {q:'متى تكون صلاة الظهر؟',opts:['بعد منتصف النهار','مساءً','فجرًا'],a:0},
    {q:'كم عدد أجزاء القرآن؟',opts:['30','10','60'],a:0},
    {q:'ما فائدة الاستغفار؟',opts:['مغفرة الذنوب','زيادة الوزن','نوم عميق'],a:0},
    {q:'أين أنزل القرآن؟',opts:['المدينة','مكة','القدس'],a:1},
    {q:'ما هي قبلة المسلمين؟',opts:['الكعبة','القدس','البحر'],a:0},
    {q:'ما الفائدة من الصدقة؟',opts:['بركة المال','نقصه','ألم'],a:0},
    {q:'ما هو وقت صلاة المغرب؟',opts:['بعد غروب الشمس','قبل الفجر','بعد الظهر'],a:0},
    {q:'ما عدد ركعات العشاء؟',opts:['4','2','3'],a:0},
    {q:'ما حكم الصدق؟',opts:['واجب حسن','مستحب','مكروه'],a:0},
    {q:'اذكر عملاً يقربك من الله',opts:['الصدقة','الكذب','السرقة'],a:0},
    {q:'ما أثر الاستغفار؟',opts:['راحة وفتح أبواب','زيادة الهم','فقدان الأمل'],a:0}
  ];

  function pickNDeterministic(pool, n, seed){
    // simple LCG
    let s = seed % 2147483647; if(s<=0) s += 2147483646;
    function rand(){ s = (s * 16807) % 2147483647; return (s-1)/2147483646; }
    const copy = pool.slice();
    for(let i=copy.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
    return copy.slice(0,Math.min(n,copy.length));
  }

  function initDailyQuiz(){
    const container = document.getElementById('quizArea');
    if(!container) return;
    const today = new Date(); const seed = Number(`${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`);
    const chosen = pickNDeterministic(quizPool, 9, seed);
    // build UI
    const html = ['<form id="quizForm">'];
    chosen.forEach((q, idx)=>{
      html.push(`<div style="margin-bottom:12px;padding:10px;border-radius:8px;background:rgba(255,255,255,0.02)"><div style="font-weight:700;margin-bottom:6px">${idx+1}. ${q.q}</div>`);
      q.opts.forEach((opt,i)=> html.push(`<label style="display:block;margin-bottom:6px"><input type="radio" name="q${idx}" value="${i}"> ${opt}</label>`));
      html.push('</div>');
    });
    html.push('<button type="submit" class="btn btn-success">ارسال الاجابات</button></form><div id="quizResult" style="margin-top:12px"></div>');
    container.innerHTML = html.join('');
    const form = document.getElementById('quizForm');
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      let score=0;
      chosen.forEach((q,idx)=>{ const val = form['q'+idx] ? form['q'+idx].value : null; if(String(val) === String(q.a)) score++; });
      const percent = Math.round((score/chosen.length)*100);
      const resultEl = document.getElementById('quizResult');
      resultEl.innerHTML = `<div style="font-weight:700">نتيجتك: ${score}/${chosen.length} — ${percent}%</div>`;
      if(percent===100) resultEl.innerHTML += `<div>ما شاء الله — ممتاز!</div>`; else if(percent>=70) resultEl.innerHTML += `<div>جيد جدًا — أحسنتِ!</div>`; else resultEl.innerHTML += `<div>حاولي مرة أخرى غدًا — التعلم مستمر</div>`;
      play(soundPop);
      incrementGoodDeed(Math.max(0,Math.floor(score/3)));
    });
  }
  document.getElementById('startQuizBtn').addEventListener('click', initDailyQuiz);
  // also init once
  // initDailyQuiz();  // will be called on full init

  // Fancy game (replaces riddles)
  function initFancyGame(){
    const area = document.getElementById('fancyTask');
    const btn = document.getElementById('fancyNext');
    if(!area || !btn) return;
    const tasks = [
      "اكتبي 3 نعم تشكرين الله عليها اليوم.",
      "أرسلي رسالة طيبة لأحد الأقارب.",
      "اقرئي آية وتأمليها دقيقة كاملة.",
      "قدّمِي صدقة صغيرة وادعي بها.",
      "اقضي 10 دقائق في ذكر الله بصمت."
    ];
    function showTask(){ const t = tasks[Math.floor(Math.random()*tasks.length)]; area.textContent = t; play(soundPop); }
    btn.addEventListener('click', showTask);
    showTask();
  }

  // =========================
  // Daily duas (replace audio-duas)
  // =========================
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
    DAILY_DUAS.forEach((d,i)=> html += `<div class="interactive-card" tabindex="0"><h6>دعاء ${i+1}</h6><p>${d}</p></div>`);
    area.innerHTML = html;
    area.querySelectorAll('.interactive-card').forEach((el, idx)=>{
      el.addEventListener('click', ()=>{
        try{ navigator.clipboard.writeText(DAILY_DUAS[idx]); }catch(e){}
        play(soundClick); showTempToast('نسخ الدعاء');
      });
    });
  }

  // =========================
  // progress / persistence
  // =========================
  let state = { prayerStreak: parseInt(localStorage.getItem('oasis_prayer'))||0, goodDeeds: parseInt(localStorage.getItem('oasis_deeds'))||0, quranPages: parseInt(localStorage.getItem('oasis_pages'))||0, gameScore: parseInt(localStorage.getItem('oasis_game'))||0 };
  const elPrayer = document.getElementById('prayerStreak'); if(elPrayer) elPrayer.textContent = state.prayerStreak;
  const elGood = document.getElementById('goodDeeds'); if(elGood) elGood.textContent = state.goodDeeds;
  const elPages = document.getElementById('quranPages'); if(elPages) elPages.textContent = state.quranPages;
  const elGame = document.getElementById('gameScore'); if(elGame) elGame.textContent = state.gameScore;

  function incrementGoodDeed(n=1){
    state.goodDeeds += n; localStorage.setItem('oasis_deeds', state.goodDeeds);
    const gd = document.getElementById('goodDeeds'); if(gd) gd.textContent = state.goodDeeds;
  }

  function showTempToast(msg){
    const t = document.createElement('div'); t.style.position='fixed'; t.style.left='18px'; t.style.bottom='18px'; t.style.zIndex=99999; t.style.background='rgba(0,0,0,0.7)'; t.style.color='#fff'; t.style.padding='8px 12px'; t.style.borderRadius='8px'; t.textContent=msg; document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2200);
  }

  // ===== translations & themes handling =====
  const TRANSLATIONS = {
    ar: { welcome:'مرحبا بكِ' },
    en: { welcome:'Welcome' },
    fr: { welcome:'Bienvenue' }
  };
  const THEME_KEY='waha_theme', LANG_KEY='waha_lang';
  function setTheme(name){ document.body.classList.remove('theme-normal','theme-dark','theme-royal'); if(name==='dark') document.body.classList.add('theme-dark'); else if(name==='royal') document.body.classList.add('theme-royal'); else document.body.classList.add('theme-normal'); localStorage.setItem(THEME_KEY,name); }
  function getTheme(){ return localStorage.getItem(THEME_KEY) || 'normal'; }
  function setLang(lang){ localStorage.setItem(LANG_KEY, lang); applyTranslations(lang); }
  function getLang(){ return localStorage.getItem(LANG_KEY) || 'ar'; }
  function applyTranslations(lang){
    const t = TRANSLATIONS[lang] || TRANSLATIONS['ar'];
    const welcome = document.getElementById('welcomeMsg'); if(welcome) welcome.textContent = t.welcome || welcome.textContent;
    // update nav labels (simple)
    document.querySelectorAll('[data-page]').forEach(btn=>{
      const key = btn.getAttribute('data-page');
      if(key==='quran') btn.innerHTML = `<i class="fas fa-book-open"></i> ${ lang==='en' ? 'Quran' : (lang==='fr' ? 'Le Coran' : 'القرآن الكريم') }`;
      if(key==='quran-garden') btn.innerHTML = `<i class="fas fa-book-quran"></i> ${ lang==='en' ? 'Quran Garden' : (lang==='fr' ? 'Jardin du Coran' : 'بستان القرآن') }`;
      if(key==='righteous-path') btn.innerHTML = `<i class="fas fa-hands-praying"></i> ${ lang==='en' ? 'Righteous Path' : (lang==='fr' ? 'Chemin vertueux' : 'رياض الصالحين') }`;
      if(key==='obedience-gardens') btn.innerHTML = `<i class="fas fa-mosque"></i> ${ lang==='en' ? 'Obedience Gardens' : (lang==='fr' ? 'Jardins' : 'جنات الطاعة') }`;
      if(key==='educational-games') btn.innerHTML = `<i class="fas fa-gamepad"></i> ${ lang==='en' ? 'Games' : (lang==='fr' ? 'Jeux' : 'ألعاب تربوية') }`;
      if(key==='progress-tracker') btn.innerHTML = `<i class="fas fa-chart-line"></i> ${ lang==='en' ? 'Progress' : (lang==='fr' ? 'Progrès' : 'سجل تطورك') }`;
      if(key==='daily-duas') btn.innerHTML = `<i class="fas fa-pray"></i> ${ lang==='en' ? 'Daily Duas' : (lang==='fr' ? 'Duas' : 'الأدعية اليومية') }`;
    });
  }

  // wire lang/theme selects
  const langSelect = document.getElementById('wahaLangSelect');
  const themeSelect = document.getElementById('wahaThemeSelect');
  if(langSelect){ langSelect.value = getLang(); langSelect.addEventListener('change', (e)=>{ setLang(e.target.value); play(soundClick); }); applyTranslations(getLang()); }
  if(themeSelect){ themeSelect.value = getTheme(); themeSelect.addEventListener('change', (e)=>{ setTheme(e.target.value); play(soundPop); }); setTheme(getTheme()); }

  // Initial population & fast display
  function initAll(){
    populateDuaWorshipFast();
    populateDailyDuas();
    createMemoryBoard();
    initDailyQuiz(); // prepare quiz UI
    initFancyGame();
    // restore azkar counts
    ['morning','evening','after'].forEach(k=>{ const v=parseInt(localStorage.getItem('oasis_azkar_'+k))||0; const el=document.getElementById('count'+capitalize(k)); if(el) el.textContent = v; });
    // ensure progress counters shown
    const good = parseInt(localStorage.getItem('oasis_deeds')) || 0; const pray = parseInt(localStorage.getItem('oasis_prayer')) || 0;
    if(document.getElementById('goodDeeds')) document.getElementById('goodDeeds').textContent = good;
    if(document.getElementById('prayerStreak')) document.getElementById('prayerStreak').textContent = pray;
    // hide splash if present (index may not contain splash)
    setTimeout(()=>{ const sp=document.getElementById('splash'); if(sp) sp.style.display='none'; }, 3200);
  }

  // init on DOM ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();

  // expose for debug
  window.Oasis = { loadSurahIndex, loadSurah, openPanel, closePanel };

})();
