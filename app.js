// حالة الكون
const universeState = {
    consciousnessLevel: '',
    activePlanet: null,
    discoveredPlanets: [],
    existentialData: {}
};

// تهيئة الكون
function initUniverse() {
    createStars();
    initPlanets();
    initConsciousnessCheck();
}

// إنشاء النجوم الديناميكية
function createStars() {
    const scene = document.getElementById('universeScene');
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: twinkle ${Math.random() * 5 + 3}s infinite;
        `;
        scene.appendChild(star);
    }
}

// تفعيل الكواكب
function initPlanets() {
    document.querySelectorAll('.planet').forEach(planet => {
        planet.addEventListener('click', function() {
            const planetType = this.dataset.type;
            explorePlanet(planetType);
        });
    });
}

// استكشاف الكوكب
function explorePlanet(planetType) {
    universeState.activePlanet = planetType;
    
    const messages = {
        mind: "🪐 كوكب العقل: هنا تبدأ رحلة الأفكار... ما الفكرة التي تريد استكشافها؟",
        heart: "💖 كوكب القلب: هذه مساحة للمشاعر... ما الذي يشغلك عاطفياً؟", 
        soul: "🌌 كوكب الروح: هنا نبحث عن المعنى... ما السؤال الوجودي الذي يحيرك؟"
    };
    
    showAIDialog(messages[planetType]);
}

// محادثة الذكاء الوجودي
function showAIDialog(message) {
    const ai = document.getElementById('existentialAI');
    ai.querySelector('.ai-message').textContent = message;
    ai.classList.remove('hidden');
}

// اختيار مستوى الوعي
function initConsciousnessCheck() {
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            universeState.consciousnessLevel = this.dataset.level;
            
            // تحديث الواجهة بناءً على مستوى الوعي
            updateInterfaceForConsciousness();
        });
    });
}

// تحديث الواجهة لمستوى الوعي
function updateInterfaceForConsciousness() {
    const portal = document.getElementById('existentialPortal');
    const levels = {
        explorer: "👣 رحلة المستكشف: لنبدأ من الأساسيات...",
        seeker: "🔍 رحلة الباحث: دعنا نتعمق أكثر...", 
        philosopher: "💭 رحلة الفيلسوف: لنغوص في الأعماق..."
    };
    
    portal.querySelector('.portal-subtitle').textContent = levels[universeState.consciousnessLevel];
}

// الدخول إلى الكون
document.getElementById('enterUniverse').addEventListener('click', function() {
    if (!universeState.consciousnessLevel) {
        showAIDialog("⏳ اختر مستوى وعيك أولاً لتبدأ الرحلة...");
        return;
    }
    
    // اختفاء البوابة
    document.getElementById('existentialPortal').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('existentialPortal').classList.add('hidden');
        showAIDialog("🌌 أهلاً بك في كونك الشخصي! انقر على أي كوكب لتبدأ الاستكشاف...");
    }, 1000);
});

// بدء الكون
document.addEventListener('DOMContentLoaded', initUniverse);
