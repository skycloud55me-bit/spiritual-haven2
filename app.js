// app.js - الكود الكامل مع الترجمة والوضع الليلي

// ========== الترجمة والوضع الليلي ==========

// بيانات الترجمة
const translations = {
  ar: {
    welcome: "مرحبا بكِ",
    toggle_theme: "الوضع الليلي",
    toggle_theme_light: "الوضع النهاري",
    quran: "القرآن الكريم",
    quran_garden: "بستان القرآن",
    righteous_path: "رياض الصالحين",
    obedience_gardens: "جنات الطاعة",
    educational_games: "ألعاب تربوية",
    progress_tracker: "سجل تطورك",
    daily_duas: "الأدعية اليومية"
  },
  en: {
    welcome: "Welcome",
    toggle_theme: "Night Mode", 
    toggle_theme_light: "Day Mode",
    quran: "Holy Quran",
    quran_garden: "Quran Garden",
    righteous_path: "Righteous Path",
    obedience_gardens: "Gardens of Obedience",
    educational_games: "Educational Games", 
    progress_tracker: "Progress Tracker",
    daily_duas: "Daily Prayers"
  },
  fr: {
    welcome: "Bienvenue",
    toggle_theme: "Mode Nuit",
    toggle_theme_light: "Mode Jour",
    quran: "Saint Coran",
    quran_garden: "Jardin du Coran",
    righteous_path: "Sentier des Vertueux",
    obedience_gardens: "Jardins de l'Obéissance",
    educational_games: "Jeux Éducatifs",
    progress_tracker: "Suivi de Progrès",
    daily_duas: "Prières Quotidiennes"
  }
};

// التهيئة
let currentLanguage = 'ar';
let currentTheme = 'light';

// تطبيق الترجمة
function applyTranslations(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // تحديث النصوص
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
}

// تبديل الوضع الليلي
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', currentTheme);
  
  const themeIcon = document.querySelector('#themeToggle i');
  const themeText = document.getElementById('themeText');
  
  if (currentTheme === 'dark') {
    themeIcon.className = 'fas fa-sun';
    themeText.textContent = translations[currentLanguage].toggle_theme_light;
  } else {
    themeIcon.className = 'fas fa-moon';
    themeText.textContent = translations[currentLanguage].toggle_theme;
  }
  
  // حفظ التفضيلات
  localStorage.setItem('theme', currentTheme);
  localStorage.setItem('language', currentLanguage);
}

// تحميل التفضيلات
function loadPreferences() {
  const savedTheme = localStorage.getItem('theme');
  const savedLang = localStorage.getItem('language');
  
  if (savedTheme) {
    currentTheme = savedTheme;
    document.body.setAttribute('data-theme', currentTheme);
  }
  
  if (savedLang) {
    currentLanguage = savedLang;
    document.getElementById('languageSelector').value = currentLanguage;
    applyTranslations(currentLanguage);
  }
}

// إضافة المستمعين في التهيئة
document.addEventListener('DOMContentLoaded', function() {
  // الكود الحالي الخاص بك...
  
  // إضافة هذا في الآخر:
  document.getElementById('languageSelector').addEventListener('change', function(e) {
    applyTranslations(e.target.value);
    localStorage.setItem('language', e.target.value);
  });

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  loadPreferences();
});
// ========== إعدادات التطبيق ==========
const appConfig = {
    currentLanguage: 'ar',
    currentTheme: 'light',
    fontSize: 16,
    readerMode: false
};

// ========== بيانات التطبيق ==========
const appData = {
    userStats: {
        prayerStreak: 0,
        goodDeeds: 0,
        quranPages: 0,
        gameScore: 0
    },
    
    quranVerses: [
        {
            verse: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
            surah: "الرعد - 28",
            explanation: "الذكر يطمئن القلب ويزيل الهمّ."
        },
        {
            verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
            surah: "الشرح - 5", 
            explanation: "بعد كلّ ضيق يأتي التيسير والفرج."
        },
        {
            verse: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
            surah: "طه - 25",
            explanation: "دعاء لطلب التيسير والسداد."
        }
    ],
let quranData = {};

// تحميل القرآن من ملف محلي
async function loadQuranFromFile() {
    try {
        const response = await fetch('quran.json');
        quranData = await response.json();
        displaySurahList();
    } catch (error) {
        console.error('خطأ في تحميل ملف القرآن:', error);
    }
}

function displaySurahList() {
    const surahList = document.getElementById('surahList');
    surahList.innerHTML = '';
    
    quranData.surahs.forEach(surah => {
        const surahItem = document.createElement('div');
        surahItem.className = 'surah-item list-group-item';
        surahItem.style.cursor = 'pointer';
        surahItem.style.padding = '12px 15px';
        surahItem.style.border = 'none';
        surahItem.style.borderBottom = '1px solid #eee';
        surahItem.style.transition = 'background 0.3s';
        
        surahItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${surah.id}. ${surah.name_arabic}</strong>
                    <br>
                    <small class="text-muted">${surah.name} - ${surah.verses_count} آية - ${surah.type}</small>
                </div>
                <span class="badge bg-primary">${surah.verses_count}</span>
            </div>
        `;
        
        surahItem.addEventListener('click', () => displaySurah(surah.id));
        surahItem.addEventListener('mouseenter', () => {
            surahItem.style.background = '#f8f9fa';
        });
        surahItem.addEventListener('mouseleave', () => {
            surahItem.style.background = 'white';
        });
        
        surahList.appendChild(surahItem);
    });
}

function displaySurah(surahId) {
    const surah = quranData.surahs.find(s => s.id === surahId);
    if (!surah) return;
    
    document.getElementById('surahTitle').textContent = `سورة ${surah.name_arabic}`;
    document.getElementById('surahMeta').textContent = 
        `عدد الآيات: ${surah.verses_count} - ${surah.type}`;
    
    let versesHTML = '<div class="quran-text" style="font-family: \'Amiri\', serif; font-size: 1.4em; line-height: 2.5; text-align: right;">';
    
    surah.verses.forEach((verse, index) => {
        versesHTML += `
            <div class="verse" style="margin-bottom: 25px; padding: 10px; border-radius: 8px; transition: background 0.3s;">
                <span class="verse-number" style="background: #1a5e63; color: white; padding: 4px 10px; border-radius: 50%; font-size: 0.9em; margin-left: 10px;">${index + 1}</span>
                ${verse}
            </div>
        `;
    });
    
    versesHTML += '</div>';
    document.getElementById('surahText').innerHTML = versesHTML;
    
    // إضافة تأثير عند المرور على الآية
    document.querySelectorAll('.verse').forEach(verse => {
        verse.addEventListener('mouseenter', () => {
            verse.style.background = '#f8fff8';
        });
        verse.addEventListener('mouseleave', () => {
            verse.style.background = 'transparent';
        });
    });
}
    duas: [
        {
            text: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً",
            category: "knowledge"
        },
        {
            text: "ربّ اشرح لي صدري، ويسّر لي أمري، واحلل عقدة من لساني",
            category: "ease"
        },
        {
            text: "اللهم إني أعوذ بك من الهمّ والحزن، والعجز والكسل، والجبن والبخل",
            category: "worries"
        },
        {
            text: "ربّنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
            category: "general"
        }
    ],

    quizQuestions: [
        {
            question: "كم عدد أركان الإسلام؟",
            options: ["4", "5", "6"],
            answer: "5"
        },
        {
            question: "ما هي أول آية نزلت من القرآن؟",
            options: ["اقرأ", "الفاتحة", "البقرة"],
            answer: "اقرأ"
        },
        {
            question: "من هو خاتم الأنبياء؟",
            options: ["موسى", "عيسى", "محمد"],
            answer: "محمد"
        },
        {
            question: "ما هي أعظم سورة في القرآن؟",
            options: ["البقرة", "الفاتحة", "يس"],
            answer: "الفاتحة"
        },
        {
            question: "كم عدد الركعات في صلاة الظهر؟",
            options: ["3", "4", "5"],
            answer: "4"
        },
        {
            question: "ما هي السورة التي تسمى قلب القرآن؟",
            options: ["البقرة", "يس", "الرحمن"],
            answer: "يس"
        },
        {
            question: "من هو النبي الذي سمي بخليل الله؟",
            options: ["موسى", "إبراهيم", "محمد"],
            answer: "إبراهيم"
        },
        {
            question: "كم عدد أيام شهر رمضان؟",
            options: ["29", "30", "29 أو 30"],
            answer: "29 أو 30"
        },
        {
            question: "ما هي أركان الإيمان؟",
            options: ["5", "6", "7"],
            answer: "6"
        }
    ],

    azkarCounters: {
        morning: 0,
        evening: 0,
        after: 0
    },

    memoryCards: ["🕌", "📖", "🌙", "⭐", "🤲", "🕋", "☪️", "🌟"],
    currentQuiz: null,
    quizScore: 0,
    currentQuestionIndex: 0
};

// ========== التهيئة عند تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserPreferences();
});

// ========== التهيئة الرئيسية ==========
function initializeApp() {
    loadUserData();
    setupNavigation();
    setupQuranGarden();
    setupRighteousPath();
    setupObedienceGardens();
    setupEducationalGames();
    setupProgressTracker();
    setupDailyDuas();
    updateStatsDisplay();
    loadWelcomePhrases();
}

// ========== إدارة الترجمة واللغات ==========
function setupLanguageSupport() {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function(e) {
            appConfig.currentLanguage = e.target.value;
            applyTranslations();
            saveUserPreferences();
        });
    }
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[appConfig.currentLanguage] && translations[appConfig.currentLanguage][key]) {
            element.textContent = translations[appConfig.currentLanguage][key];
        }
    });
}

// ========== إدارة الوضع الليلي ==========
function setupThemeToggle() {
    const toggleBtn = document.getElementById('toggleThemeBtn');
    const themeIcon = document.getElementById('themeIcon');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            appConfig.currentTheme = appConfig.currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', appConfig.currentTheme);
            
            // تحديث الأيقونة
            if (themeIcon) {
                themeIcon.className = appConfig.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
            
            saveUserPreferences();
        });
    }
}

// ========== إدارة التنقل ==========
function setupNavigation() {
    const openPanelBtn = document.getElementById('openPanelBtn');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const sidePanel = document.getElementById('sidePanel');
    const backdrop = document.getElementById('backdrop');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');

    // فتح وإغلاق القائمة الجانبية
    openPanelBtn.addEventListener('click', () => {
        sidePanel.classList.add('open');
        backdrop.style.display = 'block';
    });

    closePanelBtn.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);

    function closePanel() {
        sidePanel.classList.remove('open');
        backdrop.style.display = 'none';
    }

    // التنقل بين الصفحات
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-page');
            showPage(targetPage);
            closePanel();
        });
    });

    // إظهار الصفحة الأولى by default
    showPage('quran');
}

function showPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('d-none');
    });
    
    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('d-none');
    }
}

// ========== بستان القرآن ==========
function setupQuranGarden() {
    const newVerseBtn = document.getElementById('newVerseBtn');
    const recordReadingBtn = document.getElementById('recordReadingBtn');
    const pagesGoal = document.getElementById('pagesGoal');
    const goalValue = document.getElementById('goalValue');
    const newDuaBtn = document.getElementById('newDuaBtn');
    const duaCategory = document.getElementById('duaCategory');

    if (pagesGoal && goalValue) {
        pagesGoal.addEventListener('input', () => {
            goalValue.textContent = pagesGoal.value;
        });
    }

    if (newVerseBtn) {
        newVerseBtn.addEventListener('click', showRandomVerse);
    }

    if (recordReadingBtn) {
        recordReadingBtn.addEventListener('click', () => {
            const pages = parseInt(pagesGoal.value);
            updateUserStat('quranPages', pages);
            showMessage(`مبارك! أضفتِ ${pages} صفحة إلى سجلك 🌟`, 'success');
        });
    }

    if (newDuaBtn && duaCategory) {
        newDuaBtn.addEventListener('click', () => showRandomDua(duaCategory.value));
        duaCategory.addEventListener('change', () => showRandomDua(duaCategory.value));
    }

    // عرض آية عشوائية أولية
    showRandomVerse();
    showRandomDua('all');
}

function showRandomVerse() {
    const randomVerse = appData.quranVerses[Math.floor(Math.random() * appData.quranVerses.length)];
    document.getElementById('dailyVerse').textContent = `"${randomVerse.verse}"`;
    document.getElementById('verseSurah').textContent = randomVerse.surah;
    document.getElementById('verseExplanation').textContent = randomVerse.explanation;
}

function showRandomDua(category) {
    let filteredDuas = category === 'all' 
        ? appData.duas 
        : appData.duas.filter(dua => dua.category === category);
    
    if (filteredDuas.length > 0) {
        const randomDua = filteredDuas[Math.floor(Math.random() * filteredDuas.length)];
        document.getElementById('duaText').textContent = randomDua.text;
        document.getElementById('duaCategoryText').textContent = `نوع الدعاء: ${getCategoryName(randomDua.category)}`;
    }
}

function getCategoryName(category) {
    const categories = {
        knowledge: "العلم والعمل",
        ease: "التيسير",
        worries: "الهموم",
        general: "الدعاء الجامع"
    };
    return categories[category] || "عام";
}

// ========== رياض الصالحين ==========
function setupRighteousPath() {
    const recordDeedBtn = document.getElementById('recordDeedBtn');
    const calculatePrayerBtn = document.getElementById('calculatePrayerBtn');

    if (recordDeedBtn) {
        recordDeedBtn.addEventListener('click', () => {
            updateUserStat('goodDeeds', 1);
            updateUserStat('gameScore', 2);
            showMessage('ماشاء الله! عمل صالح جديد 🌟', 'success');
        });
    }

    if (calculatePrayerBtn) {
        calculatePrayerBtn.addEventListener('click', () => {
            const prayerChecks = document.querySelectorAll('.prayer-check:checked');
            if (prayerChecks.length === 5) {
                updateUserStat('prayerStreak', 1);
                updateUserStat('gameScore', 5);
                showMessage(`أحسنتِ! أكملتِ الصلوات الخمس ✅ سلسلتك: ${appData.userStats.prayerStreak} يوم`, 'success');
            } else {
                showMessage(`صليتي ${prayerChecks.length} من أصل 5 صلوات. استمري! 💪`, 'warning');
            }
        });
    }
}

// ========== جنات الطاعة ==========
function setupObedienceGardens() {
    // عدادات الأذكار
    document.querySelectorAll('.inc-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const counterType = this.getAttribute('data-counter');
            appData.azkarCounters[counterType]++;
            document.getElementById(`count${capitalizeFirst(counterType)}`).textContent = 
                appData.azkarCounters[counterType];
        });
    });

    document.querySelectorAll('.reset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const counterType = this.getAttribute('data-counter');
            appData.azkarCounters[counterType] = 0;
            document.getElementById(`count${capitalizeFirst(counterType)}`).textContent = 0;
        });
    });
}

// ========== الألعاب التربوية ==========
function setupEducationalGames() {
    setupMemoryGame();
    setupQuizGame();
    setupMoralStories();
}

function setupMemoryGame() {
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', initializeMemoryGame);
    }
    initializeMemoryGame();
}

function initializeMemoryGame() {
    const memoryBoard = document.getElementById('memoryBoard');
    if (!memoryBoard) return;

    memoryBoard.innerHTML = '';
    const cards = [...appData.memoryCards, ...appData.memoryCards];
    cards.sort(() => Math.random() - 0.5);

    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.textContent = '❓';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.addEventListener('click', handleMemoryCardClick);
        memoryBoard.appendChild(card);
    });
}

function handleMemoryCardClick(e) {
    const card = e.target;
    if (card.classList.contains('matched') || card.textContent !== '❓') return;

    card.textContent = card.dataset.symbol;
    
    const flippedCards = document.querySelectorAll('.memory-card:not(.matched)').filter(card => card.textContent !== '❓');
    
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            updateUserStat('gameScore', 5);
        } else {
            setTimeout(() => {
                card1.textContent = '❓';
                card2.textContent = '❓';
            }, 1000);
        }
    }
}

function setupQuizGame() {
    const startQuizBtn = document.getElementById('startQuizBtn');
    const nextQBtn = document.getElementById('nextQBtn');
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startNewQuiz);
    }
    
    if (nextQBtn) {
        nextQBtn.addEventListener('click', showNextQuestion);
    }
}

function startNewQuiz() {
    appData.currentQuiz = [...appData.quizQuestions].sort(() => Math.random() - 0.5).slice(0, 9);
    appData.quizScore = 0;
    appData.currentQuestionIndex = 0;
    
    document.getElementById('quizScore').textContent = '0';
    document.getElementById('currentQuestionNum').textContent = '0/9';
    document.getElementById('nextQBtn').disabled = false;
    
    showNextQuestion();
}

function showNextQuestion() {
    if (appData.currentQuestionIndex >= appData.currentQuiz.length) {
        endQuiz();
        return;
    }

    const question = appData.currentQuiz[appData.currentQuestionIndex];
    document.getElementById('quizQuestion').textContent = question.question;
    document.getElementById('currentQuestionNum').textContent = `${appData.currentQuestionIndex + 1}/9`;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-info quiz-option-btn';
        btn.textContent = option;
        btn.style.display = 'block';
        btn.onclick = () => checkQuizAnswer(option, question.answer);
        optionsContainer.appendChild(btn);
    });

    appData.currentQuestionIndex++;
}

function checkQuizAnswer(selected, correct) {
    const options = document.querySelectorAll('.quiz-option-btn');
    options.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.className = 'btn btn-success quiz-option-btn';
        } else if (btn.textContent === selected && selected !== correct) {
            btn.className = 'btn btn-danger quiz-option-btn';
        }
    });

    if (selected === correct) {
        appData.quizScore++;
        document.getElementById('quizScore').textContent = appData.quizScore;
        updateUserStat('gameScore', 2);
    }
}

function endQuiz() {
    document.getElementById('quizQuestion').textContent = `انتهى الاختبار! نتيجتك: ${appData.quizScore}/9`;
    document.getElementById('quizOptions').innerHTML = '';
    document.getElementById('nextQBtn').disabled = true;
    
    if (appData.quizScore >= 7) {
        showMessage(`ممتاز! نتيجتك ${appData.quizScore}/9 🎉`, 'success');
    } else {
        showMessage(`جيد! نتيجتك ${appData.quizScore}/9، استمري في التعلم 💪`, 'info');
    }
}

function setupMoralStories() {
    const newStoryBtn = document.getElementById('newStoryBtn');
    if (newStoryBtn) {
        newStoryBtn.addEventListener('click', showRandomStory);
    }
    showRandomStory();
}

function showRandomStory() {
    const stories = [
        {
            title: "قصة الإخلاص في العمل",
            text: "كان هناك رجل يعمل في بناء المساجد، كان يعمل بصمت وإخلاص دون أن يراه أحد. سأله صديقه: لماذا تعمل بهذا الإخلاص وأنت لوحدك؟ فأجاب: 'أنا أعلم أن الله يراني، وهذا يكفيني'."
        },
        {
            title: "موقف الصدقة الخفية", 
            text: "امرأة كانت تضع صدقتها في جيب رجل فقير نائم كل صباح دون أن يعلم. years later, اكتشف الرجل من كان يفعل ذلك وقال: 'هذه الصدقة غيرت حياتي، ليس فقط بالمال ولكن بالأمل'."
        },
        {
            title: "قيمة الصبر",
            text: "شاب أصيب بمرض منعه من متابعة دراسته، لكنه لم ييأس. استغل وقته في حفظ القرآن وتعلم العلوم الشرعية. بعد شفائه، أصبح من أكبر الدعاة في بلده."
        }
    ];

    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    document.getElementById('storyTitle').textContent = randomStory.title;
    document.getElementById('storyText').textContent = randomStory.text;
}

// ========== سجل التطور ==========
function setupProgressTracker() {
    updateProgressBars();
    setupAchievements();
}

function updateProgressBars() {
    const progressBar = document.getElementById('pagesProgress');
    const currentGoal = document.getElementById('currentGoal');
    
    if (progressBar && currentGoal) {
        const progress = (appData.userStats.quranPages / 604) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }
}

function setupAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    if (!achievementsList) return;

    const achievements = [
        { condition: appData.userStats.prayerStreak >= 7, text: "✅ أسبوع من الصلوات المتتالية" },
        { condition: appData.userStats.goodDeeds >= 10, text: "✅ 10 أعمال صالحة" },
        { condition: appData.userStats.quranPages >= 50, text: "✅ 50 صفحة من القرآن" },
        { condition: appData.userStats.gameScore >= 20, text: "✅ 20 نقطة في الألعاب" }
    ];

    achievementsList.innerHTML = '';
    achievements.forEach(achievement => {
        if (achievement.condition) {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = achievement.text;
            achievementsList.appendChild(li);
        }
    });
}

// ========== الأدعية اليومية ==========
function setupDailyDuas() {
    const filter = document.getElementById('dailyDuaFilter');
    if (filter) {
        filter.addEventListener('change', filterDailyDuas);
    }
}

function filterDailyDuas() {
    const filterValue = document.getElementById('dailyDuaFilter').value;
    const items = document.querySelectorAll('.daily-dua-item');
    
    items.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// ========== إدارة البيانات ==========
function loadUserData() {
    const saved = localStorage.getItem('spiritualOasisData');
    if (saved) {
        Object.assign(appData.userStats, JSON.parse(saved));
    }
}

function saveUserData() {
    localStorage.setItem('spiritualOasisData', JSON.stringify(appData.userStats));
}

function loadUserPreferences() {
    const prefs = localStorage.getItem('spiritualOasisPrefs');
    if (prefs) {
        const parsed = JSON.parse(prefs);
        Object.assign(appConfig, parsed);
        
        // تطبيق التفضيلات
        document.body.setAttribute('data-theme', appConfig.currentTheme);
        document.getElementById('languageSelector').value = appConfig.currentLanguage;
        
        // تحديث أيقونة الوضع
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = appConfig.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        applyTranslations();
    }
}

function saveUserPreferences() {
    localStorage.setItem('spiritualOasisPrefs', JSON.stringify(appConfig));
}

function updateUserStat(stat, value) {
    appData.userStats[stat] += value;
    saveUserData();
    updateStatsDisplay();
    setupAchievements();
}

function updateStatsDisplay() {
    document.getElementById('prayerStreak').textContent = appData.userStats.prayerStreak;
    document.getElementById('goodDeeds').textContent = appData.userStats.goodDeeds;
    document.getElementById('quranPages').textContent = appData.userStats.quranPages;
    document.getElementById('gameScore').textContent = appData.userStats.gameScore;
    updateProgressBars();
}

// ========== أدوات مساعدة ==========
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showMessage(message, type = 'info') {
    // إنشاء عنصر الرسالة
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    messageDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // إضافة الرسالة
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function loadWelcomePhrases() {
    const phrases = [
        "🌿 أسعد الله صباحكِ بالإيمان",
        "🌸 جعل الله يومكِ مليئاً بالبركات",
        "💖 رزقكِ الله السعادة في الدنيا والآخرة",
        "🕌 جعل الله قلوبنا عامرة بذكره"
    ];
    
    const phrasesList = document.getElementById('phrasesList');
    if (phrasesList) {
        phrases.forEach(phrase => {
            const li = document.createElement('li');
            li.textContent = phrase;
            li.style.padding = '5px 0';
            li.style.color = 'var(--text-secondary)';
            phrasesList.appendChild(li);
        });
    }
}

// ========== إعداد مستمعي الأحداث ==========
function setupEventListeners() {
    setupLanguageSupport();
    setupThemeToggle();
    
    // إعدادات الخط في قسم القرآن
    const increaseFont = document.getElementById('increaseFont');
    const decreaseFont = document.getElementById('decreaseFont');
    const toggleReader = document.getElementById('toggleReaderTheme');
    
    if (increaseFont) {
        increaseFont.addEventListener('click', () => changeFontSize(2));
    }
    
    if (decreaseFont) {
        decreaseFont.addEventListener('click', () => changeFontSize(-2));
    }
    
    if (toggleReader) {
        toggleReader.addEventListener('click', toggleReaderMode);
    }
}

function changeFontSize(delta) {
    appConfig.fontSize = Math.max(12, Math.min(24, appConfig.fontSize + delta));
    document.documentElement.style.fontSize = appConfig.fontSize + 'px';
}

function toggleReaderMode() {
    appConfig.readerMode = !appConfig.readerMode;
    document.body.classList.toggle('reader-mode', appConfig.readerMode);
}

// تهيئة إضافية
function initializeApp() {
    loadUserData();
    setupNavigation();
    setupQuranGarden();
    setupRighteousPath();
    setupObedienceGardens();
    setupEducationalGames();
    setupProgressTracker();
    setupDailyDuas();
    updateStatsDisplay();
    loadWelcomePhrases();
    setupEventListeners();

}

