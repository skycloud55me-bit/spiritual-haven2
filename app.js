async function analyzeMood() {
  const input = document.getElementById('user-input').value.trim();
  const responseBox = document.getElementById('ai-response');

  if (!input) {
    responseBox.textContent = "من فضلك عبّر عن شعورك أولاً 🌼";
    return;
  }

  // تحليل المشاعر
  let mood = detectMood(input);

  // استجابة حسب الحالة
  let reply = generateResponse(mood);

  // عرض الرد
  responseBox.textContent = reply;

  // تغيير الخلفية حسب الحالة
  changeBackground(mood);
}

function detectMood(text) {
  const sadness = ["حزين", "محبط", "يائس", "متعب", "ضائع"];
  const happiness = ["سعيد", "فرحان", "مرتاح", "متحمس"];
  const anger = ["غاضب", "عصبي", "مستاء", "مقهور"];
  const anxiety = ["قلق", "خائف", "متوتر"];

  if (sadness.some(w => text.includes(w))) return "sad";
  if (happiness.some(w => text.includes(w))) return "happy";
  if (anger.some(w => text.includes(w))) return "angry";
  if (anxiety.some(w => text.includes(w))) return "anxious";

  return "neutral";
}

function generateResponse(mood) {
  switch (mood) {
    case "sad":
      return "يبدو أنك تمر بيوم صعب 💔. لا بأس، اسمح لنفسك بالراحة قليلاً، فالأيام الجميلة قادمة.";
    case "happy":
      return "رائع! 😊 استمتع بهذه الطاقة الإيجابية وشاركها مع من حولك!";
    case "angry":
      return "خذ نفسًا عميقًا 😌، لا تجعل الغضب يسيطر عليك. ربما الكتابة أو المشي قليلاً تساعدك.";
    case "anxious":
      return "أعلم أن القلق مزعج 😔، حاول تنظيم تنفسك وذكّر نفسك أنك تبذل ما بوسعك.";
    default:
      return "أنا هنا لأستمع إليك 🌸. أخبرني أكثر عما تشعر به؟";
  }
}

function changeBackground(mood) {
  const body = document.body;
  switch (mood) {
    case "sad":
      body.style.background = "linear-gradient(135deg, #89f7fe, #66a6ff)";
      break;
    case "happy":
      body.style.background = "linear-gradient(135deg, #fddb92, #d1fdff)";
      break;
    case "angry":
      body.style.background = "linear-gradient(135deg, #ff9a9e, #fecfef)";
      break;
    case "anxious":
      body.style.background = "linear-gradient(135deg, #cfd9df, #e2ebf0)";
      break;
    default:
      body.style.background = "linear-gradient(135deg, #a1c4fd, #c2e9fb)";
  }
}
