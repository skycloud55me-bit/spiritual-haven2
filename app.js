// app.js — مُحدّث: يتوافق مع index.html الحالي
(function(){
  "use strict";

  // عناصر DOM الأساسية
  const openBtn = document.getElementById('openPanelBtn');
  const sidePanel = document.getElementById('sidePanel');
  const closeBtn = document.getElementById('closePanelBtn');
  const backdrop = document.getElementById('backdrop');
  const navItems = document.querySelectorAll('[data-page]'); // جميع أزرار الشريط
  const wahaLang = document.getElementById('wahaLangSelect');
  const wahaTheme = document.getElementById('wahaThemeSelect');

  // أصوات (مضمنة في index.html)
  const soundClick   = document.getElementById('soundClick');
  const soundPop     = document.getElementById('soundPop');
  const soundWhoosh  = document.getElementById('soundWhoosh');

  // جمل ترحيبية قصيرة
  const phrases = [
    "السلام عليكم ورحمة الله 🌿",
    "مرحبا بكِ في رحاب الإيمان 💫",
    "زادكِ الله نورًا وطمأنينة 💛",
    "اللهم اجعل هذا اليوم بركةً وسعادة 🌸",
    "يا الله اجعل قلوبنا عامرة بذكرك 🤍"
  ];

  // مشغل صوتي آمن (يتجاهل أخطاء autoplay)
  function playSound(audioEl){
    try{
      if(!audioEl) return;
      audioEl.currentTime = 0;
      const p = audioEl.play();
      if(p && typeof p.then === 'function') p.catch(()=>{});
    }catch(e){}
  }

  // فتح/غلق الشريط الجانبي
  function openPanel(){
    if(!sidePanel) return;
    sidePanel.classList.add('open');
    if(backdrop) backdrop.classList.add('show');
    sidePanel.setAttribute('aria-hidden','false');
    playSound(soundWhoosh);
    // عرض عبارة ترحيب مؤقتة
    const p = phrases[Math.floor(Math.random()*phrases.length)];
    const phrasesList = document.getElementById('phrasesList');
    if(phrasesList) phrasesList.textContent = p;
    setTimeout(()=> { if(phrasesList) phrasesList.textContent = ''; }, 3000);
  }
  function closePanel(){
    if(!sidePanel) return;
    sidePanel.classList.remove('open');
    if(backdrop) backdrop.classList.remove('show');
    sidePanel.setAttribute('aria-hidden','true');
    playSound(soundWhoosh);
  }

  if(openBtn) openBtn.addEventListener('click', ()=>{ openPanel(); /* صوت النقر عند الفتح */ playSound(soundClick); });
  if(closeBtn) closeBtn.addEventListener('click', ()=>{ closePanel(); playSound(soundClick); });
  if(backdrop) backdrop.addEventListener('click', ()=>{ closePanel(); playSound(soundClick); });

  // عرض الصفحة حسب data-page
  function showPage(id){
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('d-none'));
    const target = document.getElementById(id);
    if(target) target.classList.remove('d-none');
    // صوت خفيف عند التنقل
    playSound(soundWhoosh);
    if(window.innerWidth < 900) setTimeout(closePanel, 220);
  }

  // ربط جميع أزرار الشريط (يشمل sub-item) — لكن سنخفي زري dua و worship من الواجهة
  function initNav(){
    // أولا: إخفاء زري 'دعاء الخير' و 'العبادات المستحبة' من الشريط الجانبي (لن تُحذف الصفحات نفسها)
    document.querySelectorAll('[data-page="dua"], [data-page="worship"]').forEach(el => {
      // إخفاء العرض البصري من الشريط فقط
      el.style.display = 'none';
    });

    // الآن اربط حدث لكل زر مرئي
    document.querySelectorAll('[data-page]').forEach(btn=>{
      // if hidden, still exists in nodeList; clicks won't be made on hidden ones
      btn.addEventListener('click', (e)=>{
        const page = btn.getAttribute('data-page');
        // الصوت عند الضغط (مطلوب)
        playSound(soundClick);
        // إظهار الصفحة
        if(page) showPage(page);
      });
    });
  }

  // تفعيل اللغة (تبسيط: يترجم نص أزرار الشريط فقط — لا يترجم المحتوى الداخلي)
  const LANG_KEY = 'waha_lang';
  function applyLang(lang){
    // set select value
    if(wahaLang) wahaLang.value = lang;
    document.querySelectorAll('[data-page]').forEach(btn=>{
      const id = btn.getAttribute('data-page');
      const isHidden = btn.style.display === 'none';
      // keep hidden state — but still update its label if later shown
      let label = '';
      if(id === 'dashboard') label = (lang==='en' ? 'Dashboard' : (lang==='fr' ? 'Tableau' : 'الرئيسية'));
      if(id === 'quran') label = (lang==='en' ? 'Quran' : (lang==='fr' ? 'Coran' : 'القرآن الكريم'));
      if(id === 'quran-garden') label = (lang==='en' ? 'Quran Garden' : (lang==='fr' ? 'Jardin' : 'بستان القرآن'));
      if(id === 'righteous-path') label = (lang==='en' ? 'Righteous' : (lang==='fr' ? 'Vertueux' : 'رياض الصالحين'));
      if(id === 'obedience-gardens') label = (lang==='en' ? 'Obedience' : (lang==='fr' ? 'Obéissance' : 'جنات الطاعة'));
      if(id === 'educational-games') label = (lang==='en' ? 'Games' : (lang==='fr' ? 'Jeux' : 'ألعاب تربوية'));
      if(id === 'progress-tracker') label = (lang==='en' ? 'Progress' : (lang==='fr' ? 'Progrès' : 'سجل تطورك'));
      if(id === 'daily-duas') label = (lang==='en' ? 'Daily Duas' : (lang==='fr' ? 'Duas' : 'الأدعية اليومية'));
      if(id === 'dua') label = (lang==='en' ? 'Good Duas' : (lang==='fr' ? 'Duas' : 'دعاء الخير'));
      if(id === 'worship') label = (lang==='en' ? 'Worship' : (lang==='fr' ? 'Culte' : 'العبادات المستحبة'));
      // update innerHTML preserving icon <i> if present
      if(label){
        const icon = btn.querySelector('i');
        if(icon) btn.innerHTML = icon.outerHTML + ' ' + `<span>${label}</span>`;
        else btn.innerHTML = `<span>${label}</span>`;
      }
      // if was hidden, keep hidden after relabel
      if(isHidden) btn.style.display = 'none';
    });
  }

  // تفعيل السمة (normal/dark/royal) — تطبيق عن طريق إضافة كلاس إلى body
  const THEME_KEY = 'waha_theme';
  function applyTheme(theme){
    if(wahaTheme) wahaTheme.value = theme;
    document.body.classList.remove('theme-normal','theme-dark','theme-royal');
    if(theme === 'dark') document.body.classList.add('theme-dark');
    else if(theme === 'royal') document.body.classList.add('theme-royal');
    else document.body.classList.add('theme-normal');
    localStorage.setItem(THEME_KEY, theme);
  }

  // وصل المستمعين لاختيارات اللغة و السمة وحفظها
  function initControls(){
    // language
    const savedLang = localStorage.getItem(LANG_KEY) || 'ar';
    applyLang(savedLang);
    if(wahaLang){
      wahaLang.addEventListener('change', (e)=>{
        const v = e.target.value;
        localStorage.setItem(LANG_KEY, v);
        applyLang(v);
        playSound(soundClick);
      });
    }
    // theme
    const savedTheme = localStorage.getItem(THEME_KEY) || 'normal';
    applyTheme(savedTheme);
    if(wahaTheme){
      wahaTheme.addEventListener('change', (e)=>{
        applyTheme(e.target.value);
        playSound(soundPop);
      });
    }
  }

  // إعادة تحميل الإحصائيات البسيطة
  function restoreStats(){
    const prayer = parseInt(localStorage.getItem('oasis_prayer')) || 0;
    const deeds  = parseInt(localStorage.getItem('oasis_deeds'))  || 0;
    const pages  = parseInt(localStorage.getItem('oasis_pages'))  || 0;
    const game   = parseInt(localStorage.getItem('oasis_game'))   || 0;
    const elPrayer = document.getElementById('prayerStreak');
    const elDeeds  = document.getElementById('goodDeeds');
    const elPages  = document.getElementById('quranPages');
    const elGame   = document.getElementById('gameScore');
    if(elPrayer) elPrayer.textContent = prayer;
    if(elDeeds)  elDeeds.textContent  = deeds;
    if(elPages)  elPages.textContent  = pages;
    if(elGame)   elGame.textContent   = game;
  }

  // منع تكرار صوتي مزدوج: نعتمد تشغيل الصوت عند الضغط على button فقط عبر capturing،
  // لكن أحداث محددة (open/close) تطلب تشغيلًا إضافيًا — هذه الازدواجية بسيطة ومقبولة.
  // لكنه من الأفضل عدم تشغيل أصوات إضافية في نفس الوقت.

  // تشغيل الصوت عندما ينقر المستخدم على زر (<button>) فقط
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest && ev.target.closest('button');
    if(btn){
      // نمرّ هنا لكن لا نستدعي صوت مباشر لأن أزرار الشريط تُدير صوتها بنفسها في handlers
      // نترك هنا صوتًا خفيفًا كاحتياط (ممكن إزالته لاحقًا)
      // playSound(soundClick);
    }
  }, {capture: true});

  // تهيئة عامة عند تحميل الوثيقة
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initControls();
    restoreStats();
    // عرض الصفحة الافتراضية
    showPage('dashboard');
  });

  // تصدير لأغراض debug
  window.Oasis = { openPanel, closePanel, showPage, applyLang, applyTheme };

})();
