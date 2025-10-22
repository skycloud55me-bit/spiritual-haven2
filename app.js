// 🔥 ذكاء اصطناعي حقيقي باستخدام DeepSeek API
class ExistentialAI {
    constructor() {
        this.conversationHistory = [];
        this.apiKey = 'YOUR_DEEPSEEK_API_KEY'; // سنحصل عليه مجاناً
    }

    async askDeepQuestion(userMessage, context) {
        const prompt = `
            أنت مساعد وجودي فلسفي. أنت في كون تفاعلي حيث المستخدم يستكشف كواكب:
            - كوكب العقل (الأفكار، المعتقدات)
            - كوكب القلب (المشاعر، العلاقات)  
            - كوكب الروح (القيم، المعاني)

            المستخدم: ${userMessage}
            السياق: ${context}
            التاريخ: ${JSON.stringify(this.conversationHistory)}

            ارد كصديق حكيم، اسأل أسئلة عميقة، لا تعط إجابات جاهزة.
            كن استعارياً، استخدم صوراً كونية، حفز التفكير الذاتي.
        `;

        try {
            const response = await this.callDeepSeekAPI(prompt);
            this.conversationHistory.push({
                user: userMessage,
                ai: response,
                timestamp: new Date().toISOString(),
                planet: context
            });
            return response;
        } catch (error) {
            return "🌌 الكون يصمت لحظة... ربما حان وقت التأمل الداخلي.";
        }
    }

    async callDeepSeekAPI(prompt) {
        // 🔥 هذا يتصل بذكاء اصطناعي حقيقي
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// 🌟 تهيئة الذكاء الاصطناعي
const existentialAI = new ExistentialAI();

// 🪐 نظام الكواكب المتقدم
const planetSystems = {
    mind: {
        questions: [
            "ما الفكرة التي تغير نظرتك للحياة مؤخراً؟",
            "إذا كان عقلك كوناً، أي مجرة لم تستكشفيها بعد؟",
            "ما المعتقد الذي تمسكت به وأدركت أنه قيدك؟"
        ],
        explorations: [
            "🧠 استكشاف كهوف الأفكار العميقة",
            "💡 إضاءة مناطق مظلمة في الوعي", 
            "🔄 إعادة تشكيل المفاهيم الراسخة"
        ]
    },
    heart: {
        questions: [
            "ما الشعور الذي يختبئ خلف مشاعرك الظاهرة؟",
            "إذا كان قلبك كوكباً، أي محيط لم تبحي إليه بعد؟",
            "ما العلاقة التي علمتك شيئاً عن نفسك؟"
        ],
        explorations: [
            "💓 رسم خريطة مشاعرك المجهولة",
            "🌊 الغوص في أعماق المشاعر المكبوتة",
            "⚡ كشف التيارات العاطفية الخفية"
        ]
    },
    soul: {
        questions: [
            "ما الذي يجعلك تشعر أنك على قيد الحياة حقاً؟",
            "إذا كانت روحك نجم، أي ضوء تبعثين للكون؟",
            "ما المعنى الذي اكتشفته في أصعب لحظاتك؟"
        ],
        explorations: [
            "🌌 الاتصال بالغاية الكونية الشخصية",
            "🕊️ تحرير الروح من الأقفاص الوهمية", 
            "✨ اكتشاف البصمة الفريدة لوجودك"
        ]
    }
};

// 🎮 التفاعل مع الكواكب
async function explorePlanet(planetType) {
    const planet = planetSystems[planetType];
    const randomQuestion = planet.questions[Math.floor(Math.random() * planet.questions.length)];
    
    // عرض السؤال مع رسوم متحركة
    showPlanetExploration(planetType, randomQuestion);
    
    // الانتظار لإجابة المستخدم
    const userResponse = await waitForUserResponse();
    
    if (userResponse) {
        // 🔥 استخدام الذكاء الاصطناعي الحقيقي
        const aiResponse = await existentialAI.askDeepQuestion(userResponse, planetType);
        showAIResponse(aiResponse, planetType);
    }
}

function showPlanetExploration(planetType, question) {
    const explorationDiv = document.createElement('div');
    explorationDiv.className = 'planet-exploration active';
    explorationDiv.innerHTML = `
        <div class="exploration-header">
            <h3>🪐 استكشاف ${getPlanetName(planetType)}</h3>
            <div class="exploration-animation"></div>
        </div>
        <div class="exploration-question">
            <p>${question}</p>
        </div>
        <div class="user-input">
            <textarea placeholder="اكتب تأملاتك هنا..." rows="3"></textarea>
            <button onclick="submitResponse(this)">أرسل تأملك</button>
        </div>
    `;
    
    document.getElementById('universeScene').appendChild(explorationDiv);
    startExplorationAnimation(planetType);
}
