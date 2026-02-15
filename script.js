// ============================================
// DOM Elements
// ============================================
let chatMessages;
let messageInput;
let sendBtn;
let attachBtn;
let imageInput;
let imagePreview;
let previewImg;
let removeImageBtn;
let newChatBtn;
let chatHistory;

// ============================================
// State
// ============================================
let currentImage = null;
let conversationHistory = [];
let chatSessions = [];
let currentSessionId = null;

// ============================================
// AI Engine - Enhanced
// ============================================

function generateSmartResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // تحيات
    if (/^(مرحب|هلا|السلام|أهلا|صباح|مساء|hi|hello)/.test(message)) {
        return "مرحباً بك! 😊 سعيد جداً برؤيتك هنا.\n\nأنا مساعد ذكاء اصطناعي صُمّمت لأكون صديقك في رحلة التعلم والاستكشاف. سواء كنت تريد:\n• تعلم شيء جديد\n• حل مشكلة\n• فهم موضوع معقد\n• أو حتى مجرد دردشة لطيفة\n\nأنا هنا لك! 🌟\n\nكيف يمكنني مساعدتك اليوم؟";
    }
    
    // كيف حالك
    if (/كيف حالك|حالك|كيفك|how are you/.test(message)) {
        return "أنا بأفضل حال، شكراً لسؤالك! 💚\n\nكمساعد AI، أنا دائماً متحمس ومستعد. كل محادثة جديدة معك هي فرصة رائعة للتعلم والمساعدة.\n\n**وأنت؟ كيف يومك؟**\nهل هناك شيء أستطيع مساعدتك فيه؟ أخبرني بأي شيء - سواء سؤال، مشكلة، أو حتى مجرد محادثة ودية! ☺️";
    }
    
    // شكر
    if (/شكر|thanks|شكراً/.test(message)) {
        return "العفو، من دواعي سروري! 🌟\n\nمساعدتك هي أجمل ما أفعله. إذا احتجت أي شيء آخر - مهما كان صغيراً - لا تتردد.\n\nأنا هنا دائماً! 😊";
    }
    
    // من أنت
    if (/من أنت|ما اسمك|who are you/.test(message)) {
        return "مرحباً! أنا مساعد ذكاء اصطناعي متقدم 🤖\n\n**من أكون؟**\nصُممت لأكون رفيقك الودود في التعلم. أستطيع:\n✓ شرح المفاهيم ببساطة\n✓ مساعدتك في البرمجة\n✓ حل المسائل الرياضية\n✓ كتابة المحتوى\n✓ والأهم: الاستماع لك بكل اهتمام!\n\n**فلسفتي:**\nأؤمن بأن التعلم يجب أن يكون ممتعاً، وأن الشرح الجيد يجعل المعقد بسيطاً.\n\n**ما يميزني:**\n• أشرح خطوة بخطوة\n• أستخدم أمثلة واقعية\n• أتحدث بودية\n• صبور ومشجع\n\nالآن، أخبرني عنك! ما الذي يثير فضولك؟ 🌟";
    }
    
    // البرمجة
    if (/برمج|كود|python|javascript|java|html|css|program|code/.test(message)) {
        if (message.includes('python') || message.includes('بايثون')) {
            return "Python - لغة المستقبل! 🐍\n\n**لماذا Python رائعة؟**\n• سهلة جداً للمبتدئين\n• قوية جداً للمحترفين\n• تُستخدم في AI، Data Science، Web\n• مكتبات ضخمة لكل شيء\n\n**مثال بسيط:**\n```python\nname = 'أحمد'\nprint(f'مرحباً {name}!')\n# النتيجة: مرحباً أحمد!\n```\n\n**خطة التعلم:**\n1️⃣ الأساسيات (أسبوعان)\n2️⃣ Data Structures (أسبوع)\n3️⃣ OOP (أسبوع)\n4️⃣ مشاريع صغيرة\n\n**نصيحة:** اكتب كود يومياً ولو 30 دقيقة فقط!\n\nهل تريد البدء؟ 🚀";
        } else if (message.includes('javascript') || message.includes('جافاسكريبت')) {
            return "JavaScript - لغة الويب! ✨\n\n**قوتها:**\n• موجودة في كل متصفح\n• تطوير Frontend و Backend\n• تطبيقات موبايل (React Native)\n• ألعاب وتطبيقات ضخمة\n\n**مثال:**\n```javascript\nfunction greet(name) {\n  return `مرحباً ${name}!`;\n}\nconsole.log(greet('سارة'));\n```\n\n**المسار:**\n1. HTML & CSS أولاً\n2. JavaScript الأساسي\n3. DOM Manipulation\n4. ES6+ Features\n5. React أو Vue\n\n**مشاريع للبداية:**\n• آلة حاسبة\n• To-Do List\n• Weather App\n\nجاهز للبدء؟ 💪";
        } else {
            return "البرمجة - مهارة القرن! 💻\n\n**من أين تبدأ؟**\n\n**للمبتدئين:**\n• Python (الأسهل)\n• JavaScript (للويب)\n\n**للألعاب:**\n• C# (Unity)\n• C++ (Unreal)\n\n**للتطبيقات:**\n• Flutter (متعدد المنصات)\n• Swift (iOS)\n• Kotlin (Android)\n\n**خطة 30 يوم:**\n📅 أسبوع 1: الأساسيات\n📅 أسبوع 2: Data Structures\n📅 أسبوع 3: مشروع صغير\n📅 أسبوع 4: تحسين المشروع\n\n**القاعدة الذهبية:**\nاكتب كود كل يوم، حتى لو 15 دقيقة فقط!\n\nما اللغة التي تشدك؟ 🎯";
        }
    }
    
    // الذكاء الاصطناعي
    if (/ذكاء اصطناعي|ai|machine learning|تعلم آلي|chatgpt/.test(message)) {
        return "الذكاء الاصطناعي - ثورة عصرنا! 🤖\n\n**ما هو AI؟**\nمحاكاة الذكاء البشري في الآلات. تتعلم من البيانات وتتحسن مع الوقت!\n\n**الأنواع:**\n\n**1️⃣ Machine Learning**\n• يتعلم من الأمثلة\n• مثال: توصيات YouTube\n\n**2️⃣ Deep Learning**\n• شبكات عصبية عميقة\n• مثال: التعرف على الوجوه\n\n**3️⃣ NLP**\n• فهم اللغة البشرية\n• مثال: ChatGPT، أنا!\n\n**4️⃣ Computer Vision**\n• فهم الصور والفيديو\n• مثال: السيارات الذكية\n\n**التطبيقات:**\n🚗 سيارات ذاتية القيادة\n🏥 تشخيص أمراض\n🎨 توليد فن\n💬 مساعدات ذكية\n\n**كيف تبدأ:**\n1. تعلم Python\n2. فهم الرياضيات الأساسية\n3. تعلم TensorFlow أو PyTorch\n4. ابدأ بمشاريع بسيطة\n\n**المستقبل:**\nAI سيغير كل شيء - التعليم، الصحة، العمل، الحياة!\n\nهل تريد التعمق أكثر؟ 🚀";
    }
    
    // الرياضيات
    if (/احسب|حساب|رياضيات|جمع|طرح|ضرب|قسمة|math|\+|\-|\*|\/|×|÷/.test(message)) {
        const numbers = message.match(/\d+\.?\d*/g);
        
        if (numbers && numbers.length >= 2) {
            const num1 = parseFloat(numbers[0]);
            const num2 = parseFloat(numbers[1]);
            
            let result, operation, symbol;
            
            if (message.includes('+') || message.includes('جمع') || message.includes('زائد')) {
                result = num1 + num2;
                operation = 'الجمع';
                symbol = '+';
            } else if (message.includes('-') || message.includes('طرح') || message.includes('ناقص')) {
                result = num1 - num2;
                operation = 'الطرح';
                symbol = '-';
            } else if (message.includes('×') || message.includes('*') || message.includes('ضرب')) {
                result = num1 * num2;
                operation = 'الضرب';
                symbol = '×';
            } else if (message.includes('÷') || message.includes('/') || message.includes('قسمة')) {
                result = num1 / num2;
                operation = 'القسمة';
                symbol = '÷';
            }
            
            if (result !== undefined) {
                return `بكل سرور! دعني أحسب ذلك 🧮\n\n**العملية: ${operation}**\n\n**خطوة بخطوة:**\n${num1} ${symbol} ${num2}\n\n**الحل:**\n= ${result}\n\n**النتيجة النهائية:** ✨ ${result} ✨\n\n${result > 100 ? 'رقم كبير! 🎉' : result < 0 ? 'رقم سالب!' : 'رقم جميل! 😊'}\n\nهل تريد حساب شيء آخر؟`;
            }
        }
        
        return "الرياضيات - لغة الكون! 📐\n\n**يمكنني مساعدتك في:**\n✓ العمليات الحسابية\n✓ شرح المفاهيم\n✓ حل المعادلات\n✓ الجبر والهندسة\n\n**مثال:**\naسألني: \"احسب 25 + 37\"\n\n**نصيحة:**\nالرياضيات ليست صعبة، فقط تحتاج ممارسة!\n\nما المسألة التي تريد حلها؟ 🤔";
    }
    
    // قصة
    if (/قصة|حكاية|story/.test(message)) {
        return "بكل سرور! قصة ملهمة لك 📖✨\n\n**قصة الفراشة والشرنقة**\n\nوجد رجل شرنقة فراشة، ورأى ثقباً صغيراً فيها. جلس ساعات يراقب الفراشة تكافح للخروج.\n\nبعد وقت طويل، توقفت الفراشة عن المحاولة. أشفق عليها الرجل وقرر مساعدتها - وسّع الثقب بمقص.\n\nخرجت الفراشة بسهولة، لكن... جسمها كان منتفخاً وأجنحتها صغيرة وضعيفة. لم تستطع الطيران أبداً.\n\n**الحقيقة:**\nالرجل لم يعلم أن الكفاح للخروج ضروري! إنه يدفع السوائل من جسم الفراشة إلى أجنحتها، ليجعلها قوية وقادرة على الطيران.\n\n**العبرة:**\n💎 الصعوبات في الحياة ليست عقبات، بل هي ما يجعلنا أقوى\n💎 الكفاح والتحديات ضرورية للنمو\n💎 الحلول السهلة قد تحرمنا من القوة الحقيقية\n\n**سؤالي لك:**\nما هي المشكلة التي تواجهها الآن، والتي قد تكون فرصة لتصبح أقوى؟ 🦋";
    }
    
    // الوقت
    if (/وقت|تاريخ|ساعة|date|time/.test(message)) {
        const now = new Date();
        const time = now.toLocaleTimeString('ar-SA');
        const date = now.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        return `⏰ **الوقت الحالي:**\n${time}\n\n📅 **التاريخ:**\n${date}\n\n✨ كل لحظة هي فرصة جديدة!\n\nهل تحتاج مساعدة في شيء آخر؟`;
    }
    
    // مساعدة
    if (/ساعد|مساعدة|help|ممكن|قدراتك/.test(message)) {
        return "بكل سرور أساعدك! 🌟\n\n**قدراتي:**\n\n**📚 التعليم والشرح**\n• شرح أي مفهوم ببساطة\n• مساعدة في الدراسة\n• تعليم البرمجة خطوة بخطوة\n\n**💻 البرمجة**\n• شرح الأكواد\n• حل المشاكل البرمجية\n• نصائح للتعلم\n\n**🔢 الرياضيات**\n• حل المسائل\n• شرح المفاهيم\n• عمليات حسابية\n\n**✍️ الكتابة**\n• كتابة محتوى\n• قصص ملهمة\n• أفكار إبداعية\n\n**💡 النصائح**\n• تطوير شخصي\n• حل مشاكل\n• تخطيط مشاريع\n\n**🗣️ المحادثة**\n• دردشة ودية\n• استماع بكل اهتمام\n• دعم ومساندة\n\n**أسلوبي:**\n• شرح واضح وبسيط\n• أمثلة عملية\n• لغة دافئة وودية\n• صبر لا محدود\n\nما الذي تحتاج مساعدة فيه اليوم؟ 🚀";
    }
    
    // رد ذكي طويل
    if (message.length > 100) {
        return `أرى أن لديك موضوع مهم! 📝\n\n**ما فهمته:**\nسؤالك مفصل ويحتاج إجابة شاملة.\n\n**الحقيقة:**\nكمساعد محلي بدون API، قدرتي على التحليل العميق محدودة، لكنني سأبذل أقصى ما أستطيع!\n\n**اقتراحي:**\n• قسّم سؤالك لنقاط أصغر\n• اسألني عن نقطة واحدة في كل مرة\n• سأعطيك إجابات أوضح وأدق\n\n**مثال:**\nبدلاً من: \"اشرح لي كل شيء عن البرمجة والذكاء الاصطناعي والتطوير\"\nجرب: \"ما أفضل لغة برمجة للذكاء الاصطناعي؟\"\n\n**وعد:**\nمع أسئلة محددة، سأعطيك إجابات رائعة! 💯\n\nما أهم نقطة تريد التركيز عليها؟`;
    }
    
    // رد افتراضي ذكي
    const smartDefaults = [
        `سؤال مثير! 🤔\n\n**تحليلي:**\nموضوعك واسع وممتع، لكن كمساعد محلي، معرفتي محدودة.\n\n**ما أستطيع:**\n• شرح المفاهيم الأساسية\n• تقديم أمثلة\n• مساعدة في التفكير المنطقي\n• نقاش ودي ومفيد\n\n**اقتراح:**\nأعطني تفاصيل أكثر أو حدد جانباً معيناً، وسأساعدك بشكل أفضل!\n\nهل يمكنك توضيح سؤالك أكثر؟ 😊`,
        
        `موضوع رائع! 🌟\n\n**صراحة:**\nكمساعد AI بدون API، قدراتي محدودة، لكن روحي متحمسة لمساعدتك!\n\n**أستطيع مساعدتك في:**\n✓ البرمجة والتقنية\n✓ الرياضيات والعلوم\n✓ الشرح والتوضيح\n✓ الدعم والتشجيع\n\n**خطوة ذكية:**\nاجعل سؤالك محدداً قدر الإمكان، وسأقدم لك أفضل ما عندي!\n\nماذا تريد أن تعرف بالتحديد؟ 🎯`,
        
        `أقدر سؤالك! 💭\n\n**الحقيقة:**\nأنا مساعد محلي، ليس لدي اتصال بالإنترنت أو APIs كبرى.\n\n**لكن!**\nمازلت أستطيع مساعدتك في الكثير:\n• شرح المفاهيم\n• البرمجة\n• الرياضيات\n• النصائح\n• المحادثة الودية\n\n**نصيحة:**\nكلما كان سؤالك أوضح وأبسط، كانت إجابتي أفضل!\n\nهل تريد إعادة صياغة سؤالك؟ 🤗`
    ];
    
    return smartDefaults[Math.floor(Math.random() * smartDefaults.length)];
}

function analyzeImage() {
    return "صورة جميلة! 📸\n\n**ملاحظة:**\nحالياً أعمل محلياً بدون API، لذا لا أستطيع تحليل الصور فعلياً.\n\n**للحصول على تحليل حقيقي:**\n• اربط الموقع بـ Gemini API (مجاني)\n• أو Claude/GPT-4 Vision APIs\n\n**حل بديل:**\nصف لي ما في الصورة، وسأساعدك بناءً على وصفك!\n\nماذا تريد أن تعرف عن الصورة؟ 🤔";
}

// ============================================
// Message Functions
// ============================================
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message && !currentImage) return;
    
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) welcomeScreen.remove();
    
    const userMessage = message;
    const imageToAnalyze = currentImage;
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    clearImagePreview();
    
    if (userMessage || imageToAnalyze) {
        addMessage('user', userMessage, imageToAnalyze);
        conversationHistory.push({ role: 'user', content: userMessage });
    }
    
    showTypingIndicator();
    await sleep(800 + Math.random() * 1000);
    
    const aiResponse = imageToAnalyze ? analyzeImage() : generateSmartResponse(userMessage);
    
    removeTypingIndicator();
    addMessage('ai', aiResponse);
    conversationHistory.push({ role: 'ai', content: aiResponse });
    
    updateChatHistory(userMessage);
}

function addMessage(sender, text, image = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (image && sender === 'user') {
        const img = document.createElement('img');
        img.src = `data:${image.type};base64,${image.data}`;
        img.className = 'message-image';
        contentDiv.appendChild(img);
    }
    
    if (text) {
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;
        contentDiv.appendChild(textDiv);
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    requestAnimationFrame(() => scrollToBottom());
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = 'typingIndicator';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(indicator);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// ============================================
// Helpers
// ============================================
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function clearImagePreview() {
    currentImage = null;
    if (imagePreview) imagePreview.style.display = 'none';
    if (previewImg) previewImg.src = '';
    if (imageInput) imageInput.value = '';
}

function updateChatHistory(message) {
    if (!currentSessionId) {
        currentSessionId = Date.now();
        chatSessions.push({
            id: currentSessionId,
            title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
            timestamp: new Date()
        });
    }
    renderChatHistory();
}

function renderChatHistory() {
    if (!chatHistory) return;
    chatHistory.innerHTML = '';
    
    chatSessions.slice().reverse().forEach(session => {
        const item = document.createElement('div');
        item.className = 'chat-history-item';
        if (session.id === currentSessionId) item.classList.add('active');
        item.textContent = session.title;
        chatHistory.appendChild(item);
    });
}

function startNewChat() {
    chatMessages.innerHTML = `
        <div class="welcome-screen">
            <div class="welcome-logo">
                <div class="logo-gradient">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                </div>
            </div>
            <h1 class="welcome-title">كيف يمكنني مساعدتك اليوم؟</h1>
            
            <div class="suggestion-cards">
                <div class="suggestion-card" data-prompt="اشرح لي مفهوم الذكاء الاصطناعي بطريقة بسيطة">
                    <div class="card-icon">🤖</div>
                    <div class="card-title">اشرح الذكاء الاصطناعي</div>
                    <div class="card-text">بطريقة سهلة ومفهومة</div>
                </div>
                <div class="suggestion-card" data-prompt="كيف أبدأ تعلم البرمجة من الصفر">
                    <div class="card-icon">💻</div>
                    <div class="card-title">تعلم البرمجة</div>
                    <div class="card-text">من البداية للاحتراف</div>
                </div>
                <div class="suggestion-card" data-prompt="احسب لي 458 + 792">
                    <div class="card-icon">🔢</div>
                    <div class="card-title">حسابات رياضية</div>
                    <div class="card-text">سريعة ودقيقة</div>
                </div>
                <div class="suggestion-card" data-prompt="اكتب لي قصة قصيرة ملهمة عن النجاح">
                    <div class="card-icon">✨</div>
                    <div class="card-title">قصة ملهمة</div>
                    <div class="card-text">محفزة ومؤثرة</div>
                </div>
            </div>
        </div>
    `;
    
    conversationHistory = [];
    currentSessionId = null;
    attachSuggestionListeners();
}

function scrollToBottom() {
    if (chatMessages) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function attachSuggestionListeners() {
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            messageInput.value = prompt;
            sendMessage();
        });
    });
}

// ============================================
// Init
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    chatMessages = document.getElementById('chatMessages');
    messageInput = document.getElementById('messageInput');
    sendBtn = document.getElementById('sendBtn');
    attachBtn = document.getElementById('attachBtn');
    imageInput = document.getElementById('imageInput');
    imagePreview = document.getElementById('imagePreview');
    previewImg = document.getElementById('previewImg');
    removeImageBtn = document.getElementById('removeImage');
    newChatBtn = document.getElementById('newChatBtn');
    chatHistory = document.getElementById('chatHistory');
    
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
        
        messageInput.focus();
    }
    
    if (attachBtn) attachBtn.addEventListener('click', () => imageInput && imageInput.click());
    
    if (imageInput) {
        imageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.startsWith('image/')) {
                alert('يرجى اختيار ملف صورة صالح');
                return;
            }
            
            try {
                const base64 = await fileToBase64(file);
                currentImage = { type: file.type, data: base64 };
                
                if (previewImg) previewImg.src = `data:${file.type};base64,${base64}`;
                if (imagePreview) imagePreview.style.display = 'block';
            } catch (error) {
                alert('حدث خطأ في قراءة الصورة');
            }
        });
    }
    
    if (removeImageBtn) removeImageBtn.addEventListener('click', clearImagePreview);
    if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);
    
    attachSuggestionListeners();
    
    console.log('✅ AI Chat جاهز - نسخة ذكية محسّنة!');
});
