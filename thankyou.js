/* =====================================================================
   thankyou.js — thankyou.html
   - siteContent/thankyou থেকে এডিটেবল টেক্সট আনে
   - checkout.js এ sessionStorage এ রাখা 'lastOrder' পড়ে অর্ডারের বিবরণ দেখায়
   - Facebook Pixel এ Purchase ইভেন্ট পাঠায় (রিফ্রেশ করলে দ্বিতীয়বার পাঠায় না)
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  db.collection('siteContent').doc('thankyou').get()
    .then(function (doc) { applyContentFields(doc.exists ? doc.data() : {}); })
    .catch(function (err) { console.error('thankyou content load failed:', err); });

  function applyContentFields(data) {
    document.querySelectorAll('[data-field]').forEach(function (el) {
      const key = el.dataset.field;
      if (data[key] !== undefined && data[key] !== '') el.textContent = data[key];
    });
  }

  const detailsBox = document.getElementById('orderDetails');
  const noOrderBox = document.getElementById('noOrderMessage');
  const raw = sessionStorage.getItem('lastOrder');
  let order = null;
  try { order = raw ? JSON.parse(raw) : null; } catch (e) { order = null; }

  if (!order) {
    if (detailsBox) detailsBox.style.display = 'none';
    if (noOrderBox) noOrderBox.style.display = 'block';
    return;
  }

  document.getElementById('orderId').textContent = '#' + String(order.id).slice(-8).toUpperCase();
  document.getElementById('orderProduct').textContent = order.product + ' × ' + order.quantity;
  document.getElementById('orderArea').textContent = order.area === 'dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে';
  document.getElementById('orderTotal').textContent = '৳' + Number(order.total).toLocaleString('en-IN');

  const pixelFlagKey = 'pixelFired_' + order.id;
  if (!sessionStorage.getItem(pixelFlagKey) && typeof fbq === 'function') {
    fbq('track', 'Purchase', {
      value: Number(order.total),
      currency: 'BDT',
      content_name: order.product,
      num_items: order.quantity
    });
    sessionStorage.setItem(pixelFlagKey, '1');
  }
});
