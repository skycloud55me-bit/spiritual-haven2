// ==========================================================
//  الواحة الروحانية – الإصدار المُصَحَّح والمُطوَّر
// ==========================================================
(function () {
  /* ========== عناصر عامة ========== */
  const openBtn        = document.getElementById('openPanelBtn');
  const sidePanel      = document.getElementById('sidePanel');
  const closeBtn       = document.getElementById('closePanelBtn');
  const backdrop       = document.getElementById('backdrop');
  const navItems       = document.querySelectorAll('.nav-item');
  const welcomeMsg     = document.getElementById('welcomeMsg');

  const phrases = [
    "السلام عليكم ورحمة الله 🌿","مرحبًا بكِ في رحاب الإيمان 💫",
    "زادكِ الله نورًا وطمأنينة 💛","اللهم اجعل هذا اليوم بركةً وسعادة 🌸",
    "يا الله اجعل قلوبنا عامرة بذكرك 🤍"
  ];

  /* ========== صوتيات خفيفة ========== */
  const click  = new Audio('assets/sounds/soft-click.mp3');
  const breeze = new Audio('assets/sounds/breeze.mp3');
  function playSafe(a){ try{ a.currentTime=0; a.play().catch(()=>{}); }catch(e){} }

  /* ========== Sidebar ========== */
  function openPanel(){
    sidePanel.classList.add('open');
    backdrop.classList.add('show');
    sidePanel.setAttribute('aria-hidden','false');
    playSafe(click);
    welcomeMsg.textContent = phrases[Math.floor(Math.random()*phrases.length)];
    welcomeMsg.classList.add('show');
    playSafe(breeze);
    setTimeout(()=> welcomeMsg.classList.remove('show'), 2600);
  }
  function closePanel(){
    sidePanel.classList.remove('open');
    backdrop.classList.remove('show');
    sidePanel.setAttribute('aria-hidden','true');
    openBtn.focus();
    playSafe(click);
  }
  openBtn?.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  backdrop?.addEventListener('click', closePanel);

  /* ========== التنقُّب بين الصفحات ========== */
  navItems.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const page = btn.dataset.page;
      showPage(page);
      setTimeout(closePanel,220);
    });
  });
  function showPage(id){
    document.querySelectorAll('.page-content').forEach(p=>p.classList.add('d-none'));
    const target = document.getElementById(id);
    if(target) target.classList.remove('d-none');
    playSafe(click);
  }
  showPage('quran'); // الصفحة الافتراضية

  /* ========== قائمة العبارات الترحيبية ========== */
  const phrasesList = document.getElementById('phrasesList');
  phrases.forEach(ph=>{
    const li = document.createElement('li');
    li.style.padding='6px 0'; li.style.color='#6b4b0d'; li.textContent=ph;
    phrasesList.appendChild(li);
  });

  /* ==========================================================
     ١) القرآن الكريم – بدون تعديل
     ========================================================== */
  const surahList      = document.getElementById('surahList');
  const surahTitle     = document.getElementById('surahTitle');
  const surahMeta      = document.getElementById('surahMeta');
  const surahText      = document.getElementById('surahText');
  const searchInSurah  = document.getElementById('searchInSurah');
  const searchResults  = document.getElementById('searchResults');
  let currentAyahs=[], fontSize=20, readerDark=false;

  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  async function loadSurahIndex(){
    try{
      surahList.innerHTML='<div class="text-muted">جاري تحميل فهرس السور...</div>';
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const json= await res.json();
      const list= json.data;
      surahList.innerHTML='';
      list.forEach(s=>{
        const btn=document.createElement('button');
        btn.className='surah-list-btn';
        btn.innerHTML=`<strong>${s.number}.</strong> ${s.name} <span class="text-muted" style="float:left">${s.ayahs} آية</span>`;
        btn.addEventListener('click',()=>loadSurah(s.number, s.englishName+' — '+s.name, s.ayahs));
        surahList.appendChild(btn);
      });
    }catch(err){
      surahList.innerHTML='<div class="text-danger">فشل تحميل فهرس السور.</div>';
      console.error('[Oasis]',err);
    }
  }
  async function loadSurah(num,title,ayahCount){
    try{
      surahTitle.textContent='تحميل السورة...';
      surahMeta.textContent=''; surahText.innerHTML=''; searchResults.innerHTML='';
      const res=await fetch('https://api.alquran.cloud/v1/surah/'+num+'/quran-uthmani');
      const json=await res.json();
      const ayahs=json.data.ayahs;
      currentAyahs=ayahs;
      const html=ayahs.map(a=>
        `<div style="margin-bottom:10px"><span style="font-weight:700;color:var(--primary)">${a.numberInSurah}.</span> <span>${escapeHtml(a.text)}</span></div>`
      ).join('');
      surahText.innerHTML=html;
      surahTitle.textContent=`${title} (${ayahCount} آية)`;
      surahMeta.textContent=`السورة رقم ${num} — عدد الآيات: ${ayahCount}`;
      if(searchInSurah) searchInSurah.value='';
      surahText.style.fontSize=fontSize+'px';
      document.querySelector('.surah-container').scrollTop=0;
      playSafe(click);
    }catch(e){
      surahTitle.textContent='فشل التحميل';
      surahText.textContent='حدثت مشكلة أثناء تحميل السورة.';
      console.error('[Oasis]',e);
    }
  }
  searchInSurah?.addEventListener('input',()=>{
    const q=searchInSurah.value.trim();
    if(!q){ searchResults.innerHTML=''; return; }
    const results=[];
    currentAyahs.forEach(a=>{ if(a.text.includes(q)) results.push({num:a.numberInSurah,text:a.text}); });
    if(results.length===0){ searchResults.innerHTML='<div class="text-muted">لا توجد نتائج</div>'; return; }
    const cleanQ=escapeHtml(q);
    searchResults.innerHTML='<div class="text-muted">نتائج البحث:</div>'+
      results.map(r=>{
        const highlighted=escapeHtml(r.text).replace(new RegExp(cleanQ,'g'),`<mark>${cleanQ}</mark>`);
        return `<div style="padding:6px 8px;border-radius:6px;margin-top:6px;background:rgba(255,250,235,0.8)"><strong>${r.num}.</strong> ${highlighted}</div>`;
      }).join('');
    playSafe(click);
  });
  document.getElementById('increaseFont')?.addEventListener('click',()=>{
    fontSize=Math.min(30,fontSize+2); surahText.style.fontSize=fontSize+'px'; playSafe(click);
  });
  document.getElementById('decreaseFont')?.addEventListener('click',()=>{
    fontSize=Math.max(14,fontSize-2); surahText.style.fontSize=fontSize+'px'; playSafe(click);
  });
  document.getElementById('toggleReaderTheme')?.addEventListener('click',()=>{
    readerDark=!readerDark;
    const container=document.querySelector('.surah-container');
    if(readerDark){ container.style.background='#0b2b2b'; container.style.color='#f1f1f1'; }
    else { container.style.background='rgba(255,255,255,0.98)'; container.style.color='#111'; }
    playSafe(click);
  });
  loadSurahIndex();

  /* ==========================================================
     ٢) بستان القرآن – بدون تعديل
     ========================================================== */
  const verses=[
    {text:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',surah:'الرعد - 28',ex:'الذكر يطمئن القلب.'},
    {text:'وَقُلْ رَبِّ زِدْنِي عِلْمًا',surah:'طه - 114',ex:'دعاء لزيادة العلم.'},
    {text:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',surah:'الشرح - 5',ex:'التوكّل والصبر.'}
  ];
  const duasG={
    knowledge:['اللهم أنفعنا بالعلم وعلّمنا ما ينفعنا','اللهم ارزقنا علمًا نافعًا وعملاً متقبلاً'],
    ease:['اللهم لا سهل إلا ما جعلته سهلاً','اللهم فكّ كربتي ويسّر أمري'],
    worries:['اللهم الطمأنينة لقلبي','اللهم فرّج همّي واغفر لي'],
    general:['اللهم اغفر لنا وارحمنا','اللهم اهدنا واجعلنا من الصالحين']
  };
  document.getElementById('newVerseBtn')?.addEventListener('click',()=>{
    const v=verses[Math.floor(Math.random()*verses.length)];
    document.getElementById('dailyVerse').textContent='"'+v.text+'"';
    document.getElementById('verseSurah').textContent=v.surah;
    document.getElementById('verseExplanation').textContent=v.ex;
    playSafe(click);
  });
  document.getElementById('newDuaBtn')?.addEventListener('click',()=>{
    const cat=document.getElementById('duaCategory').value;
    let list=[];
    if(cat==='all') Object.values(duasG).forEach(a=>list=list.concat(a));
    else list=duasG[cat]||[];
    const d=list[Math.floor(Math.random()*list.length)];
    if(d){ document.getElementById('duaText').textContent=d; document.getElementById('duaCategoryText').textContent='نوع الدعاء: '+(cat==='all'?'عام':document.getElementById('duaCategory').selectedOptions[0].text); playSafe(click); }
  });
  const pagesGoalEl=document.getElementById('pagesGoal');
  if(pagesGoalEl){
    pagesGoalEl.addEventListener('input',()=>{
      document.getElementById('goalValue').textContent=pagesGoalEl.value;
      safeSet('oasis_pagesGoal',pagesGoalEl.value);
      playSafe(click);
    });
    document.getElementById('recordReadingBtn')?.addEventListener('click',()=>{
      const added=Math.max(1,Math.round(Math.random()*(parseInt(pagesGoalEl.value)||1)));
      state.quranPages+=added; safeSet('oasis_pages',state.quranPages);
      document.getElementById('quranPages').textContent=state.quranPages;
      achievementsList.insertAdjacentHTML('afterbegin',`<li class="list-group-item">قراءة: +${added} صفحة - ${today()}</li>`);
      playSafe(click);
    });
  }

  /* ==========================================================
     ٣) رياض الصالحين – بدون تعديل
     ========================================================== */
  document.getElementById('recordDeedBtn')?.addEventListener('click',()=>{
    state.goodDeeds++; safeSet('oasis_deeds',state.goodDeeds);
    document.getElementById('goodDeeds').textContent=state.goodDeeds;
    playSafe(click);
  });
  document.getElementById('calculatePrayerBtn')?.addEventListener('click',()=>{
    const checks=document.querySelectorAll('.prayer-check');
    let c=0; checks.forEach(ch=>{ if(ch.checked) c++; });
    if(c===5){ state.prayerStreak++; safeSet('oasis_prayer',state.prayerStreak); document.getElementById('prayerStreak').textContent=state.prayerStreak; playSafe(click); alert('مبروك! سلسلة الصلاة زادت'); }
    else { playSafe(click); alert(`تم احتساب الصلوات (${c}/5)`); }
  });

  /* ==========================================================
     ٤) جنات الطاعة – توسيع دعاء الخير + العبادات
     ========================================================== */
  const duasKhayr=[
    "اللهم إنا نسألك الخير كله، عاجله وآجله، ما علمنا منه وما لم نعلم",
    "اللهم اجعل لنا في كل هم فرجًا، وفي كل ضيق مخرجًا، وارزقنا من حيث لا نحتسب",
    "اللهم اغفر لنا ذنوبنا، ويسر لنا أمورنا، وثبت أقدامنا، وانصرنا على القوم الكافرين",
    "اللهم إنا نسألك العفو والعافية في الدنيا والآخرة",
    "اللهم اجعل أوسع رزقك علينا عند كبر سننا وضعف قوانا",
    "اللهم اجعلنا من الذين إذا أحسنوا استبشروا، وإذا أساؤوا استغفروا",
    "اللهم اجعلنا ممن ينظرون في عيوبهم قبل عيوب الناس",
    "اللهم أصلح لنا شأننا كله، ولا تكلنا إلى أنفسنا طرفة عين",
    "اللهم اجعل القرآن ربيع قلوبنا، وجلاء حزننا، وذهاب همومنا",
    "اللهم إنا نسألك الهداية والتقى، والعفة والغنى",
    "اللهم اجعل لنا من كل هم فرجًا، ومن كل ضيق مخرجًا، وارزقنا رزقًا حلالًا طيبًا",
    "اللهم اجعلنا ممن إذا نظروا إلى أنفسهم عابروها، وإذا نظروا إلى الناس شفقوا عليهم",
    "اللهم اجعلنا ممن يخافونك سرًّا كما يخافون علانية",
    "اللهم اجعلنا من الذين يقيمون الصلاة، ويؤتون الزكاة، وهم بآخرتهم يوقنون",
    "اللهم اجعلنا ممن يأمرون بالمعروف وينهون عن المنكر، ويصبرون على ما أصابهم",
    "اللهم اجعلنا ممن يعفون عن الناس، ويحبون أن يعفو الله عنهم",
    "اللهم اجعلنا ممن يرجون رحمتك، ويخافون عذابك، ويؤمنون بوعدك",
    "اللهم اجعلنا ممن يستمعون القول فيتبعون أحسنه",
    "اللهم اجعلنا ممن يعظمون حرماتك، ويحفظون أوامرك، ويتركون نواهيك",
    "اللهم اجعلنا ممن يتذكرونك كثيرًا، ويذكرونك سرًّا وجهارًا",
    "اللهم اجعلنا ممن يحبونك حبًا لا يشوبه جفاء، ولا ينقصه ملل",
    "اللهم اجعلنا ممن يستقيمون على صراطك المستقيم، ولا يزيغون عنه",
    "اللهم اجعلنا ممن يصبرون على طاعتك، ولا يملّون من عبادتك",
    "اللهم اجعلنا ممن يرحمون الضعفاء، ويؤوون المظلومين، ويغيثون الملهوفين",
    "اللهم اجعلنا ممن يحبون أن يلقاكم الله وأنتم عنهم راضون",
    "اللهم اجعلنا ممن يستشعرون عظمتك في كل لحظة، ويخشونك حق الخشية",
    "اللهم اجعلنا ممن يتوبون إليك توبة نصوحًا، لا يعودون إلى الذنب بعدها",
    "اللهم اجعلنا ممن يُحبُّون الصدق، ويكرهون الكذب، ويستقيمون في أقوالهم",
    "اللهم اجعلنا ممن يُصلحون ذات بينهم، ويُحبُّون أن تكون أمة نبينا محمد ﷺ واحدة",
    "اللهم اجعلنا ممن يدعونك رغبًا ورهبًا، ويتضرعون إليك خوفًا وطمعًا"
  ];
  const azkarOps=[
    "استغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
    "اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام",
    "سبحان الله وبحمده عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته",
    "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
    "اللهم صلِّ وسلّم على نبينا محمد ﷺ",
    "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور",
    "اللهم إني أسألك علمًا نافعًا، ورزقًا طيبًا، وعملًا متقبلاً",
    "اللهم بارك لنا في يومنا هذا، وبارك لنا في ليلتنا هذه",
    "اللهم اجعلنا من أهل القرآن، الذين هم أهلك وخاصتك",
    "اللهم أجرنا من النار، وأدخلنا الجنة مع الأبرار",
    "اللهم اجعلنا من الذين يتقونك سرًّا وعلانية، ويحافظون على صلواتهم",
    "اللهم اجعلنا ممن يُصلحون ذات بينهم، ويُقيمون الصلاة، ويُؤتون الزكاة",
    "اللهم أعنا على ذكرك وشكرك وحُسْنِ عبادتك",
    "اللهم اجعلنا من الذين يستمعون القول فيتبعون أحسنه",
    "اللهم اجعلنا ممن يرحمون، فارحمهم الرحمن، واغفر لنا ذنوبنا",
    "اللهم إنا نسألك العفو والعافية في الدنيا والآخرة",
    "اللهم اجعلنا ممن يُحبُّون أن يلقاكم الله وأنتم عنهم راضون",
    "اللهم اجعلنا ممن يُصلحون ذات بينهم، ويُحبُّون أن تكون أمة نبينا محمد ﷺ واحدة",
    "اللهم اجعلنا ممن يدعونك رغبًا ورهبًا، ويتضرعون إليك خوفًا وطمعًا",
    "اللهم اجعلنا ممن يستقيمون على صراطك المستقيم، ولا يزيغون عنه",
    "اللهم اجعلنا ممن يصبرون على طاعتك، ولا يملّون من عبادتك",
    "اللهم اجعلنا ممن يرحمون الضعفاء، ويؤوون المظلومين، ويغيثون الملهوفين",
    "اللهم اجعلنا ممن يحبون أن يلقاكم الله وأنتم عنهم راضون",
    "اللهم اجعلنا ممن يستشعرون عظمتك في كل لحظة، ويخشونك حق الخشية",
    "اللهم اجعلنا ممن يتوبون إليك توبة نصوحًا، لا يعودون إلى الذنب بعدها",
    "اللهم اجعلنا ممن يُحبُّون الصدق، ويكرهون الكذب، ويستقيمون في أقوالهم",
    "اللهم اجعلنا ممن يُصلحون ذات بينهم، ويُحبُّون أن تكون أمة نبينا محمد ﷺ واحدة",
    "اللهم اجعلنا ممن يدعونك رغبًا ورهبًا، ويتضرعون إليك خوفًا وطمعًا",
    "اللهم اجعلنا ممن يستقيمون على صراطك المستقيم، ولا يزيغون عنه",
    "اللهم اجعلنا ممن يصبرون على طاعتك، ولا يملّون من عبادتك"
  ];
  let azkarIndex=0, duaIndex=0;
  const duaContainer=document.getElementById('duaDailyText');
  const azkarContainer=document.getElementById('worshipDailyText');
  function loadDuaDaily(){
    duaContainer.textContent=duasKhayr[duaIndex];
    duaIndex=(duaIndex+1)%duasKhayr.length;
  }
  function loadAzkarDaily(){
    azkarContainer.textContent=azkarOps[azkarIndex];
    azkarIndex=(azkarIndex+1)%azkarOps.length;
  }
  document.getElementById('nextDuaDaily')?.addEventListener('click',()=>{ loadDuaDaily(); playSafe(click); });
  document.getElementById('nextWorshipDaily')?.addEventListener('click',()=>{ loadAzkarDaily(); playSafe(click); });
  loadDuaDaily(); loadAzkarDaily();

  /* ==========================================================
     ٥) الألعاب التربوية – إعادة هيكلة كاملة
     ========================================================== */
  /* -- تبويبات الألعاب -- */
  const gameTabs=document.querySelectorAll('[data-game-tab]');
  const gamePanes=document.querySelectorAll('[data-game-pane]');
  gameTabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      const target=tab.dataset.gameTab;
      gameTabs.forEach(t=>t.classList.remove('active'));
      gamePanes.forEach(p=>p.classList.add('d-none'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.remove('d-none');
      playSafe(click);
    });
  });

  /* -- لعبة الذاكرة – كما هي مع التحسين البسيط -- */
  const memoryBoard=document.getElementById('memoryBoard');
  function createMemoryBoard(){
    memoryBoard.innerHTML='';
    const symbols=['★','✿','☪','✦','❤','☀','✈','✧'];
    const cards=symbols.concat(symbols);
    cards.sort(()=>Math.random()-0.5);
    cards.forEach(s=>{
      const col=document.createElement('div'); col.className='col-3';
      const card=document.createElement('div');
      card.className='memory-card islamic-card text-center';
      card.dataset.symbol=s; card.textContent='?';
      card.addEventListener('click',onFlip);
      col.appendChild(card); memoryBoard.appendChild(col);
    });
  }
  let first=null, second=null, lock=false;
  function onFlip(e){
    if(lock) return;
    const el=e.currentTarget;
    if(el===first) return;
    el.textContent=el.dataset.symbol; el.classList.add('flipped');
    if(!first){ first=el; return; }
    second=el; lock=true;
    setTimeout(()=>{
      if(first.dataset.symbol===second.dataset.symbol){
        first.style.display='none'; second.style.display='none';
        state.gameScore+=10; safeSet('oasis_game',state.gameScore);
        document.getElementById('gameScore').textContent=state.gameScore;
        playSafe(click);
      }else{
        first.textContent='?'; second.textContent='?';
        first.classList.remove('flipped'); second.classList.remove('flipped');
      }
      first=null; second=null; lock=false;
    },800);
  }
  document.getElementById('newGameBtn')?.addEventListener('click',()=>{
    createMemoryBoard(); state.gameScore=0; safeSet('oasis_game',0);
    document.getElementById('gameScore').textContent=0; playSafe(click);
  });
  createMemoryBoard();

  /* -- اختبار يومي – ٩ أسئلة جديدة كل يوم -- */
  const quizPool=[
    {q:'من أول من آمن بالنبي ﷺ من الصبيان؟',opts:['علي بن أبي طالب','زيد بن حارثة','جعفر بن أبي طالب'],a:0},
    {q:'كم عدد آيات سورة الكوثر؟',opts:['ثلاث','أربع','خمس'],a:0},
    {q:'ما السورة التي تُسمى عروس القرآن؟',opts:['سورة الرحمن','سورة الإخلاص','سورة الفاتحة'],a:0},
    {q:'من آخر من توفي من الصحابة؟',opts:['أبو بكر الصديق','الإمام علي','سعد بن أبي وقاص'],a:2},
    {q:'كم مرة ذُكرت كلمة "الجنة" في القرآن؟',opts:['٦٦ مرة','٧٧ مرة','٨٨ مرة'],a:0},
    {q:'ما اسم أول مسجد بُني في الإسلام؟',opts:['مسجد قباء','المسجد النبوي','المسجد الحرام'],a:0},
    {q:'كم عدد ركعات صلاة الكسوف؟',opts:['ركعتان','ركعتان مضاعفتان','أربع ركعات'],a:1},
    {q:'ما السورة التي لا تبدأ بالبسملة؟',opts:['سورة التوبة','سورة الأنفال','سورة الإخلاص'],a:0},
    {q:'من هو النبي الذي ابتلعه الحوت؟',opts:['يونس عليه السلام','نوح عليه السلام','موسى عليه السلام'],a:0}
  ];
  let todayQuiz=[], currentQ=0, quizScore=0;
  function generateTodayQuiz(){
    const seed=new Date().toISOString().slice(0,10); // yyyy-mm-dd
    let hash=0; for(let i=0;i<seed.length;i++) hash=((hash<<5)-hash)+seed.charCodeAt(i)|0;
    const shuf=[...quizPool]; shuf.sort(()=> (hash & 1 ? 1:-1));
    todayQuiz=shuf.slice(0,9);
    currentQ=0; quizScore=0;
    renderQuizQuestion();
  }
  function renderQuizQuestion(){
    if(currentQ>=todayQuiz.length){ document.getElementById('quizArea').innerHTML=`<div class="alert alert-success">انتهى الاختبار! نتيجتك: ${quizScore}/9</div>`; return; }
    const q=todayQuiz[currentQ];
    document.getElementById('quizQuestion').textContent=`${currentQ+1}. ${q.q}`;
    const optsDiv=document.getElementById('quizOptions');
    optsDiv.innerHTML='';
    q.opts.forEach((opt,i)=>{
      const btn=document.createElement('button');
      btn.className='btn btn-outline-primary btn-sm mb-1 w-100';
      btn.textContent=opt;
      btn.addEventListener('click',()=>{
        if(i===q.a) quizScore++;
        currentQ++; renderQuizQuestion(); playSafe(click);
      });
      optsDiv.appendChild(btn);
    });
  }
  document.getElementById('startDailyQuiz')?.addEventListener('click',()=>{ generateTodayQuiz(); playSafe(click); });
  generateTodayQuiz(); // أول مرة تلقائيًا

  /* -- لعبة جديدة: "أين الآية؟" -- */
  const ayahSamples=[
    {text:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',surah:'الشرح'},
    {text:'وَقُلْ رَبِّ زِدْنِي عِلْمًا',surah:'طه'},
    {text:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',surah:'الرعد'},
    {text:'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',surah:'النور'},
    {text:'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',surah:'العصر'}
  ];
  let currentAyahGame={};
  function loadAyahGame(){
    currentAyahGame=ayahSamples[Math.floor(Math.random()*ayahSamples.length)];
    document.getElementById('ayahGameText').textContent=`"${currentAyahGame.text}"`;
    const choices=[currentAyahGame.surah];
    while(choices.length<3){
      const r=ayahSamples[Math.floor(Math.random()*ayahSamples.length)].surah;
      if(!choices.includes(r)) choices.push(r);
    }
    choices.sort(()=>Math.random()-0.5);
    const container=document.getElementById('ayahGameChoices');
    container.innerHTML='';
    choices.forEach(ch=>{
      const btn=document.createElement('button');
      btn.className='btn btn-outline-success btn-sm mb-1 w-100';
      btn.textContent=ch;
      btn.addEventListener('click',()=>{
        if(ch===currentAyahGame.surah){ state.gameScore+=5; safeSet('oasis_game',state.gameScore); document.getElementById('gameScore').textContent=state.gameScore; alert('صحيح!'); }
        else alert(`الإجابة الصحيحة: ${currentAyahGame.surah}`);
        loadAyahGame(); playSafe(click);
      });
      container.appendChild(btn);
    });
  }
  document.getElementById('newAyahGame')?.addEventListener('click',()=>{ loadAyahGame(); playSafe(click); });
  loadAyahGame();

  /* ==========================================================
     ٦) سجل التطور – يعتمد على الاستمرارية + المهام
     ========================================================== */
  const achievementsList=document.getElementById('achievementsList');
  function today(){ return new Date().toLocaleDateString('ar-EG'); }
  function safeSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function safeGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }

  let state={
    prayerStreak: parseInt(safeGet('oasis_prayer'))||0,
    goodDeeds:  parseInt(safeGet('oasis_deeds'))||0,
    quranPages: parseInt(safeGet('oasis_pages'))||0,
    gameScore:  parseInt(safeGet('oasis_game'))||0
  };
  document.getElementById('prayerStreak').textContent=state.prayerStreak;
  document.getElementById('goodDeeds').textContent=state.goodDeeds;
  document.getElementById('quranPages').textContent=state.quranPages;
  document.getElementById('gameScore').textContent=state.gameScore;

  /* -- حساب نسبة التطور -- */
  function calcProgress(){
    const total=(
      (state.prayerStreak*10)+
      (state.goodDeeds*3)+
      (state.quranPages*2)+
      (state.gameScore)
    );
    const max=1000; // قابل للتعديل
    const pct=Math.min(100,Math.round((total/max)*100));
    document.getElementById('progressPercent').textContent=`${pct}%`;
    document.getElementById('progressBar').style.width=`${pct}%`;
    document.getElementById('progressBar').setAttribute('aria-valuenow',pct);
  }
  calcProgress();

  /* ==========================================================
     ٧) أدعية يومية – بدل الأدعية الصوتية
     ========================================================== */
  const dailyDuas=[
    {title:'دعاء الاستيقاظ',text:'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور'},
    {title:'دعاء دخول الخلاء',text:'بسم الله، اللهم إني أعوذ بك من الخبث والخبائث'},
    {title:'دعاء الخروج من الخلاء',text:'غفرانك'},
    {title:'دعاء الوضوء',text:'اللهم اجعلني من التوابين واجعلني من المتطهرين'},
    {title:'دعاء دخول المسجد',text:'اللهم افتح لي أبواب رحمتك'},
    {title:'دعاء الخروج من المسجد',text:'اللهم إني أسألك من فضلك'},
    {title:'دعاء الرياح الشديدة',text:'اللهم إني أسألك خيرها وخير ما فيها وخير ما أُرسلت به'},
    {title:'دعاء الرعد',text:'سبحان الذي يسبح الرعد بحمده والملائكة من خيفته'},
    {title:'دعاء الهم والحزن',text:'اللهم إني أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل'},
    {title:'دعاء الكرب',text:'لا إله إلا الله الحليم الكريم، لا إله إلا الله العلي العظيم'},
    {title:'دعاء دخول السوق',text:'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد يحيي ويميت وهو حي لا يموت'},
    {title:'دعاء ركوب الدابة',text:'سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون'},
    {title:'دعاء السفر',text:'اللهم إنا نسألك في سفرنا هذا البر والتقوى، ومن العمل ما ترضى'},
    {title:'دعاء من خاف من قوم',text:'اللهم اكفناهم بما شئت'},
    {title:'دعاء دخول القرية',text:'اللهم رب السماوات السبع وما أظللن، ورب الأرضين السبع وما أقللن'},
    {title:'دعاء المنزل الجديد',text:'اللهم إني أعوذ بك من شر هذا المنزل وشر ما فيه'},
    {title:'دعاء لبس الثوب',text:'الحمد لله الذي كساني هذا و رزقنيه من غير حول مني ولا قوة'},
    {title:'دعاء خلع الثوب',text:'بسم الله الذي لا إله إلا هو'},
    {title:'دعاء النوم',text:'باسمك اللهم أموت وأحيا'},
    {title:'دعاء الاستيقاظ',text:'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور'},
    {title:'دعاء القنوت',text:'اللهم اهدنا فيمن هديت، وعافنا فيمن عافيت، وتولنا فيمن توليت'},
    {title:'دعاء الاستسقاء',text:'اللهم اسقنا غيثًا مغيثًا مريئًا غير ضارٍّ عاجلًا غير آجل'},
    {title:'دعاء إفطار الصائم',text:'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله'},
    {title:'دعاء الصائم إذا زُلِّغ على لسانه',text:'اللهم إني صمت عن كل ما تحرم، فاغفر لي ما أحللت'},
    {title:'دعاء الخوف من الشرك',text:'اللهم إنا نعوذ بك أن نشرك بك شيئًا نعلمه، ونستغفرك لما لا نعلمه'},
    {title:'دعاء الخوف من الظلم',text:'اللهم إنا نعوذ بك من الظلم، ومن أن نُظلم، ومن أن نُظلم غيرنا'},
    {title:'دعاء قنوت النوازل',text:'اللهم إنا نجعلك في نحورهم، ونعوذ بك من شرورهم'},
    {title:'دعاء رؤية الهلال',text:'اللهم أهله علينا بالأمن والإيمان، والسلامة والإسلام، والتوفيق لما تحب وترضى'},
    {title:'دعاء رؤية الكعبة',text:'اللهم زد هذا البيت تشريفًا وتعظيمًا وتكريمًا ومهابة، وزد من شرفه وكرامة من جعله من حجاجه وعماره'},
    {title:'دعاء التعجب والسجود',text:'سبحان ربي الأعلى'},
    {title:'دعاء سجود التلاوة',text:'سبحان الذي لا ينام ولا يغفور، له ما في السماوات وما في الأرض'},
    {title:'دعاء الختمة',text:'اللهم اجعل القرآن ربيع قلوبنا، وجلاء حزننا، وذهاب همومنا'}
  ];
  let currentDailyDua=0;
  function loadDailyDua(){
    const d=dailyDuas[currentDailyDua];
    document.getElementById('dailyDuaTitle').textContent=d.title;
    document.getElementById('dailyDuaText').textContent=d.text;
    currentDailyDua=(currentDailyDua+1)%dailyDuas.length;
  }
  document.getElementById('nextDailyDua')?.addEventListener('click',()=>{ loadDailyDua(); playSafe(click); });
  loadDailyDua();

  /* ==========================================================
     أدوات صغيرة
     ========================================================== */
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  window.Oasis={ openPanel, closePanel, loadSurahIndex };
})();
