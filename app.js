// app.js — النسخة الكاملة مع تشغيل الصوت عند الضغط فقط
(function(){
  "use strict";

  /* ---------- عناصر DOM ---------- */
  const openBtn = document.getElementById('openPanelBtn');
  const sidePanel = document.getElementById('sidePanel');
  const closeBtn = document.getElementById('closePanelBtn');
  const backdrop = document.getElementById('backdrop');
  const navItems = document.querySelectorAll('[data-page]');
  const phrases = [
    "السلام عليكم ورحمة الله 🌿",
    "مرحبا بكِ في رحاب الإيمان 💫",
    "زادكِ الله نورًا وطمأنينة 💛",
    "اللهم اجعل هذا اليوم بركةً وسعادة 🌸",
    "يا الله اجعل قلوبنا عامرة بذكرك 🤍"
  ];

  /* ---------- الأصوات ---------- */
  const soundClick = document.getElementById('soundClick');
  const soundPop = document.getElementById('soundPop');
  const soundWhoosh = document.getElementById('soundWhoosh');

  function play(el){
    try {
      if(!el) return;
      el.currentTime = 0;
      const playPromise = el.play();
      if(playPromise !== undefined){
        playPromise.catch(()=>{});
      }
    } catch(e){}
  }

  /* ---------- وظائف اللوحة الجانبية ---------- */
  function openPanel(){
    sidePanel.classList.add('open');
    backdrop.classList.add('show');
    sidePanel.setAttribute('aria-hidden','false');
    play(soundWhoosh);

    const p = phrases[Math.floor(Math.random()*phrases.length)];
    const phrasesList = document.getElementById('phrasesList');
    if(phrasesList) phrasesList.textContent = p;
    setTimeout(()=> {
      if(phrasesList) phrasesList.textContent = '';
    }, 3000);
  }

  function closePanel(){
    sidePanel.classList.remove('open');
    backdrop.classList.remove('show');
    sidePanel.setAttribute('aria-hidden','true');
    play(soundWhoosh);
  }

  if(openBtn) openBtn.addEventListener('click', openPanel);
  if(closeBtn) closeBtn.addEventListener('click', closePanel);
  if(backdrop) backdrop.addEventListener('click', closePanel);

  /* ---------- التنقل بين الصفحات ---------- */
  navItems.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const page = btn.getAttribute('data-page');
      document.querySelectorAll('.page-content').forEach(sec=>sec.classList.add('d-none'));
      const active = document.getElementById(page);
      if(active) active.classList.remove('d-none');
      closePanel();
      play(soundClick);
    });
  });

  /* ---------- تشغيل صوت عند الضغط على أي زر ---------- */
  document.querySelectorAll('button').forEach(button=>{
    button.addEventListener('click',()=>{
      play(soundClick);
    });
  });

  /* ---------- تحديث العبارات عند الفتح ---------- */
  window.addEventListener('load',()=>{
    const phrasesList = document.getElementById('phrasesList');
    if(phrasesList){
      const p = phrases[Math.floor(Math.random()*phrases.length)];
      phrasesList.textContent = p;
    }
  });

})();
