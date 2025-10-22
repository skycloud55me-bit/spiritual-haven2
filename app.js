// Simple client-side logic: storage in localStorage, mock "AI" prompts, UI flow
const startBtn = document.getElementById('startBtn');
const introName = document.getElementById('introName');
const mirror = document.getElementById('mirror');
const journeys = document.getElementById('journeys');
const insight = document.getElementById('insight');
const threeWrapper = document.getElementById('threeWrapper');
const notesSection = document.getElementById('notes');

const dailyInput = document.getElementById('dailyInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const analysis = document.getElementById('analysis');

const newPromptBtn = document.getElementById('newPromptBtn');
const promptsContainer = document.getElementById('promptsContainer');
const notesList = document.getElementById('notesList');
const viewTimelineBtn = document.getElementById('viewTimelineBtn');
const reset3D = document.getElementById('reset3D');

// State
let userName = localStorage.getItem('xi_name') || null;
let notes = JSON.parse(localStorage.getItem('xi_notes') || '[]');

// Init UI
function showSections(){
  mirror.classList.remove('hidden');
  journeys.classList.remove('hidden');
  insight.classList.remove('hidden');
  threeWrapper.classList.remove('hidden');
  notesSection.classList.remove('hidden');
}
if(userName){
  introName.value = userName;
  showSections();
  renderNotes();
}

// Start
startBtn.addEventListener('click', ()=>{
  userName = introName.value.trim() || 'مستكشف/ة';
  localStorage.setItem('xi_name', userName);
  showSections();
  startBtn.textContent = 'جاري... تم بدء الرحلة';
  setTimeout(()=> startBtn.textContent = 'ابدأ رحلتك', 900);
});

// Mock analysis function (يمكن استبدالها لاحقًا بالـ API)
function mockAnalyze(text){
  // بسيط: نبحث الكلمات العاطفية ونُرجع شعور/سؤال
  const lower = text.toLowerCase();
  const feelings = [];
  if(/حزن|حزين|حزينة/.test(lower)) feelings.push('حزن');
  if(/سعادة|سعيد|فرح/.test(lower)) feelings.push('سعادة');
  if(/قلق|خوف|خائفة|خائف/.test(lower)) feelings.push('قلق');
  if(/فضول|متحمسة|متحمس/.test(lower)) feelings.push('فضول');

  const suggestion = feelings.length ? `يبدو أن هناك مشاعر: ${feelings.join(', ')}. سؤال لِلتفكير: ما الذي يحتاجه هذا الشعور منك اليوم؟` :
    `سؤال للغوص أعمق: ما الذي ستفعلينه لو لم تخافي من النتيجة؟`;

  // استخراج كلمات مفتاحية لتمثيل ثلاثي الأبعاد لاحقاً
  const keywords = (text.match(/\b[^\s]{3,}\b/g) || []).slice(0,6);
  return { suggestion, keywords };
}

analyzeBtn.addEventListener('click', ()=>{
  const text = dailyInput.value.trim();
  if(!text) { analysis.textContent = 'اكتبي شيئًا ثم اضغطي تحليل.'; return; }
  const res = mockAnalyze(text);
  analysis.textContent = res.suggestion;
  // create prompt bubble
  addPrompt(res.suggestion);
});

saveNoteBtn.addEventListener('click', ()=>{
  const text = dailyInput.value.trim();
  if(!text) return alert('لا يوجد نص للحفظ');
  const note = { id: Date.now(), text, created: new Date().toISOString() };
  notes.unshift(note);
  localStorage.setItem('xi_notes', JSON.stringify(notes));
  dailyInput.value = '';
  analysis.textContent = 'تم الحفظ في دفتر الرحلة.';
  renderNotes();
  // Update 3D scene via event
  window.dispatchEvent(new CustomEvent('xi:notesUpdated', { detail: notes }));
});

function renderNotes(){
  notesList.innerHTML = '';
  notes.forEach(n=>{
    const li = document.createElement('li');
    li.textContent = `${new Date(n.created).toLocaleString()} — ${n.text}`;
    notesList.appendChild(li);
  });
}

// Prompts
function addPrompt(text){
  const div = document.createElement('div');
  div.className = 'prompt';
  div.textContent = text;
  promptsContainer.prepend(div);
}
newPromptBtn.addEventListener('click', ()=>{
  const qs = [
    "ما الفكرة التي تتجنبين مواجهتها؟",
    "ما القيمة التي لو اختفت من حياتك لتغيرت كل شيء؟",
    "ماذا لو لم تبدأ من جديد بل أكملت ما بدأتِ قبل 5 سنوات؟",
    "ماذا تريد نفسك أن تعرفه بعد عشر سنوات؟"
  ];
  const p = qs[Math.floor(Math.random()*qs.length)];
  addPrompt(p);
});

// Insight generation (very simple aggregation)
viewTimelineBtn.addEventListener('click', ()=>{
  const insightEl = document.getElementById('insightContent');
  if(notes.length===0) return insightEl.textContent = 'لا توجد ملاحظات بعد لتوليد البصيرة.';
  // إحصاء كلمات متكررة
  const allText = notes.map(n=>n.text).join(' ').toLowerCase();
  const words = allText.match(/\b[^\s]{3,}\b/g) || [];
  const freq = {};
  words.forEach(w=> freq[w] = (freq[w]||0)+1);
  const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,6);
  insightEl.innerHTML = `<strong>كلمات بارزة في رحلتك:</strong> ${sorted.map(s=>s[0]).join(', ')}<br><br>
  <em>اقتراح عملي:</em> اختاري كلمة من الأعلى واعملي عليها تمرينًا لمدة أسبوع (كتابة/ملاحظة/عمل صغير).`;
});

// Reset 3D
reset3D.addEventListener('click', ()=>{
  window.dispatchEvent(new CustomEvent('xi:reset3D'));
  alert('تم إعادة ضبط المشهد الثلاثي الأبعاد.');
});
