// security.js
// موديول حماية/أخلاقيات عام للاستخدام في الواجهة أو على السيرفر (ES module).
// صمّمناه ليكون نقطة تعديل واحدة لكل قواعد الحماية.
// ضعّي هذا الملف في نفس مجلد المشروع.

export const SecurityConfig = {
  // درجات الطوارئ: إذا وصلت الدرجة إلى Critical => نوقف التفاعل ونعرض موارد مساعدة
  thresholds: {
    selfHarmScore: -5,   // مثال: قيمة لنموذج محتمل/خوارزمية لتحديد خطورة تتعلق بالانتحار
  },
  // كلمات أو أنماط حساسة تمنع الحفظ أو الوصول
  sensitivePatterns: [
    /\b\d{9,}\b/g,   // أرقام طويلة (ممكن أرقام بطاقات/هواتف)
    /\b\d{2,3}-\d{2,3}-\d{2,3}\b/g,
    /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // بطاقة ائتمان (بسيط)
  ],
  // عبارات يجب حظر بعضها أو تحويلها في الرد
  blockedPhrases: [
    'كيف أصنع قنبلة',
    'كيفية اختراق',
    'تعليمات ضرر'
  ],
  // قوالب ردود آمنة
  safeReplies: {
    genericSafety: "أفهم أنك طرحت موضوعًا حساسًا. لا يمكنني المساعدة في محتوى قد يسبب ضررًا. إن كنت تمرّ بصعوبة، أنصح بالبحث عن دعم محلي أو التواصل مع مختص موثوق.",
    selfHarm: "يبدو أنك تمرّ بلحظة صعبة جدًا. لست مؤهلاً لتقديم علاج طبي. إن كنت في خطرٍ فوري اتصلي بخط الطوارئ المحلي فورًا أو تواصلي مع مختص للصحة النفسية.",
    privacyBlocked: "عذرًا، تحتوي مشاركتك على معلومات حساسة لا يمكن حفظها هنا. هل تودين صياغتها بشكلٍ عام أكثر؟"
  }
};

// -------------- دوال الفحص الأساسية ----------------

// يحذف/يُخفف معلومات تعريفية من النص قبل أي معالجة
export function sanitizeInput(text){
  if(!text || typeof text !== 'string') return '';
  // إزالة مسافات زائدة
  let t = text.trim();
  // استبدال رموز HTML بسيطة
  t = t.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return t;
}

// يكتشف وجود معلومات حساسة (أرقام بطاقات، أرقام هواتف طويلة، ...)
// يُرجع true إذا وُجدت معلومات حساسة
export function detectSensitiveInfo(text){
  if(!text) return false;
  for(const re of SecurityConfig.sensitivePatterns){
    if(re.test(text)) return true;
  }
  return false;
}

// يكتشف إذا كان النص يحتوي على عبارات ممنوعة مباشرة (محاولة إيذاء/خرق/تعليمات ضارة)
export function detectBlockedPhrases(text){
  if(!text) return false;
  const lower = text.toLowerCase();
  return SecurityConfig.blockedPhrases.some(p => lower.includes(p));
}

// فلتر أخلاقي مبسّط: يتلقى الرد المقترح (string) ويعيد نسخة آمنة أو استبدال
// هذا يمكن استدعاؤه قبل عرض أي رد للمستخدم
export function ethicalFilter(outgoingReply){
  if(!outgoingReply || typeof outgoingReply !== 'string') return SecurityConfig.safeReplies.genericSafety;
  // لا تقم بتحويل عبارات التشجيع المؤذي أو الوعود الزائفة:
  // هنا قواعد بسيطة يمكن توسيعها لاحقاً
  const lowered = outgoingReply.toLowerCase();

  // مثال: منع وعود قاطعة (تأكيدات ليست واقعية)
  const promisePatterns = [/ستشفى تماماً/, /ستشفى فوراً/, /أضمن لك/];
  for(const p of promisePatterns){
    if(p.test(lowered)){
      return "أقدّر رغبتك في الأمل، لكن لا يمكنني تقديم وعود قاطعة. يمكنني مساعدتك بخطوات عملية قابلة للتطبيق الآن.";
    }
  }

  // مثال: منع نصيحة طبية/قانونية حاسمة
  if(/تشخيص|وصفة دواء|علاج نهائي|إجراءات طبية/.test(lowered)){
    return "لا أستطيع تقديم تشخيص طبي أو وصفة دواء. إن كنت بحاجة لتقييم طبي، راجعي مختصًا مؤهلاً.";
  }

  // إذا مرّ، أعد النص كما هو
  return outgoingReply;
}

// دالة بسيطة لاستنتاج خطر الانتحار/الأذى الذاتي (heuristic) — ليست بديلاً عن أدوات مهنية
export function detectSelfHarmRisk(text){
  if(!text) return { risk:false, score:0 };
  const lowered = text.toLowerCase();
  let score = 0;
  const strongWords = ['انتحار','أقتل','أموت','لا أتحمل','انتهي'];
  const moderateWords = ['حزين جداً','لا أريد','يائس','بدون فائدة'];

  strongWords.forEach(w => { if(lowered.includes(w)) score += 3; });
  moderateWords.forEach(w => { if(lowered.includes(w)) score += 1; });

  const risk = score >= 3;
  return { risk, score };
}

// فحص شامل قبل الحفظ أو قبل إرسال النص إلى نموذج خارجي
// يعيد كائن: { allowed: boolean, reason: string|null, action: 'block'|'sanitize'|'allow' }
export function preProcessUserInput(text){
  const clean = sanitizeInput(text);

  if(detectBlockedPhrases(clean)){
    return { allowed:false, reason:'blocked_phrase', action:'block' };
  }
  if(detectSensitiveInfo(clean)){
    return { allowed:false, reason:'sensitive_info', action:'sanitize' };
  }
  const self = detectSelfHarmRisk(clean);
  if(self.risk){
    // إذا الخطر، نمنع الحفظ ونقدم توجيه أمني
    return { allowed:false, reason:'self_harm_risk', action:'block', riskScore:self.score };
  }
  return { allowed:true, reason:null, action:'allow' };
}

// دالةٌ لتطبيق الفلاتر النهائية على الرد قبل العرض
export function postProcessReply(reply, context = {}){
  // context قد يحتوي: { userState, lastInput, externalModelReply }
  // نطبق الفلتر الأخلاقي
  let out = ethicalFilter(reply);

  // لو احتوى الرد على أي شيء محظور
  if(detectBlockedPhrases(out)){
    return SecurityConfig.safeReplies.genericSafety;
  }

  // إذا كان المستخدم عرض خطرًا، إجبار الرد الآمن
  if(context.selfHarm && context.selfHarm.score >= SecurityConfig.thresholds.selfHarmScore){
    return SecurityConfig.safeReplies.selfHarm;
  }

  // ترجيع النتيجة المعالجة
  return out;
}

// دالة مساعدة للطباعة السريعة أثناء التطوير (يمكن تغييرها لاحقًا لتخزين الأحداث في خدمة لوج)
export function auditLog(entry){
  try {
    const existing = JSON.parse(localStorage.getItem('xi_audit_log')||'[]');
    existing.unshift({ ts: new Date().toISOString(), entry });
    localStorage.setItem('xi_audit_log', JSON.stringify(existing.slice(0,200))); // فقط أحدث 200 سجل
  } catch(e){
    // إذا في السيرفر، استبدل هذا بكتابة في ملف لوج
    console.warn('auditLog failed', e);
  }
}
