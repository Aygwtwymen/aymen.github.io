// رسالة ترحيب في الكونسول
console.log('🎉 مرحباً! موقعك يعمل بنجاح');
console.log('💻 تم تطويره باستخدام: HTML + CSS + JavaScript');

// دالة إظهار تنبيه
function showAlert() {
    alert('🎉 مرحباً بك في موقعي!\n\nهذا موقع تجريبي على الدارك ويب\nتم إنشاؤه باستخدام OnionShare');
}

// عداد الأرقام المتحرك
function animateCounter(id, target, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// تشغيل العدادات عند تحميل الصفحة
window.addEventListener('load', () => {
    animateCounter('counter1', 1000, 2000);
    animateCounter('counter2', 50, 2000);
    animateCounter('counter3', 25, 2000);
});

// دالة إرسال النموذج
function sendMessage(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    alert(`شكراً ${name}!\n\nتم استلام رسالتك بنجاح 📧\n\n(ملاحظة: هذا موقع تجريبي، الرسالة لن يتم إرسالها فعلياً)`);
    
    // إعادة تعيين النموذج
    event.target.reset();
}

// Smooth Scrolling للروابط
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// تأثير عند التمرير
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('header');
    
    if (scrolled > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.5)';
    }
});

// رسالة ترحيب عند أول زيارة
if (!sessionStorage.getItem('visited')) {
    setTimeout(() => {
        console.log('👋 أهلاً بك في زيارتك الأولى!');
        sessionStorage.setItem('visited', 'true');
    }, 1000);
}
```

**احفظه باسم:** `"script.js"`

---

## الخطوة 4️⃣: التأكد من البنية

يجب أن يكون عندك هذا الترتيب:
```
Desktop/
└── my-website/
    ├── index.html
    ├── about.html
    ├── contact.html
    ├── style.css
    ├── script.js
    └── images/