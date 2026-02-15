let cartItems = 0;

function updateCartCount() {
  document.querySelectorAll('#cartCount').forEach((node) => {
    node.textContent = cartItems;
  });
}

function addToCart() {
  cartItems += 1;
  updateCartCount();
  alert('تمت إضافة الحقيبة إلى السلة بنجاح 🛍️');
}

function subscribe(event) {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  alert(`شكراً لاشتراكك: ${email}\nتم تفعيل خصم 10٪ على طلبك القادم.`);
  event.target.reset();
}

function sendMessage(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  alert(`شكراً ${name}، وصلتنا رسالتك وسنتواصل معك قريباً.`);
  event.target.reset();
}

window.addEventListener('DOMContentLoaded', updateCartCount);
