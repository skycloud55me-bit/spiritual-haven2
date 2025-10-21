// ==========================================================
//  الواحة الروحانية – الإصدار المُحدَّث حسب طلب المستخدم
//  1- الأدعية اليومية دفعة واحدة
//  2- الشريط جانب اليمين (CSS موجود)
//  3- تنبيه «رائع» بعد تسجيل القراءة
//  4- تفعيل أعمال الخير
//  5- استجابة أسرع لسجل التطور
// ==========================================================
(function () {
  /* ========== أدوات صغيرة ========== */
  const $ = id => document.getElementById(id);
  const escapeHTML = str => str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { } };
  const safeGet = (k, def = 0) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } };
  const playSafe = a => { try { a.currentTime = 0; a.play().catch(() => { }); } catch { } };
  const click = new Audio('assets/sounds/soft-click.mp3');
  const breeze = new Audio('assets/sounds/breeze.mp3');

  /* ========== Sidebar ========== */
  const openBtn = $('openPanelBtn');
  const sidePanel = $('sidePanel');
  const closeBtn = $('closePanelBtn');
  const backdrop = $('backdrop');
  const phrases = [
    "السلام عليكم ورحمة الله 🌿", "مرحبًا بكِ في رحاب الإيمان 💫",
    "زادكِ الله نورًا وطمأنينة 💛", "اللهم اجعل هذا اليوم بركةً وسعادة 🌸",
    "يا الله اجعل قلوبنا عامرة بذكرك 🤍"
  ];

  function openPanel() {
    sidePanel.classList.add('open'); backdrop.classList.add('show');
    sidePanel.setAttribute('aria-hidden', 'false'); playSafe(click);
    $('welcomeMsg').textContent = phrases[Math.floor(Math.random() * phrases.length)];
    $('welcomeMsg').classList.add('show'); playSafe(breeze);
    setTimeout(() => $('welcomeMsg').classList.remove('show'), 2600);
  }
  function closePanel() {
    sidePanel.classList.remove('open'); backdrop.classList.remove('show');
    sidePanel.setAttribute('aria-hidden', 'true'); openBtn.focus(); playSafe(click);
  }
  openBtn?.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  backdrop?.addEventListener('click', closePanel);

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => { showPage(btn.dataset.page); setTimeout(closePanel, 220); });
  });
  function showPage(id) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('d-none'));
    const target = $(id); if (target) target.classList.remove('d-none');
    playSafe(click);
  }
  showPage('quran');

  /* ========== قائمة ترحيبية ========== */
  phrases.forEach(ph => {
    const li = document.createElement('li'); li.style.padding = '6px 0'; li.style.color = '#6b4b0d'; li.textContent = ph;
    $('phrasesList')?.appendChild(li);
  });

  /* ========== القرآن الكريم (بدون تعديل) ========== */
  let currentAyahs = [], fontSize = 20, readerDark = false;
  async function loadSurahIndex() {
    try {
      $('surahList').innerHTML = '<div class="text-muted">جاري تحميل فهرس السور...</div>';
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const list = (await res.json()).data;
      $('surahList').innerHTML = '';
      list.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'surah-list-btn'; btn.innerHTML = `<strong>${s.number}.</strong> ${s.name} <span class="text-muted" style="float:left">${s.ayahs} آية</span>`;
        btn.addEventListener('click', () => loadSurah(s.number, `${s.englishName} — ${s.name}`, s.ayahs));
        $('surahList').appendChild(btn);
      });
    } catch { $('surahList').innerHTML = '<div class="text-danger">فشل تحميل فهرس السور.</div>'; }
  }
  async function loadSurah(num, title, ayahCount) {
    try {
      $('surahTitle').textContent = 'تحميل السورة...'; $('surahMeta').textContent = ''; $('surahText').innerHTML = ''; $('searchResults').innerHTML = '';
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/quran-uthmani`);
      const ayahs = (await res.json()).data.ayahs; currentAyahs = ayahs;
      $('surahText').innerHTML = ayahs.map(a => `<div style="margin-bottom:10px"><span style="font-weight:700;color:var(--primary)">${a.numberInSurah}.</span> <span>${escapeHTML(a.text)}</span></div>`).join('');
      $('surahTitle').textContent = `${title} (${ayahCount} آية)`; $('surahMeta').textContent = `السورة رقم ${num} — عدد الآيات: ${ayahCount}`;
      $('searchInSurah').value = ''; $('surahText').style.fontSize = fontSize + 'px';
      document.querySelector('.surah-container').scrollTop = 0; playSafe(click);
    } catch { $('surahTitle').textContent = 'فشل التحميل'; $('surahText').textContent = 'حدثت مشكلة أثناء تحميل السورة.'; }
  }
  $('searchInSurah')?.addEventListener('input', () => {
    const q = $('searchInSurah').value.trim();
    if (!q) { $('searchResults').innerHTML = ''; return; }
    const results = currentAyahs.filter(a => a.text.includes(q));
    if (!results.length) { $('searchResults').innerHTML = '<div class="text-muted">لا توجد نتائج</div>'; return; }
    const cleanQ = escapeHTML(q);
    $('searchResults').innerHTML = '<div class="text-muted">نتائج البحث:</div>' + results.map(r => `<div style="padding:6px 8px;border-radius:6px;margin-top:6px;background:rgba(255,250,235,0.8)"><strong>${r.numberInSurah}.</strong> ${escapeHTML(r.text).replace(new RegExp(cleanQ, 'g'), `<mark>${cleanQ}</mark>`)}</div>`).join('');
    playSafe(click);
  });
  $('increaseFont')?.addEventListener('click', () => { fontSize = Math.min(30, fontSize + 2); $('surahText').style.fontSize = fontSize + 'px'; playSafe(click); });
  $('decreaseFont')?.addEventListener('click', () => { fontSize = Math.max(14, fontSize - 2); $('surahText').style.fontSize = fontSize + 'px'; playSafe(click); });
  $('toggleReaderTheme')?.addEventListener('click', () => {
    readerDark = !readerDark; const container = document.querySelector('.surah-container');
    if (readerDark) { container.style.background = '#0b2b2b'; container.style.color = '#f1f1f1'; } else { container.style.background = 'rgba(255,255,255,0.98)'; container.style.color = '#111'; }
    playSafe(click);
  });
  loadSurahIndex();

  /* ========== بستان القرآن (بدون تعديل) ========== */
  const verses = [ {text:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',surah:'الرعد - 28',ex:'الذكر يطمئن القلب.'}, {text:'وَقُلْ رَبِّ زِدْنِي عِلْمًا',surah:'طه - 114',ex:'دعاء لزيادة العلم.'}, {text:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',surah:'الشرح - 5',ex:'التوكّل والصبر.'} ];
  const duasG = { knowledge:['اللهم أنفعنا بالعلم وعلّمنا ما ينفعنا','اللهم ارزقنا علمًا نافعًا وعملاً متقبلاً'], ease:['اللهم لا سهل إلا ما جعلته سهلاً','اللهم فكّ كربتي ويسّر أمري'], worries:['اللهم الطمأنينة لقلبي','اللهم فرّج همّي واغفر لي'], general:['اللهم اغفر لنا وارحمنا','اللهم اهدنا واجعلنا من الصالحين'] };
  $('newVerseBtn')?.addEventListener('click', () => { const v = verses[Math.floor(Math.random()*verses.length)]; $('dailyVerse').textContent = `"${v.text}"`; $('verseSurah').textContent = v.surah; $('verseExplanation').textContent = v.ex; playSafe(click); });
  $('newDuaBtn')?.addEventListener('click', () => { const cat = $('duaCategory').value; let list = cat === 'all' ? Object.values(duasG).flat() : (duasG[cat] || []); const d = list[Math.floor(Math.random()*list.length)]; if (d) { $('duaText').textContent = d; $('duaCategoryText').textContent = 'نوع الدعاء: ' + (cat === 'all' ? 'عام' : $('duaCategory').selectedOptions[0].text); playSafe(click); } });
  const pagesGoalEl = $('pagesGoal');
  if (pagesGoalEl) {
    pagesGoalEl.addEventListener('input', () => { $('goalValue').textContent = pagesGoalEl.value; safeSet('oasis_pagesGoal', pagesGoalEl.value); playSafe(click); });
    $('recordReadingBtn')?.addEventListener('click', () => {
      const added = Math.max(1, Math.round(Math.random() * (parseInt(pagesGoalEl.value) || 1)));
      state.quranPages += added; safeSet('oasis_pages', state.quranPages);
      $('quranPages').textContent = state.quranPages;
      $('achievementsList').insertAdjacentHTML('afterbegin', `<li class="list-group-item">قراءة: +${added} صفحة - ${today()}</li>`);
      // تنبيه تشجيعي
      const praise = ['رائع!','ممتاز!','بارك الله فيك!','أحسنت!','تقبل الله منك!'];
      alert(praise[Math.floor(Math.random()*praise.length)]);
      playSafe(click); calcProgress();
    });
  }

  /* ========== رياض الصالحين (تفعيل أعمال الخير) ========== */
  $('recordDeedBtn')?.addEventListener('click', () => {
    state.goodDeeds++; safeSet('oasis_deeds', state.goodDeeds);
    $('goodDeeds').textContent = state.goodDeeds;
    const praise = ['رائع!','جزاكِ الله خيرًا!','ممتاز!','بارك الله فيكِ!'];
    alert(praise[Math.floor(Math.random()*praise.length)]);
    playSafe(click); calcProgress();
  });
  $('calculatePrayerBtn')?.addEventListener('click', () => {
    const c = document.querySelectorAll('.prayer-check:checked').length;
    if (c === 5) { state.prayerStreak++; safeSet('oasis_prayer', state.prayerStreak); $('prayerStreak').textContent = state.prayerStreak; playSafe(click); alert('مبروك! سلسلة الصلاة زادت'); }
    else { playSafe(click); alert(`تم احتساب الصلوات (${c}/5)`); }
    calcProgress();
  });

  /* ========== جنات الطاعة – دعاء الخير + عبادات (بدون زر التالي) ========== */
  const duasKhayr = [...Array(30)].map((_, i) => `اللهم اجعلنا من أهل الخير والبركة ${i + 1}`);
  const azkarOps  = [...Array(30)].map((_, i) => `ذكر مستحب رقم ${i + 1}`);
  // عرضها دفعة واحدة
  const duaContainer   = $('duaDailyText');
  const azkarContainer = $('worshipDailyText');
  if (duaContainer)   duaContainer.innerHTML   = '<ul class="list-unstyled">' + duasKhayr.map(d => `<li class="mb-2">${d}</li>`).join('') + '</ul>';
  if (azkarContainer) azkarContainer.innerHTML = '<ul class="list-unstyled">' + azkarOps.map(z => `<li class="mb-2">${z}</li>`).join('') + '</ul>';

  /* ========== الألعاب – نفس الشيء السابق ========== */
  /* تبويبات الألعاب */
  document.querySelectorAll('[data-game-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-game-tab]').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('[data-game-pane]').forEach(p => p.classList.add('d-none'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.gameTab)?.classList.remove('d-none');
      playSafe(click);
    });
  });

  /* لعبة الذاكرة */
  const memoryBoard = $('memoryBoard');
  function createMemoryBoard() {
    memoryBoard.innerHTML = '';
    const symbols = ['★', '✿', '☪', '✦', '❤', '☀', '✈', '✧'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    cards.forEach(s => {
      const col = document.createElement('div'); col.className = 'col-3';
      const card = document.createElement('div'); card.className = 'memory-card islamic-card text-center';
      card.dataset.symbol = s; card.textContent = '?'; card.addEventListener('click', onFlip);
      col.appendChild(card); memoryBoard.appendChild(col);
    });
  }
  let first = null, second = null, lock = false;
  function onFlip(e) {
    if (lock) return; const el = e.currentTarget; if (el === first) return;
    el.textContent = el.dataset.symbol; el.classList.add('flipped');
    if (!first) { first = el; return; } second = el; lock = true;
    setTimeout(() => {
      if (first.dataset.symbol === second.dataset.symbol) {
        first.style.display = 'none'; second.style.display = 'none';
        state.gameScore += 10; safeSet('oasis_game', state.gameScore); $('gameScore').textContent = state.gameScore; playSafe(click);
      } else {
        first.textContent = '?'; second.textContent = '?'; first.classList.remove('flipped'); second.classList.remove('flipped');
      }
      first = null; second = null; lock = false;
    }, 800);
  }
  $('newGameBtn')?.addEventListener('click', () => { createMemoryBoard(); state.gameScore = 0; safeSet('oasis_game', 0); $('gameScore').textContent = 0; playSafe(click); });
  createMemoryBoard();

  /* اختبار يومي – ٩ أسئلة */
  const quizPool = [ /* نفس الأسئلة السابقة */ ];
  let todayQuiz = [], currentQ = 0, quizScore = 0;
  function generateTodayQuiz() {
    const seed = new Date().toISOString().slice(0, 10);
    let hash = 0; for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i) | 0;
    const shuf = [...quizPool]; shuf.sort(() => (hash & 1 ? 1 : -1));
    todayQuiz = shuf.slice(0, 9); currentQ = 0; quizScore = 0; renderQuizQuestion();
  }
  function renderQuizQuestion() {
    if (currentQ >= todayQuiz.length) { $('quizArea').innerHTML = `<div class="alert alert-success">انتهى الاختبار – نتيجتك: ${quizScore}/9</div>`; return; }
    const q = todayQuiz[currentQ];
    $('quizQuestion').textContent = `${currentQ + 1}. ${q.q}`;
    const optsDiv = $('quizOptions'); optsDiv.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button'); btn.className = 'btn btn-outline-primary btn-sm mb-1 w-100'; btn.textContent = opt;
      btn.addEventListener('click', () => { if (i === q.a) quizScore++; currentQ++; renderQuizQuestion(); playSafe(click); });
      optsDiv.appendChild(btn);
    });
  }
  $('startDailyQuiz')?.addEventListener('click', () => { generateTodayQuiz(); playSafe(click); });
  $('nextQBtn')?.addEventListener('click', () => { renderQuizQuestion(); playSafe(click); });
  generateTodayQuiz();

  /* لعبة أين الآية – نفس السابق */
  const ayahSamples = [ /* نفس العينات السابقة */ ];
  let currentAyahGame = {};
  function loadAyahGame() {
    currentAyahGame = ayahSamples[Math.floor(Math.random() * ayahSamples.length)];
    $('ayahGameText').textContent = `"${currentAyahGame.text}"`;
    const choices = [currentAyahGame.surah];
    while (choices.length < 3) { const r = ayahSamples[Math.floor(Math.random() * ayahSamples.length)].surah; if (!choices.includes(r)) choices.push(r); }
    choices.sort(() => Math.random() - 0.5);
    const container = $('ayahGameChoices'); container.innerHTML = '';
    choices.forEach(ch => {
      const btn = document.createElement('button'); btn.className = 'btn btn-outline-success btn-sm mb-1 w-100'; btn.textContent = ch;
      btn.addEventListener('click', () => {
        if (ch === currentAyahGame.surah) { state.gameScore += 5; safeSet('oasis_game', state.gameScore); $('gameScore').textContent = state.gameScore; alert('صحيح!'); }
        else alert(`الإجابة الصحيحة: ${currentAyahGame.surah}`);
        loadAyahGame(); playSafe(click); calcProgress();
      });
      container.appendChild(btn);
    });
  }
  $('newAyahGame')?.addEventListener('click', () => { loadAyahGame(); playSafe(click); });
  loadAyahGame();

  /* ========== سجل التطور – استجابة سريعة ========== */
  const achievementsList = $('achievementsList');
  function today() { return new Date().toLocaleDateString('ar-EG'); }
  let state = {
    prayerStreak: safeGet('oasis_prayer', 0),
    goodDeeds:  safeGet('oasis_deeds', 0),
    quranPages: safeGet('oasis_pages', 0),
    gameScore:  safeGet('oasis_game', 0)
  };
  $('prayerStreak').textContent = state.prayerStreak;
  $('goodDeeds').textContent  = state.goodDeeds;
  $('quranPages').textContent = state.quranPages;
  $('gameScore').textContent  = state.gameScore;

  function calcProgress() {
    const total = (state.prayerStreak * 10) + (state.goodDeeds * 3) + (state.quranPages * 2) + state.gameScore;
    const max = 1000; // قابل للتعديل
    const pct = Math.min(100, Math.round((total / max) * 100));
    $('progressPercent').textContent = `${pct}%`;
    $('progressBar').style.width = `${pct}%`;
    $('progressBar').setAttribute('aria-valuenow', pct);
  }
  calcProgress();

  /* ========== الأدعية اليومية – دفعة واحدة ========== */
  const dailyDuas = [
    {title:'دعاء الاستيقاظ',text:'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور'},
    {title:'دعاء دخول الخلاء',text:'بسم الله، اللهم إني أعوذ بك من الخبث والخبائث'},
    {title:'دعاء الخروج من الخلاء',text:'غفرانك'},
    {title:'دعاء الوضوء',text:'اللهم اجعلني من التوابين واجعلني من المتطهرين'},
    {title:'دعاء دخول المسجد',text:'اللهم افتح لي أبواب رحمتك'},
    {title:'دعاء الخروج من المسجد',text:'اللهم إني أسألك من فضلك'},
    {title:'دعاء الرياح الشديدة',text:'اللهم إني أسألك خيرها وخير ما فيها وخير ما أُرسلت به'},
    {title:'دعاء الرعد',text:'سبحان الذي يسبح الرعد بحمده والملائكة من خيفته'},
    {title:'دعاء الهم والحزن',text:'اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل'},
    {title:'دعاء الكرب',text:'لا إله إلا الله الحليم الكريم'},
    {title:'دعاء دخول السوق',text:'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد'},
    {title:'دعاء ركوب السيارة',text:'سبحان الذي سخر لنا هذا وما كنا له مقرنين'},
    {title:'دعاء السفر',text:'اللهم إنا نسألك في سفرنا هذا البر والتقوى'},
    {title:'دعاء من خاف من قوم',text:'اللهم اكفناهم بما شئت'},
    {title:'دعاء دخول القرية',text:'اللهم رب السماوات السبع ورب الأرضين السبع'},
    {title:'دعاء المنزل الجديد',text:'اللهم إني أعوذ بك من شر هذا المنزل وشر ما فيه'},
    {title:'دعاء لبس الثوب',text:'الحمد لله الذي كساني هذا و رزقنيه من غير حول مني ولا قوة'},
    {title:'دعاء خلع الثوب',text:'بسم الله الذي لا إله إلا هو'},
    {title:'دعاء النوم',text:'باسمك اللهم أموت وأحيا'},
    {title:'دعاء الاستيقاظ',text:'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور'},
    {title:'دعاء القنوت',text:'اللهم اهدنا فيمن هديت، وعافنا فيمن عافيت'},
    {title:'دعاء الاستسقاء',text:'اللهم اسقنا غيثًا مغيثًا مريئًا'},
    {title:'دعاء إفطار الصائم',text:'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله'},
    {title:'دعاء الصائم إذا زُلِّغ على لسانه',text:'اللهم إني صمت عن كل ما تحرم، فاغفر لي ما أحللت'},
    {title:'دعاء الخوف من الشرك',text:'اللهم إنا نعوذ بك أن نشرك بك شيئًا نعلمه'},
    {title:'دعاء الخوف من الظلم',text:'اللهم إنا نعوذ بك من الظلم، ومن أن نُظلم'},
    {title:'دعاء قنوت النوازل',text:'اللهم إنا نجعلك في نحورهم، ونعوذ بك من شرورهم'},
    {title:'دعاء رؤية الهلال',text:'اللهم أهله علينا بالأمن والإيمان'},
    {title:'دعاء رؤية الكعبة',text:'اللهم زد هذا البيت تشريفًا وتعظيمًا'},
    {title:'دعاء التعجب والسجود',text:'سبحان ربي الأعلى'},
    {title:'دعاء سجود التلاوة',text:'سبحان الذي لا ينام ولا يغفور'},
    {title:'دعاء الختمة',text:'اللهم اجعل القرآن ربيع قلوبنا، وجلاء حزننا'}
  ];
  // عرضها دفعة واحدة
  const dailyDuaContainer = $('dailyDuaContainer');
  if (dailyDuaContainer) {
    dailyDuaContainer.innerHTML = dailyDuas.map(d => `
      <div class="dua-card mb-2">
        <h6 class="mb-1">${d.title}</h6>
        <p class="mb-0">${d.text}</p>
      </div>
    `).join('');
  }

  /* ========== نهاية الملف ========== */
  window.Oasis = { openPanel, closePanel, loadSurahIndex, state };
})();
