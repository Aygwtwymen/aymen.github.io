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
// AI Response Engine (يعمل بدون API!)
// ============================================
const AI_RESPONSES = {
    greetings: [
        "مرحباً! كيف يمكنني مساعدتك اليوم؟",
        "أهلاً بك! سعيد بالتحدث معك.",
        "مرحباً! أنا هنا لمساعدتك."
    ],
    
    help: [
        "يمكنني مساعدتك في:\n• الإجابة على الأسئلة\n• كتابة المحتوى\n• شرح المفاهيم\n• حل المشاكل\n• والمزيد!",
        "أنا مساعد ذكاء اصطناعي يمكنه:\n- التحدث معك\n- الإجابة على استفساراتك\n- تقديم المعلومات\n- المساعدة في المهام المختلفة"
    ],
    
    programming: [
        "البرمجة مجال رائع! يمكنني مساعدتك في:\n• تعلم أساسيات البرمجة\n• شرح المفاهيم\n• حل المشاكل البرمجية\n• اقتراح مشاريع\n\nما الذي تريد معرفته تحديداً؟",
        "للبدء في البرمجة، أنصحك بـ:\n1. اختيار لغة برمجة (مثل Python)\n2. تعلم الأساسيات\n3. ممارسة الكود يومياً\n4. بناء مشاريع صغيرة\n\nهل تريد المزيد من التفاصيل؟"
    ],
    
    ai: [
        "الذكاء الاصطناعي هو محاكاة الذكاء البشري بواسطة الآلات.\n\nيتضمن:\n• التعلم الآلي\n• معالجة اللغة الطبيعية\n• رؤية الكمبيوتر\n• الأنظمة الخبيرة\n\nهل تريد معرفة المزيد عن جانب معين؟",
        "AI يغير العالم!\n\nالتطبيقات:\n- المساعدات الصوتية\n- السيارات ذاتية القيادة\n- التشخيص الطبي\n- الترجمة الآلية\n\nما الذي يثير اهتمامك؟"
    ],
    
    story: [
        "سأكتب لك قصة قصيرة:\n\nفي قرية صغيرة، كان هناك طفل يحلم بالنجوم. كل ليلة، كان يجلس على السطح ويحدق في السماء. لم يكن يعلم أن حلمه سيتحقق يوماً ما...\n\nأصبح ذلك الطفل أول رائد فضاء من قريته، مثبتاً أن الأحلام تتحقق بالإصرار والعمل الجاد.\n\nهل أعجبتك القصة؟",
        "حسناً، إليك قصة ملهمة:\n\nكان هناك روبوت صغير يعيش في مصنع. كان يحلم بأن يكون مفيداً. في يوم من الأيام، أنقذ حياة عامل سقط من مكان مرتفع.\n\nأدرك الجميع أن الحجم لا يهم، المهم هو القلب الكبير والنية الصادقة.\n\nالعبرة: كل شخص لديه قيمة فريدة."
    ],
    
    default: [
        "هذا سؤال مثير للاهتمام! دعني أفكر فيه...\n\nبناءً على معرفتي، يمكنني أن أقول أن هذا الموضوع يتطلب فهماً عميقاً. هل يمكنك إعطائي المزيد من التفاصيل حتى أتمكن من مساعدتك بشكل أفضل؟",
        "شكراً على سؤالك! هذا موضوع واسع ومهم.\n\nمن وجهة نظري، يجب النظر إلى الموضوع من زوايا متعددة. هل تريد معلومات محددة أم نظرة عامة؟",
        "سؤال جيد! دعني أساعدك...\n\nهناك عدة جوانب لهذا الموضوع. يمكنني تقديم معلومات أو شرح أو مناقشة الموضوع معك. ما الذي تفضله؟"
    ]
};

// ============================================
// Smart Response Generator
// ============================================
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // تحليل النص واختيار الرد المناسب
    if (/مرحب|هلا|السلام|أهلا|صباح|مساء/.test(message)) {
        return getRandomResponse(AI_RESPONSES.greetings);
    }
    
    if (/ساعد|مساعدة|help|تفعل/.test(message)) {
        return getRandomResponse(AI_RESPONSES.help);
    }
    
    if (/برمج|كود|بايثون|جافا|program|code/.test(message)) {
        return getRandomResponse(AI_RESPONSES.programming);
    }
    
    if (/ذكاء اصطناعي|ai|تعلم آلي|machine learning/.test(message)) {
        return getRandomResponse(AI_RESPONSES.ai);
    }
    
    if (/قصة|حكاية|story/.test(message)) {
        return getRandomResponse(AI_RESPONSES.story);
    }
    
    if (/كيف حالك|حالك|كيفك/.test(message)) {
        return "أنا بخير، شكراً لسؤالك! 😊\nأنا مساعد AI جاهز دائماً لمساعدتك. كيف يمكنني مساعدتك اليوم؟";
    }
    
    if (/شكرا|شكراً|thanks|thank you/.test(message)) {
        return "العفو! سعيد بمساعدتك. 😊\nإذا كان لديك أي سؤال آخر، أنا هنا!";
    }
    
    if (/من أنت|ما اسمك|who are you/.test(message)) {
        return "أنا مساعد ذكاء اصطناعي تم تطويري لمساعدتك! 🤖\n\nيمكنني:\n• الإجابة على أسئلتك\n• كتابة المحتوى\n• شرح المفاهيم\n• المساعدة في البرمجة\n• والمزيد!\n\nكيف يمكنني مساعدتك؟";
    }
    
    if (/وقت|تاريخ|date|time/.test(message)) {
        const now = new Date();
        return `الوقت الحالي: ${now.toLocaleTimeString('ar-SA')}\nالتاريخ: ${now.toLocaleDateString('ar-SA')}`;
    }
    
    // ردود ذكية بناءً على طول الرسالة
    if (message.length > 100) {
        return "أرى أن لديك سؤال مفصل! دعني أحلله...\n\nبناءً على ما كتبته، أفهم أنك تبحث عن معلومات شاملة. للأسف، كوني نموذج تجريبي، قدراتي محدودة، لكنني سأحاول مساعدتك قدر الإمكان.\n\nما هو الجانب الأكثر أهمية الذي تريد التركيز عليه؟";
    }
    
    // رد افتراضي ذكي
    return getRandomResponse(AI_RESPONSES.default);
}

function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// ============================================
// Image Analysis (محاكاة)
// ============================================
function analyzeImage() {
    const responses = [
        "رائع! أرى صورة جميلة. 🖼️\n\nتظهر الصورة محتوى مثير للاهتمام. للأسف، قدراتي في تحليل الصور محدودة في هذا الإصدار، لكنني أستطيع رؤية أنها صورة واضحة وجيدة الجودة.\n\nهل تريد أن تخبرني عن الصورة؟",
        "شكراً على مشاركة الصورة! 📸\n\nيمكنني رؤية أنك أرفقت صورة. في الإصدار الكامل، سأتمكن من تحليلها بالتفصيل، لكن حالياً يمكنني المساعدة بأسئلة نصية عنها.\n\nماذا تريد أن تعرف عن هذه الصورة؟",
        "صورة رائعة! 🎨\n\nأستطيع رؤية أنك شاركت صورة معي. للحصول على تحليل متقدم للصور، ستحتاج النسخة المتصلة بـ API، لكن يمكنني مساعدتك بأسئلة حولها!\n\nصف لي ما في الصورة وسأساعدك."
    ];
    
    return getRandomResponse(responses);
}

// ============================================
// Message Functions
// ============================================
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message && !currentImage) {
        return;
    }
    
    // Hide welcome screen BEFORE adding messages
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.remove();
    }
    
    // Clear input first
    const userMessage = message;
    const imageToAnalyze = currentImage;
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    clearImagePreview();
    
    // Add user message
    if (userMessage || imageToAnalyze) {
        addMessage('user', userMessage, imageToAnalyze);
        conversationHistory.push({ role: 'user', content: userMessage });
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI thinking
    await sleep(1000 + Math.random() * 1500);
    
    // Generate response
    let aiResponse;
    if (imageToAnalyze) {
        aiResponse = analyzeImage();
    } else {
        aiResponse = generateAIResponse(userMessage);
    }
    
    removeTypingIndicator();
    addMessage('ai', aiResponse);
    conversationHistory.push({ role: 'ai', content: aiResponse });
    
    // Update chat history
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
    
    // Scroll after DOM update
    requestAnimationFrame(() => {
        scrollToBottom();
    });
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = 'typingIndicator';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    typingDiv.appendChild(indicator);
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// ============================================
// Image Handling
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

// ============================================
// Chat History
// ============================================
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
        if (session.id === currentSessionId) {
            item.classList.add('active');
        }
        item.textContent = session.title;
        item.onclick = () => loadChatSession(session.id);
        chatHistory.appendChild(item);
    });
}

function loadChatSession(sessionId) {
    // Implementation for loading chat sessions
    currentSessionId = sessionId;
    renderChatHistory();
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
                <div class="suggestion-card" data-prompt="اشرح لي مفهوم الذكاء الاصطناعي">
                    <div class="card-icon">🤖</div>
                    <div class="card-title">اشرح مفهوم</div>
                    <div class="card-text">الذكاء الاصطناعي</div>
                </div>
                <div class="suggestion-card" data-prompt="اكتب لي قصة قصيرة">
                    <div class="card-icon">✍️</div>
                    <div class="card-title">اكتب قصة</div>
                    <div class="card-text">إبداعية قصيرة</div>
                </div>
                <div class="suggestion-card" data-prompt="ساعدني في تعلم البرمجة">
                    <div class="card-icon">💻</div>
                    <div class="card-title">تعلم البرمجة</div>
                    <div class="card-text">من البداية</div>
                </div>
                <div class="suggestion-card" data-prompt="أفكار مشاريع برمجية">
                    <div class="card-icon">💡</div>
                    <div class="card-title">أفكار مشاريع</div>
                    <div class="card-text">برمجية مبتكرة</div>
                </div>
            </div>
        </div>
    `;
    
    conversationHistory = [];
    currentSessionId = null;
    
    // Re-attach suggestion card listeners
    attachSuggestionListeners();
}

// ============================================
// Helper Functions
// ============================================
function scrollToBottom() {
    if (chatMessages) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
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
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
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
    
    // Event listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
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
    
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            if (imageInput) imageInput.click();
        });
    }
    
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
                console.error('خطأ في قراءة الصورة:', error);
                alert('حدث خطأ في قراءة الصورة');
            }
        });
    }
    
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', clearImagePreview);
    }
    
    if (newChatBtn) {
        newChatBtn.addEventListener('click', startNewChat);
    }
    
    // Attach suggestion card listeners
    attachSuggestionListeners();
    
    console.log('✅ AI Chat جاهز - يعمل بدون API!');
});
