// العناصر
const sections = document.querySelectorAll(".section");
const buttons = document.querySelectorAll(".nav-btn");
const body = document.body;

// إنشاء الأصوات
const clickSound = new Audio("sounds/click.mp3");
const sectionSound = new Audio("sounds/section.mp3");

// إعداد مستوى الصوت (اختياري)
clickSound.volume = 0.4;
sectionSound.volume = 0.5;

// وظيفة لتغيير القسم عند الضغط على زر
buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    // تشغيل الصوت عند الضغط فقط
    clickSound.currentTime = 0;
    clickSound.play();

    // إزالة التفعيل عن كل الأزرار
    buttons.forEach(b => b.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));

    // تفعيل الزر والقسم المطلوب
    btn.classList.add("active");
    sections[index].classList.add("active");

    // تغيير لون الخلفية بتدرج الأخضر الملكي
    body.style.background = "linear-gradient(135deg, #013220, #046d46)";

    // تشغيل صوت الانتقال بعد الضغط بقليل
    setTimeout(() => {
      sectionSound.currentTime = 0;
      sectionSound.play();
    }, 150);
  });
});

// تأثير دخول الصفحة الأول
window.addEventListener("load", () => {
  body.style.transition = "background 1s ease";
  body.style.background = "linear-gradient(135deg, #013220, #046d46)";
  sections[0].classList.add("active");
  buttons[0].classList.add("active");
});
