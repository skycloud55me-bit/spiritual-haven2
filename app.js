// حالة التطبيق
const appState = {
    currentPlanet: null,
    conversation: []
};

// عناصر DOM
const portal = document.getElementById('portal');
const aiChat = document.getElementById('aiChat');
const startBtn = document.getElementById('startBtn');
const userMessage = document.getElementById('userMessage');

// بدء الرحلة
startBtn.addEventListener('click', function() {
    portal.classList.add('hidden');
    aiChat.classList.remove('hidden');
    showAIMessage('أهلاً بك في رحلتك الوجودية! أي كوكب تريد استكشافه أولاً؟');
});

// النقر على الكواكب
document.querySelectorAll('.planet').forEach(planet => {
    planet.addEventListener('click', function() {
        const planetId = this.id;
        const planetNames = {
            'mindPlanet': 'كوكب العقل',
            'heartPlanet': 'كوكب القلب', 
            'soulPlanet': 'كوكب الروح'
        };
        
        appState.currentPlanet = planetId;
        showAIMessage(`أهلاً بك في ${planetNames[planetId]}! ماذا تريد أن تستكشف هنا؟`);
    });
});

// إرسال رسالة
function sendMessage() {
    const message = userMessage.value.trim();
    if (message) {
        addUserMessage(message);
        userMessage.value = '';
        
        // محاكاة رد الذكاء الاصطناعي
        setTimeout(() => {
            generateAIResponse(message);
        }, 1000);
    }
}

// إضافة رسالة المستخدم
function addUserMessage(message) {
    const chatContainer = document.querySelector('.chat-container');
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-message';
    userMsgDiv.innerHTML = `<p><strong>أنت:</strong> ${message}</p>`;
    chatContainer.insertBefore(userMsgDiv, document.querySelector('.user-input'));
}

// عرض رسالة الذكاء الاصطناعي
function showAIMessage(message) {
    const chatContainer = document.querySelector('.chat-container');
    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'ai-message';
    aiMsgDiv.innerHTML = `<p><strong>المرشد:</strong> ${message}</p>`;
    chatContainer.insertBefore(aiMsgDiv, document.querySelector('.user-input'));
}

// توليد رد الذكاء الاصطناعي
function generateAIResponse(userMessage) {
    const responses = [
        "هذا سؤال عميق... ما رأيك أنت في هذا؟",
        "دعنا نتعمق أكثر في هذا الموضوع. ماذا يعني هذا لك شخصياً؟",
        "رائع! هل يمكنك مشاركة المزيد عن تجربتك مع هذا؟",
        "كل رحلة استكشاف تبدأ بفضول. ما الذي يثير فضولك الآن؟"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    showAIMessage(randomResponse);
}

// للكتابة بالإنتر
userMessage.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
