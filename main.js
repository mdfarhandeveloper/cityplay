/* =====================================================================
   main.js — landing page (index.html)
   - siteContent/landing ডকুমেন্ট থেকে [data-field] এলিমেন্টগুলো ভরে দেয়
   - Facebook Pixel এ ViewContent ইভেন্ট পাঠায়
   - স্ক্রল করলে মোবাইলে নিচের sticky "অর্ডার করুন" বার দেখায়
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  db.collection('siteContent').doc('landing').get()
    .then(function (doc) {
      const data = doc.exists ? doc.data() : {};
      applyContentFields(data);
      fireViewContent(data);
    })
    .catch(function (err) {
      // Firestore থেকে ডেটা না এলেও HTML এ আগে থেকেই বসানো placeholder
      // কনটেন্ট দেখা যাবে, তাই পেজ ভাঙবে না।
      console.error('landing content load failed:', err);
    });

  function applyContentFields(data) {
    document.querySelectorAll('[data-field]').forEach(function (el) {
      const key = el.dataset.field;
      if (data[key] === undefined || data[key] === '') return;
      const type = el.dataset.fieldType || 'text';

      if (type === 'image') {
        el.src = data[key];
      } else if (type === 'price') {
        el.textContent = '৳' + Number(data[key]).toLocaleString('en-IN');
      } else if (type === 'paragraphs') {
        el.innerHTML = String(data[key])
          .split('\n')
          .filter(function (line) { return line.trim() !== ''; })
          .map(function (line) { return '<p>' + escapeHtml(line) + '</p>'; })
          .join('');
      } else {
        el.textContent = data[key];
      }
    });
  }

  function fireViewContent(data) {
    if (typeof fbq !== 'function') return;
    fbq('track', 'ViewContent', {
      content_name: data.productName || 'সুরভি প্রিমিয়াম উদ আতর',
      content_type: 'product',
      value: Number(data.price) || 990,
      currency: 'BDT'
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- Sticky mobile CTA bar: hero পার হলে দেখায় ----
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    document.body.classList.add('has-sticky-cta');
    window.addEventListener('scroll', function () {
      const heroBottom = hero.getBoundingClientRect().bottom;
      stickyCta.classList.toggle('is-visible', heroBottom < 0);
    }, { passive: true });
  }

  // ---- Color variant selector ----
  const colorVariantButtons = document.querySelectorAll('.color-variant');
  const heroMainImage = document.getElementById('heroMainImage');
  const checkoutLink = document.getElementById('checkoutLink');
  const colorLabels = {
    'maroon': 'লালচে (মেরুন)',
    'red': 'লাল',
    'blue': 'নীল',
    'lavender': 'ল্যাভেন্ডার',
    'lightpink': 'হালকা গোলাপি',
    'purple': 'বেগুনি',
    'skyblue': 'আকাশি',
    'green': 'সবুজ',
    'oceangreen': 'সমুদ্র সবুজ',
    'black': 'কালো',
    'onion': 'পেঁয়াজ রঙ'
  };
  
  if (colorVariantButtons.length > 0 && heroMainImage) {
    colorVariantButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const imageUrl = this.dataset.image;
        const colorName = this.dataset.color;
        
        colorVariantButtons.forEach(function (btn) {
          btn.classList.remove('active');
        });
        
        this.classList.add('active');
        heroMainImage.src = imageUrl;
        heroMainImage.alt = 'শাড়ি কম্বো সেট - ' + colorName + ' রঙ';
        
        localStorage.setItem('selectedSareeColor', JSON.stringify({
          colorCode: colorName,
          colorLabel: colorLabels[colorName] || colorName
        }));
      });
    });
    
    if (checkoutLink) {
      checkoutLink.addEventListener('click', function () {
        var activeButton = document.querySelector('.color-variant.active');
        if (activeButton) {
          var colorName = activeButton.dataset.color;
          localStorage.setItem('selectedSareeColor', JSON.stringify({
            colorCode: colorName,
            colorLabel: colorLabels[colorName] || colorName
          }));
        }
      });
    }
  }
});



!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('DA6R663C77U2R5U1L1RG');
  ttq.page();
}(window, document, 'ttq');
