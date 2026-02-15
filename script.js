// ======================================
// إعدادات الذكاء الاصطناعي
// ======================================

const AI_CONFIG = {
    chatModel: 'claude-sonnet-4-20250514',
    maxTokens: 4000,
    endpoint: 'https://api.anthropic.com/v1/messages'
};

// ======================================
// عناصر DOM
// ======================================

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const imageInput = document.getElementById('imageInput');
const imageAnalyzeBtn = document.getElementById('imageAnalyzeBtn');
const imageGenerateBtn = document.getElementById('imageGenerateBtn');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const messageCount = document.getElementById('messageCount');
const imageCount = document.getElementById('imageCount');

// ======================================
// المتغيرات العامة
// ======================================

let conversationHistory = [];
let currentImage = null;
let messageCounter = 0;
let imageCounter = 0;

// ======================================
// وظائف الإرسال والاستقبال
// ======================================

// إرسال رسالة
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message && !currentImage) {
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
        addMessage('ai', 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        console.error('خطأ في الاتصال بـ AI:', error);
    }
}

// استدعاء الذكاء الاصطناعي
async function callAI(userMessage, image = null) {
    try {
        // بناء محتوى الرسالة
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
        
        // إضافة الرسالة لسجل المحادثة
        conversationHistory.push({
            role: 'user',
            content: messageContent.length === 1 ? messageContent[0].text : messageContent
        });
        
        // استدعاء API
        const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: AI_CONFIG.chatModel,
                max_tokens: AI_CONFIG.maxTokens,
                messages: conversationHistory
            })
        });
        
        if (!response.ok) {
            throw new Error(`خطأ في API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // استخراج الرد
        let aiResponse = '';
        if (data.content && data.content.length > 0) {
            aiResponse = data.content
                .filter(item => item.type === 'text')
                .map(item => item.text)
                .join('\n');
        }
        
        // إضافة رد AI لسجل المحادثة
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });
        
        return aiResponse;
        
    } catch (error) {
        console.error('خطأ في callAI:', error);
        return 'عذراً، لم أتمكن من معالجة طلبك. يرجى التأكد من إضافة مفتاح API صالح.';
    }
}

// إنشاء صورة بالذكاء الاصطناعي
async function generateImage(prompt) {
    showTypingIndicator();
    
    try {
        // هنا يمكنك إضافة API لتوليد الصور
        // مثل DALL-E أو Stable Diffusion
        
        removeTypingIndicator();
        
        // رسالة توضيحية
        const message = `لإنشاء الصور، ستحتاج إلى ربط API لتوليد الصور مثل:
        
• DALL-E من OpenAI
• Stable Diffusion
• Midjourney API

يمكنك إضافة المفتاح في الكود وسأقوم بإنشاء الصورة من الوصف: "${prompt}"`;
        
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

// إضافة رسالة للدردشة
function addMessage(sender, text, image = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // إضافة الصورة إن وجدت
    if (image && sender === 'user') {
        const img = document.createElement('img');
        img.src = `data:${image.type};base64,${image.data}`;
        img.className = 'message-image';
        img.alt = 'صورة مرفقة';
        contentDiv.appendChild(img);
    }
    
    // إضافة النص
    if (text) {
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;
        contentDiv.appendChild(textDiv);
    }
    
    // إضافة الوقت
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = getCurrentTime();
    contentDiv.appendChild(timeSpan);
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // التمرير للأسفل
    scrollToBottom();
}

// عرض مؤشر الكتابة
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

// إزالة مؤشر الكتابة
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// ======================================
// وظائف إدارة الصور
// ======================================

// معالجة اختيار الصورة
imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
    }
    
    try {
        const base64 = await fileToBase64(file);
        currentImage = {
            type: file.type,
            data: base64
        };
        
        // عرض المعاينة
        previewImg.src = `data:${file.type};base64,${base64}`;
        imagePreview.style.display = 'block';
        
    } catch (error) {
        console.error('خطأ في قراءة الصورة:', error);
        alert('حدث خطأ في قراءة الصورة');
    }
});

// تحويل الملف لـ base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// مسح معاينة الصورة
function clearImagePreview() {
    currentImage = null;
    imagePreview.style.display = 'none';
    previewImg.src = '';
    imageInput.value = '';
}

// ======================================
// معالجات الأحداث
// ======================================

// زر الإرسال
sendBtn.addEventListener('click', sendMessage);

// Enter للإرسال (Shift+Enter للسطر جديد)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// تعديل حجم textarea تلقائياً
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

// زر تحليل الصورة
imageAnalyzeBtn.addEventListener('click', () => {
    imageInput.click();
});

// زر إنشاء الصورة
imageGenerateBtn.addEventListener('click', () => {
    const prompt = messageInput.value.trim();
    if (!prompt) {
        messageInput.placeholder = 'صف الصورة التي تريد إنشاءها...';
        messageInput.focus();
        return;
    }
    
    generateImage(prompt);
    messageInput.value = '';
});

// زر إزالة الصورة
removeImageBtn.addEventListener('click', clearImagePreview);

// ======================================
// وظائف مساعدة
// ======================================

// التمرير لأسفل المحادثة
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// الحصول على الوقت الحالي
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// تحديث الإحصائيات
function updateStats() {
    if (messageCount) {
        messageCount.textContent = messageCounter;
    }
    if (imageCount) {
        imageCount.textContent = imageCounter;
    }
}

// ======================================
// تهيئة التطبيق
// ======================================

document.addEventListener('DOMContentLoaded', () => {
    // التركيز على حقل الإدخال
    messageInput.focus();
    
    // تحديث الإحصائيات
    updateStats();
    
    console.log('🤖 دردشة الذكاء الاصطناعي جاهزة!');
    console.log('💡 لاستخدام الذكاء الاصطناعي، أضف مفتاح API في AI_CONFIG');
});

// ======================================
// معالجة الأخطاء العامة
// ======================================

window.addEventListener('error', (e) => {
    console.error('خطأ عام:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise مرفوض:', e.reason);
});

// ======================================
// تصدير للاستخدام الخارجي
// ======================================

window.chatApp = {
    sendMessage,
    clearChat: () => {
        chatMessages.innerHTML = '';
        conversationHistory = [];
        messageCounter = 0;
        imageCounter = 0;
        updateStats();
    },
    getHistory: () => conversationHistory
};
