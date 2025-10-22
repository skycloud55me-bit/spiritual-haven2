class EmotionalAI {
    constructor() {
        this.sentimentData = {
            positive: ['فرح', 'سعادة', 'أمل', 'حماس', 'رضا', 'سلام', 'حب', 'امتنان'],
            negative: ['حزن', 'قلق', 'خوف', 'غضب', 'يأس', 'تعب', 'ضياع', 'وحدة'],
            anxious: ['قلق', 'توتر', 'خوف', 'تردد', 'اضطراب', 'هلع'],
            peaceful: ['سلام', 'طمأنينة', 'هدوء', 'صفاء', 'استقرار']
        };
    }

    analyzeEmotionalState(text) {
        const words = text.split(/\s+/);
        let scores = { positive: 0, negative: 0, anxious: 0, peaceful: 0 };

        words.forEach(word => {
            if (this.sentimentData.positive.includes(word)) scores.positive++;
            if (this.sentimentData.negative.includes(word)) scores.negative++;
            if (this.sentimentData.anxious.includes(word)) scores.anxious++;
            if (this.sentimentData.peaceful.includes(word)) scores.peaceful++;
        });

        return this.determineDominantEmotion(scores);
    }

    determineDominantEmotion(scores) {
        const emotions = [
            { type: 'peaceful', score: scores.peaceful },
            { type: 'positive', score: scores.positive },
            { type: 'anxious', score: scores.anxious },
            { type: 'negative', score: scores.negative }
        ];

        const dominant = emotions.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
        );

        return {
            type: dominant.type,
            intensity: dominant.score / (scores.positive + scores.negative + scores.anxious + scores.peaceful || 1)
        };
    }

    generateEmotionalResponse(emotion, userMessage) {
        const responseTemplates = {
            positive: [
                "🌸 أرى نوراً في كلماتكِ... هذا الجميل الذي تشعرين به، هل يمكنكِ مشاركته مع العالم؟",
                "🌞 فرحكِ يلمع عبر السطور. ما الذي أضاء هذا النور في داخلكِ اليوم؟"
            ],
            negative: [
                "🌧️ أحس بثقل في كلماتكِ... لا بأس في أن تشعري بهذا. هل تريدين الحديث عما يثقل قلبكِ؟",
                "🕊️ الألم الذي تحملينه هو دليل على إنسانيتكِ. دعينا نستمع إليه معاً دون حكم."
            ],
            anxious: [
                "🌀 أرى أفكاراً تدور في كلماتكِ... التنفس بعمق قد يبطئ هذه الدوامة. هل جربتِ ذلك؟",
                "🌌 القلق هو رسالة من أعماقكِ تخبركِ أن شيء ما يحتاج للاهتمام. ما هو هذا الشيء برأيكِ؟"
            ],
            peaceful: [
                "🍃 هدوئكِ يشبه نسمة الصباح الهادئة... كيف حافظتِ على هذا السلام الداخلي؟",
                "⭐️ الطمأنينة التي تشعرين بها هي كنز حقيقي. ما الذي ساعدكِ في الوصول إلى هذه الحالة؟"
            ]
        };

        const responses = responseTemplates[emotion.type] || [
            "🌺 شكراً لكِ على مشاركة مشاعركِ. كل شعور هو لغة تخبرنا عن احتياجاتنا العميقة."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
}
