// التطبيق الرئيسي
class InnerUniverseApp {
    constructor() {
        this.emotionalAI = new EmotionalAI();
        this.scene3D = new EmotionalScene3D();
        this.currentEmotion = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeEmotionalCanvas();
    }

    setupEventListeners() {
        const expressBtn = document.getElementById('expressBtn');
        const heartMessage = document.getElementById('heartMessage');
        
        expressBtn.addEventListener('click', () => this.processEmotionalExpression());
        
        heartMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.processEmotionalExpression();
            }
        });
        
        // تحليل عاطفي أثناء الكتابة
        heartMessage.addEventListener('input', () => {
            this.realTimeEmotionalAnalysis();
        });
    }

    initializeEmotionalCanvas() {
        const canvas = document.getElementById('emotionCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        this.drawEmotionalGrid(ctx, canvas.width, canvas.height);
    }

    drawEmotionalGrid(ctx, width, height) {
        // رسم شبكة المشاعر الأساسية
        ctx.clearRect(0, 0, width, height);
        
        // دوائر تمثل المشاعر المختلفة
        const emotions = [
            { name: 'فرح', color: '#4CAF50', x: width * 0.3, y: height * 0.3 },
            { name: 'حزن', color: '#2196F3', x: width * 0.7, y: height * 0.3 },
            { name: 'قلق', color: '#FF9800', x: width * 0.3, y: height * 0.7 },
            { name: 'سلام', color: '#9C27B0', x: width * 0.7, y: height * 0.7 }
        ];
        
        emotions.forEach(emotion => {
            ctx.beginPath();
            ctx.arc(emotion.x, emotion.y, 25, 0, 2 * Math.PI);
            ctx.fillStyle = emotion.color + '40';
            ctx.fill();
            ctx.strokeStyle = emotion.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = emotion.color;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(emotion.name, emotion.x, emotion.y + 35);
        });
    }

    realTimeEmotionalAnalysis() {
        const text = document.getElementById('heartMessage').value;
        if (text.length > 10) {
            const emotion = this.emotionalAI.analyzeEmotionalState(text);
            this.updateEmotionalIndicator(emotion);
        }
    }

    updateEmotionalIndicator(emotion) {
        const indicator = document.getElementById('moodIndicator');
        const stateClasses = ['state-happy', 'state-sad', 'state-anxious', 'state-peaceful'];
        
        // إزالة الفئات السابقة
        indicator.classList.remove(...stateClasses);
        
        // إضافة الفئة الجديدة
        indicator.classList.add(`state-${emotion.type}`);
        
        // تحديث النص
        const emotionNames = {
            positive: '🌸 مشاعر إيجابية',
            negative: '🌧️ مشاعر صعبة', 
            anxious: '🌀 مشاعر قلقة',
            peaceful: '🍃 حالة من السلام'
        };
        
        indicator.textContent = `${emotionNames[emotion.type]} (شدة: ${Math.round(emotion.intensity * 100)}%)`;
    }

    async processEmotionalExpression() {
        const userMessage = document.getElementById('heartMessage').value.trim();
        
        if (!userMessage) {
            alert('🖋️ اكتبي شيئاً من قلبكِ أولاً...');
            return;
        }
        
        // تحليل العاطفة
        const emotion = this.emotionalAI.analyzeEmotionalState(userMessage);
        this.currentEmotion = emotion;
        
        // تحديث الواجهة
        this.updateEmotionalIndicator(emotion);
        
        // تحديث المشهد الثلاثي الأبعاد
        this.scene3D.updateEmotionalScene(emotion);
        
        // توليد الرد
        const aiResponse = this.emotionalAI.generateEmotionalResponse(emotion, userMessage);
        this.displayAIResponse(aiResponse);
        
        // حفظ في السجل
        this.emotionalAI.emotionalHistory.push({
            message: userMessage,
            emotion: emotion,
            timestamp: new Date().toISOString(),
            response: aiResponse
        });
        
        // مسح الحقل
        document.getElementById('heartMessage').value = '';
    }

    displayAIResponse(response) {
        const responseElement = document.getElementById('aiResponse');
        responseElement.innerHTML = `
            <div class="response-header">
                <strong>رفيق رحلتكِ:</strong>
            </div>
            <div class="response-content">
                ${response}
            </div>
        `;
        
        responseElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// بدء التطبيق عندما يتم تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.innerUniverseApp = new InnerUniverseApp();
});
