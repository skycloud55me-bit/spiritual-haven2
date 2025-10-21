// app.js — توافق تام مع index.html (تشغيل صوت عند الضغط فقط, عدم حذف أي زر)
(function(){
  "use strict";

  // عناصر رئيسية من HTML (تطابق ملف index.html الذي أرسلته)
  const openBtn = document.getElementById('openPanelBtn');
  const sidePanel = document.getElementById('sidePanel');
  const closeBtn = document.getElementById('closePanelBtn');
  const backdrop = document.getElementById('backdrop');
  const navItems = document.querySelectorAll('[data-page]'); // كل أزرار الشريط (بما فيها sub-item)
  const phrases = [
    "السلام عليكم ورحمة الله 🌿",
    "مرحبا بكِ في رحاب الإيمان 💫",
    "زادكِ الله نورًا وطمأنينة 💛",
    "اللهم اجعل هذا اليوم بركةً وسعادة 🌸",
    "يا الله اجعل قلوبنا عامرة بذكرك 🤍"
  ];

  // أصوات موجودة في index.html
  const soundClick = document.getElementById('soundClick');    // للنقرات على الأزرار
  const soundPop   = document.getElementById('soundPop');      // لمؤثرات صغيرة (مثلاً صحيحة بالاختبار)
  const soundWhoosh= document.getElementById('soundWhoosh');   // فتح/غلق الشريط

  function playSound(audioEl){
    try{
      if(!audioEl) return;
      audioEl.currentTime = 0;
      const p = audioEl.play();
      if(p && typeof p.then === 'function') p.catch(()=>{ /* تجاهل أخطاء autoplay */ });
    }catch(e){}
  }

  // افتح/أغلق الشريط الجانبي
  function openPanel(){
    if(!sidePanel) return;
    sidePanel.classList.add('open');
    backdrop.classList.add('show');
    sidePanel.setAttribute('aria-hidden','false');
    playSound(soundWhoosh);
    // عبارة ترحيب مؤقتة
    const p = phrases[Math.floor(Math.random()*phrases.length)];
    const phrasesList = document.getElementById('phrasesList');
    if(phrasesList) phrasesList.textContent = p;
    setTimeout(()=>{ if(phrasesList) phrasesList.textContent = ''; }, 3000);
  }
  function closePanel(){
    if(!sidePanel) return;
    sidePanel.classList.remove('open');
    backdrop.classList.remove('show');
    sidePanel.setAttribute('aria-hidden','true');
    playSound(soundWhoosh);
  }

  if(openBtn) openBtn.addEventListener('click', ()=>{ openPanel(); /* صوت النقر عند الفتح */ playSound(soundClick); });
  if(closeBtn) closeBtn.addEventListener('click', ()=>{ closePanel(); playSound(soundClick); });
  if(backdrop) backdrop.addEventListener('click', ()=>{ closePanel(); playSound(soundClick); });

  // عرض صفحة حسب data-page (يحافظ على العناصر في HTML — لا يغيّرها)
  function showPage(id){
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('d-none'));
    const target = document.getElementById(id);
    if(target) target.classList.remove('d-none');
    // صوت عند التنقل (خافت)
    playSound(soundWhoosh);
    // على الشاشات الصغيرة، أغلق الشريط تلقائياً لتحسين UX
    if(window.innerWidth < 900) setTimeout(closePanel, 220);
  }

  // ربط جميع أزرار الشريط (يشمل sub-item) — لا يزيل أو يعدل أي زر
  navItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = btn.getAttribute('data-page');
      // تشغيل صوت النقر فقط (المطلوب)
      playSound(soundClick);
      // عرض الصفحة المرتبطة
      if(page) showPage(page);
    });
  });

  // تشغيل صوت على جميع الأزرار (عند الضغط فقط) — هذا يضمن أصوات موحدة لكل زر
  document.addEventListener('click', (ev) => {
    const el = ev.target;
    if(!el) return;
    // إذا العنصر زر (<button>) أو عنصر بداخله زر (مثلاً أيقونة داخل زر) — نفذ صوت النقر
    if(el.tagName === 'BUTTON' || el.closest && el.closest('button')){
      // نستخدم playSound هنا لكن تجنب تكرار عند النقر على open/close لأنهم يستدعون playSound أيضاً — التسامح مقبول
      playSound(soundClick);
    }
  }, {capture: true}); // capture لتشغيل الصوت قبل أي حدث تقطّع آخر

  // العرض الافتراضي للصفحة (يعرض dashboard كما في HTML)
  // استخدمنا id 'dashboard' كما في index.html
  document.addEventListener('DOMContentLoaded', function(){
    // اعرض الصفحة الافتراضية
    showPage('dashboard');

    // إعادة تهيئة أصغر: إظهار أرقام محفوظة إن وُجدت (الحالة موجودة في HTML/JS السابق)
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
  });

  // تصدير بسيط للتنقيح إن رغبت
  window.Oasis = { openPanel, closePanel, showPage };

})();
