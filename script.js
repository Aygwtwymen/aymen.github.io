// ======================================
// إعدادات الذكاء الاصطناعي
// ======================================

const AI_CONFIG = {
    // 🔑 اختر الخدمة:
    provider: 'gemini', // 'gemini' أو 'claude' أو 'openai'
    
    // Gemini API (مجاني!) - احصل عليه من: https://makersuite.google.com/app/apikey
    geminiKey: '', // ← ضع مفتاح Gemini هنا (مجاني!)
    
    // Claude API (مدفوع) - احصل عليه من: https://console.anthropic.com/
    claudeKey: '', // ← أو ضع مفتاح Claude هنا
    
    // OpenAI API (مدفوع) - احصل عليه من: https://platform.openai.com/
    openaiKey: '', // ← أو ضع مفتاح OpenAI هنا
    
    maxTokens: 4000
};

// ======================================
// المتغيرات العامة
// ======================================

let conversationHistory = [];
let currentImage = null;
let messageCounter = 0;
let imageCounter = 0;

// ======================================
// عناصر DOM
// ======================================

let chatMessages;
let messageInput;
let sendBtn;
let imageInput;
let imageAnalyzeBtn;
let imageGenerateBtn;
let imagePreview;
let previewImg;
let removeImageBtn;
let messageCount;
let imageCount;

// ======================================
// وظائف الإرسال والاستقبال
// ======================================

// إرسال رسالة
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message && !currentImage) {
        return;
    }
    
    // التحقق من وجود API Key
    const apiKey = getApiKey();
    if (!apiKey) {
        addMessage('ai', `⚠️ لتفعيل الدردشة، احصل على مفتاح API مجاني:

🆓 **Gemini (مجاني تماماً!):**
   https://makersuite.google.com/app/apikey
   
💰 **Claude (مدفوع - الأفضل):**
   https://console.anthropic.com/
   
💰 **OpenAI (مدفوع):**
   https://platform.openai.com/

بعد الحصول على المفتاح:
1. افتح ملف script.js
2. أضف المفتاح في السطر المناسب
3. ابدأ الدردشة! 🚀`);
        return;
    }
    
    // عرض رسالة المستخدم
    if (message) {
        addMessage('user', message, currentImage);
        messageCounter++;
        updateStats();
    }
    
    // مسح الإدخال
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // حفظ الصورة المؤقتة
    const imageToSend = currentImage;
    clearImagePreview();
    
    // عرض مؤشر الكتابة
    showTypingIndicator();
    
    // إرسال للـ AI
    try {
        const response = await callAI(message, imageToSend);
        removeTypingIndicator();
        
        if (response) {
            addMessage('ai', response);
            messageCounter++;
            updateStats();
        }
    } catch (error) {
        removeTypingIndicator();
        addMessage('ai', 'عذراً، حدث خطأ في الاتصال. يرجى التحقق من مفتاح API.');
        console.error('خطأ في الاتصال بـ AI:', error);
    }
}

// الحصول على API Key حسب المزود
function getApiKey() {
    switch(AI_CONFIG.provider) {
        case 'gemini':
            return AI_CONFIG.geminiKey;
        case 'claude':
            return AI_CONFIG.claudeKey;
        case 'openai':
            return AI_CONFIG.openaiKey;
        default:
            return AI_CONFIG.geminiKey || AI_CONFIG.claudeKey || AI_CONFIG.openaiKey;
    }
}

// استدعاء الذكاء الاصطناعي
async function callAI(userMessage, image = null) {
    const provider = AI_CONFIG.provider;
    
    try {
        switch(provider) {
            case 'gemini':
                return await callGemini(userMessage, image);
            case 'claude':
                return await callClaude(userMessage, image);
            case 'openai':
                return await callOpenAI(userMessage, image);
            default:
                return await callGemini(userMessage, image);
        }
    } catch (error) {
        console.error('خطأ في callAI:', error);
        return 'عذراً، لم أتمكن من معالجة طلبك. يرجى التحقق من مفتاح API.';
    }
}

// استدعاء Gemini (مجاني!)
async function callGemini(userMessage, image = null) {
    try {
        let content = [];
        
        if (image) {
            content.push({
                inlineData: {
                    mimeType: image.type,
                    data: image.data
                }
            });
            imageCounter++;
            updateStats();
        }
        
        if (userMessage) {
            content.push({ text: userMessage });
        }
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${AI_CONFIG.geminiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: content }]
                })
            }
        );
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('خطأ Gemini:', error);
        throw error;
    }
}

// استدعاء Claude
async function callClaude(userMessage, image = null) {
    try {
        let messageContent = [];
        
        if (image) {
            messageContent.push({
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: image.type,
                    data: image.data
                }
            });
            imageCounter++;
            updateStats();
        }
        
        if (userMessage) {
            messageContent.push({
                type: 'text',
                text: userMessage
            });
        }
        
        conversationHistory.push({
            role: 'user',
            content: messageContent.length === 1 ? messageContent[0].text : messageContent
        });
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': AI_CONFIG.claudeKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: AI_CONFIG.maxTokens,
                messages: conversationHistory
            })
        });
        
        const data = await response.json();
        const aiResponse = data.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('\n');
        
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });
        
        return aiResponse;
        
    } catch (error) {
        console.error('خطأ Claude:', error);
        throw error;
    }
}

// استدعاء OpenAI
async function callOpenAI(userMessage, image = null) {
    try {
        let messages = [];
        
        if (image) {
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: userMessage },
                    {
                        type: 'image_url',
                        image_url: { url: `data:${image.type};base64,${image.data}` }
                    }
                ]
            });
            imageCounter++;
            updateStats();
        } else {
            messages.push({
                role: 'user',
                content: userMessage
            });
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.openaiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4-vision-preview',
                messages: messages,
                max_tokens: AI_CONFIG.maxTokens
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('خطأ OpenAI:', error);
        throw error;
    }
}

// إنشاء صورة بالذكاء الاصطناعي
async function generateImage(prompt) {
    showTypingIndicator();
    
    try {
        removeTypingIndicator();
        
        const message = `لإنشاء الصور، ستحتاج إلى:
        
• DALL-E من OpenAI (مدفوع)
• Stable Diffusion (مجاني مع استضافة)
• Midjourney API (مدفوع)

الوصف المطلوب: "${prompt}"`;
        
        addMessage('ai', message);
        
    } catch (error) {
        removeTypingIndicator();
        addMessage('ai', 'عذراً، حدث خطأ في إنشاء الصورة.');
        console.error('خطأ في generateImage:', error);
    }
}

// ======================================
// وظائف إدارة الرسائل
// ======================================

function addMessage(sender, text, image = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (image && sender === 'user') {
        const img = document.createElement('img');
        img.src = `data:${image.type};base64,${image.data}`;
        img.className = 'message-image';
        img.alt = 'صورة مرفقة';
        contentDiv.appendChild(img);
    }
    
    if (text) {
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;
        contentDiv.appendChild(textDiv);
    }
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = getCurrentTime();
    contentDiv.appendChild(timeSpan);
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
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

// ======================================
// وظائف إدارة الصور
// ======================================

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

// ======================================
// وظائف مساعدة
// ======================================

function scrollToBottom() {
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function updateStats() {
    if (messageCount) messageCount.textContent = messageCounter;
    if (imageCount) imageCount.textContent = imageCounter;
}

// ======================================
// تهيئة التطبيق
// ======================================

document.addEventListener('DOMContentLoaded', () => {
    chatMessages = document.getElementById('chatMessages');
    messageInput = document.getElementById('messageInput');
    sendBtn = document.getElementById('sendBtn');
    imageInput = document.getElementById('imageInput');
    imageAnalyzeBtn = document.getElementById('imageAnalyzeBtn');
    imageGenerateBtn = document.getElementById('imageGenerateBtn');
    imagePreview = document.getElementById('imagePreview');
    previewImg = document.getElementById('previewImg');
    removeImageBtn = document.getElementById('removeImage');
    messageCount = document.getElementById('messageCount');
    imageCount = document.getElementById('imageCount');
    
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
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });
        
        messageInput.focus();
    }
    
    if (imageAnalyzeBtn) {
        imageAnalyzeBtn.addEventListener('click', () => {
            if (imageInput) imageInput.click();
        });
    }
    
    if (imageGenerateBtn) {
        imageGenerateBtn.addEventListener('click', () => {
            const prompt = messageInput ? messageInput.value.trim() : '';
            if (!prompt) {
                if (messageInput) {
                    messageInput.placeholder = 'صف الصورة التي تريد إنشاءها...';
                    messageInput.focus();
                }
                return;
            }
            generateImage(prompt);
            if (messageInput) messageInput.value = '';
        });
    }
    
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', clearImagePreview);
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
    
    updateStats();
    
    console.log('🤖 دردشة الذكاء الاصطناعي جاهزة!');
    console.log('📍 المزود الحالي:', AI_CONFIG.provider);
    
    const apiKey = getApiKey();
    if (!apiKey) {
        console.warn('⚠️ يرجى إضافة مفتاح API');
    } else {
        console.log('✅ مفتاح API موجود - الدردشة جاهزة!');
    }
});

window.addEventListener('error', (e) => console.error('خطأ عام:', e.error));
window.addEventListener('unhandledrejection', (e) => console.error('Promise مرفوض:', e.reason));

window.chatApp = {
    sendMessage: () => sendMessage(),
    clearChat: () => {
        if (chatMessages) chatMessages.innerHTML = '';
        conversationHistory = [];
        messageCounter = 0;
        imageCounter = 0;
        updateStats();
    },
    getHistory: () => conversationHistory
};
