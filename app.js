// بيانات المستخدم الأولية
let userData = {
    reason: '',
    emotion: '',
    journeyStarted: false
};

// اختيار السبب
document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // إزالة التحديد السابق
        document.querySelectorAll('.option-btn').forEach(b => {
            b.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        // تحديد الحالي
        this.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        userData.reason = this.textContent;
        checkReadyToStart();
    });
});

// اختيار المشاعر
document.querySelectorAll('.emotion-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // إزالة التحديد السابق
        document.querySelectorAll('.emotion-btn').forEach(b => {
            b.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        // تحديد الحالي
        this.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        userData.emotion = this.textContent;
        checkReadyToStart();
    });
});

// التحقق من الجاهزية للبدء
function checkReadyToStart() {
    const startBtn = document.getElementById('startJourney');
    if (userData.reason && userData.emotion) {
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
    } else {
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
    }
}

// بدء الرحلة
document.getElementById('startJourney').addEventListener('click', function() {
    userData.journeyStarted = true;
    
    // رسالة ترحيب شخصية
    const messages = {
        'ضائع': '🌌 كل المستكشفين العظماء شعروا بالضياع في البداية',
        'فضولي': '🔍 فضولك هو دليلك إلى عوالم جديدة داخل نفسك',
        'متحمس': '🚀 حماسك هو وقود رحلتك الاستكشافية',
        'هادئ': '☁️ هدوئك سيمكنك من رؤية ما لا يراه الآخرون'
    };
    
    const personalMessage = messages[userData.emotion] || '🚀 لنبدأ هذه الرحلة المدهشة معاً';
    
    // الانتقال إلى الصفحة التالية
    document.querySelector('.portal').innerHTML = `
        <div class="welcome-message">
            <h2>أهلاً بك في رحلتك، أيها المستكشف الشجاع!</h2>
            <p class="personal-msg">${personalMessage}</p>
            <div class="planet-welcome">
                <div class="planet"></div>
                <p>ها هو كوكبك الأول ينتظر استكشافك...</p>
            </div>
            <button onclick="enterUniverse()" class="enter-btn">ادخل إلى الكون</button>
        </div>
    `;
});

// الدخول إلى الكون
function enterUniverse() {
    alert('🎉 هنيئاً! لقد دخلت الكون الوجودي! (هذه نهاية النسخة التجريبية الأولى)');
    // هنا سنضيف الصفحات التالية
}

// تهيئة الصفحة
checkReadyToStart();
