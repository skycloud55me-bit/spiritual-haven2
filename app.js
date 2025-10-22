class InnerUniverseApp {
    constructor() {
        this.emotionalAI = new EmotionalAI();
        this.init();
    }

    init() {
        this.setupEventListeners();
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
        
        heartMessage.addEventListener('input', () => {
            this.realTimeEmotionalAnalysis();
        });
    }

    realTimeEmotionalAnalysis() {
        const text = document.getElementById('heartMessage').value;
        if (text.length > 5) {
            const emotion = this.emotionalAI.analyzeEmotionalState(text);
            this.updateEmotionalIndicator(emotion);
        }
    }

    updateEmotionalIndicator(emotion) {
        const indicator = document.getElementById('moodIndicator');
        const stateClasses = ['state-happy', 'state-sad', 'state-anxious', 'state-peaceful'];
        
        indicator.classList.remove(...stateClasses);
        indicator.classList.add(`state-${emotion.type}`);
        
        const emotionNames = {
            positive: '🌸 مشاعر إيجابية',
            negative: '🌧️ مشاعر صعبة', 
            anxious: '🌀 مشاعر قلقة',
            peaceful: '🍃 حالة من السلام'
        };
        
        indicator.textContent = `${emotionNames[emotion.type]} (شدة: ${Math.round(emotion.intensity * 100)}%)`;
    }

    processEmotionalExpression() {
        const userMessage = document.getElementById('heartMessage').value.trim();
        
        if (!userMessage) {
            alert('🖋️ اكتبي شيئاً من قلبكِ أولاً...');
            return;
        }
        
        const emotion = this.emotionalAI.analyzeEmotionalState(userMessage);
        this.updateEmotionalIndicator(emotion);
        
        const aiResponse = this.emotionalAI.generateEmotionalResponse(emotion, userMessage);
        this.displayAIResponse(aiResponse);
        
        document.getElementById('heartMessage').value = '';
    }

    displayAIResponse(response) {
        const responseElement = document.getElementById('aiResponse');
        responseElement.innerHTML = `
            <div class="response-header">رفيق رحلتكِ:</div>
            <div class="response-content">${response}</div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InnerUniverseApp();
});
