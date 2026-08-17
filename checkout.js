/* =====================================================================
   checkout.js — checkout.html
   - landing ডকুমেন্ট থেকে প্রোডাক্টের নাম/দাম/ছবি আনে (single source of truth)
   - checkout ডকুমেন্ট থেকে ডেলিভারি চার্জ ও টেক্সট আনে
   - কোয়ান্টিটি ও এলাকা অনুযায়ী টোটাল হিসাব করে
   - ফর্ম ভ্যালিডেট করে অর্ডার Firestore এ লেখে, তারপর thankyou.html এ পাঠায়
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const product = {
    name: 'প্রিমিয়াম কম্বো সেট',
    price: 1700,
    image: 'https://placehold.co/600x750/6E1F2C/F4E9D3?text=Saree+Combo'
  };
  const delivery = { dhaka: 0, outside: 0 };
  let qty = 1;
  let area = 'dhaka';
  let selectedColor = null;

  // ---- Load and display selected color ----
  var colorDisplay = document.getElementById('selectedColorDisplay');
  const colorLabelsCheckout = {
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
  const colorImageMap = {
    'maroon': 'assets/meroon.jpg',
    'red': 'assets/red.jpg',
    'blue': 'assets/blue.jpg',
    'lavender': 'assets/lavender.jpg',
    'lightpink': 'assets/lightpink.jpg',
    'purple': 'assets/purple.jpg',
    'skyblue': 'assets/sky_blue.jpg',
    'green': 'assets/green.jpg',
    'oceangreen': 'assets/ocean_green.jpg',
    'black': 'assets/black.jpg',
    'onion': 'assets/onion.jpg'
  };
  
  if (colorDisplay) {
    var storedColor = localStorage.getItem('selectedSareeColor');
    if (storedColor) {
      try {
        selectedColor = JSON.parse(storedColor);
        document.querySelector('.color-display__name').textContent = selectedColor.colorLabel || 'নির্বাচিত রঙ';
        var chipImg = colorImageMap[selectedColor.colorCode] || colorImageMap['maroon'];
        document.querySelector('.color-display__chip').style.backgroundImage = 'url(' + chipImg + ')';
        document.querySelector('.color-display__chip').style.backgroundSize = 'cover';
        document.querySelector('.color-display__chip').style.backgroundPosition = 'center';
        // Update summary image on page load
        var summaryImage = document.getElementById('summaryProductImage');
        if (summaryImage) {
          summaryImage.src = chipImg;
          summaryImage.alt = 'শাড়ি — ' + (selectedColor.colorLabel || 'নির্বাচিত রঙ');
        }
      } catch (e) {
        console.error('Color parsing error:', e);
      }
    } else {
      document.querySelector('.color-display__name').textContent = 'লালচে (মেরুন)';
      var defaultImg = colorImageMap['maroon'];
      document.querySelector('.color-display__chip').style.backgroundImage = 'url(' + defaultImg + ')';
      document.querySelector('.color-display__chip').style.backgroundSize = 'cover';
      document.querySelector('.color-display__chip').style.backgroundPosition = 'center';
      // Update summary image on page load
      var summaryImage = document.getElementById('summaryProductImage');
      if (summaryImage) {
        summaryImage.src = defaultImg;
        summaryImage.alt = 'শাড়ি — লালচে (মেরুন)';
      }
    }
  }

  // ---- Checkout color variant selector ----
  const checkoutColorVariants = document.querySelectorAll('.checkout-color-variant');
  if (checkoutColorVariants.length > 0) {
    checkoutColorVariants.forEach(function (button) {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const colorCode = this.dataset.color;
        const colorLabel = colorLabelsCheckout[colorCode] || colorCode;
        const colorImage = colorImageMap[colorCode] || colorImageMap['maroon'];
        
        checkoutColorVariants.forEach(function (btn) {
          btn.classList.remove('active');
        });
        
        this.classList.add('active');
        selectedColor = {
          colorCode: colorCode,
          colorLabel: colorLabel
        };
        
        document.querySelector('.color-display__name').textContent = colorLabel;
        document.querySelector('.color-display__chip').style.backgroundImage = 'url(' + colorImage + ')';
        document.querySelector('.color-display__chip').style.backgroundSize = 'cover';
        document.querySelector('.color-display__chip').style.backgroundPosition = 'center';
        
        // Update summary product image
        var summaryImage = document.getElementById('summaryProductImage');
        if (summaryImage) {
          summaryImage.src = colorImage;
          summaryImage.alt = 'শাড়ি — ' + colorLabel;
        }
        
        localStorage.setItem('selectedSareeColor', JSON.stringify(selectedColor));
      });
    });
    
    // Set initial active button based on stored color
    if (selectedColor && selectedColor.colorCode) {
      const activeBtn = document.querySelector('.checkout-color-variant[data-color="' + selectedColor.colorCode + '"]');
      if (activeBtn) {
        checkoutColorVariants.forEach(function (btn) {
          btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
      }
    }
  }

  Promise.all([
    db.collection('siteContent').doc('landing').get(),
    db.collection('siteContent').doc('checkout').get()
  ]).then(function (results) {
    const landingData = results[0].exists ? results[0].data() : {};
    const checkoutData = results[1].exists ? results[1].data() : {};

    if (landingData.productName) product.name = landingData.productName;
    if (landingData.price) product.price = Number(landingData.price);
    if (landingData.heroImage) product.image = landingData.heroImage;
    if (checkoutData.deliveryChargeDhaka !== undefined) delivery.dhaka = Number(checkoutData.deliveryChargeDhaka);
    if (checkoutData.deliveryChargeOutside !== undefined) delivery.outside = Number(checkoutData.deliveryChargeOutside);

    applyContentFields(checkoutData);
    document.getElementById('areaDhakaCharge').textContent = '৳' + delivery.dhaka.toLocaleString('en-IN') + ' ডেলিভারি চার্জ';
    document.getElementById('areaOutsideCharge').textContent = '৳' + delivery.outside.toLocaleString('en-IN') + ' ডেলিভারি চার্জ';

    document.getElementById('summaryProductName').textContent = product.name;
    document.getElementById('summaryProductImage').src = product.image;
    
    if (selectedColor) {
      document.getElementById('summaryColor').textContent = selectedColor.colorLabel || 'নির্বাচিত রঙ';
    } else {
      document.getElementById('summaryColor').textContent = 'লালচে (মেরুন)';
    }
    
    updateTotals();

    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', {
        content_name: product.name, value: product.price, currency: 'BDT', num_items: qty
      });
    }
  }).catch(function (err) {
    console.error('checkout content load failed:', err);
    updateTotals();
  });

  function applyContentFields(data) {
    document.querySelectorAll('[data-field]').forEach(function (el) {
      const key = el.dataset.field;
      if (data[key] === undefined || data[key] === '') return;
      if (el.dataset.fieldType === 'price') {
        el.textContent = '৳' + Number(data[key]).toLocaleString('en-IN');
      } else {
        el.textContent = data[key];
      }
    });
  }

  function currentDeliveryCharge() { return area === 'dhaka' ? delivery.dhaka : delivery.outside; }

  function updateTotals() {
    const subtotal = product.price * qty;
    const deliveryCharge = currentDeliveryCharge();
    const total = subtotal + deliveryCharge;
    document.getElementById('qtyValue').textContent = qty;
    document.getElementById('summaryUnitPrice').textContent = '৳' + product.price.toLocaleString('en-IN');
    document.getElementById('summarySubtotal').textContent = '৳' + subtotal.toLocaleString('en-IN');
    document.getElementById('summaryDelivery').textContent = '৳' + deliveryCharge.toLocaleString('en-IN');
    document.getElementById('summaryTotal').textContent = '৳' + total.toLocaleString('en-IN');
  }

  // ---- Quantity stepper ----
  document.getElementById('qtyMinus').addEventListener('click', function () {
    if (qty > 1) { qty -= 1; updateTotals(); }
  });
  document.getElementById('qtyPlus').addEventListener('click', function () {
    if (qty < 10) { qty += 1; updateTotals(); }
  });

  // ---- Area (delivery zone) ----
  document.querySelectorAll('input[name="area"]').forEach(function (radio) {
    radio.addEventListener('change', function () { area = this.value; updateTotals(); });
  });

  // ---- Form validation + submit ----
  const form = document.getElementById('checkoutForm');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formMessage.style.display = 'none';
    if (!validateForm()) return;

    const submitBtn = document.getElementById('confirmOrderBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'প্রসেসিং...';

    const firebaseConfigured = firebaseConfig &&
      firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
      firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID' &&
      firebaseConfig.appId && firebaseConfig.appId !== 'YOUR_APP_ID';

    if (!firebaseConfigured || !window.firebase || !db || typeof db.collection !== 'function') {
      console.error('Firebase config missing or Firestore not initialized.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      formMessage.textContent = 'Firebase সেটআপ ঠিক নেই। config.js ফাইলে আপনার প্রকল্পের API key, projectId, appId বসান।';
      formMessage.style.display = 'block';
      return;
    }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const subtotal = product.price * qty;
    const deliveryCharge = currentDeliveryCharge();
    const total = subtotal + deliveryCharge;

    const order = {
      name: name,
      phone: phone,
      address: address,
      area: area,
      product: product.name,
      sareeColor: selectedColor ? selectedColor.colorLabel : 'লালচে (মেরুন)',
      unitPrice: product.price,
      quantity: qty,
      deliveryCharge: deliveryCharge,
      total: total,
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const saveOrder = db.collection('orders').add(order);
    const timeoutPromise = new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error('Firebase write timed out.'));
      }, 20000);
    });

    Promise.race([saveOrder, timeoutPromise])
      .then(function (docRef) {
        sessionStorage.setItem('lastOrder', JSON.stringify({
          id: docRef.id, name: name, phone: phone, address: address, area: area,
          product: product.name, sareeColor: selectedColor ? selectedColor.colorLabel : 'লালচে (মেরুন)', quantity: qty, unitPrice: product.price,
          deliveryCharge: deliveryCharge, total: total
        }));
        window.location.href = 'thankyou.html';
      })
      .catch(function (err) {
        console.error('order create failed:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        formMessage.textContent = err && err.message === 'Firebase write timed out.'
          ? 'সার্ভার বা Firestore রেসপন্স না পাওয়ায় অর্ডার সাবমিট হয়নি। একটু পরে আবার চেষ্টা করুন।'
          : 'অর্ডার সাবমিট করা যায়নি। ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।';
        formMessage.style.display = 'block';
      });
  });

  function validateForm() {
    const name = document.getElementById('custName');
    const phone = document.getElementById('custPhone');
    const address = document.getElementById('custAddress');

    const nameOk = name.value.trim().length >= 2;
    const phoneOk = /^01[3-9]\d{8}$/.test(phone.value.trim());
    const addressOk = address.value.trim().length >= 8;

    toggleError(name, !nameOk);
    toggleError(phone, !phoneOk);
    toggleError(address, !addressOk);

    return nameOk && phoneOk && addressOk;
  }

  function toggleError(input, hasError) {
    const group = input.closest('.form-group');
    if (group) group.classList.toggle('has-error', hasError);
  }
});
