/* =====================================================================
   admin.js — admin.html
   - Firebase Auth দিয়ে লগইন/লগআউট
   - orders কালেকশনের রিয়েল-টাইম লিস্ট + স্ট্যাটাস আপডেট + সার্চ/ফিল্টার
   - landing/checkout/thankyou — তিনটা পেজের কনটেন্ট এডিট করার ফর্ম
     (CONTENT_SCHEMA থেকে অটোমেটিক জেনারেট হয়, তাই নতুন ফিল্ড যোগ করতে
     চাইলে শুধু এই স্কিমাতে একটা লাইন যোগ করলেই হবে)
   ===================================================================== */

const auth = firebase.auth();

const CONTENT_SCHEMA = {
  landing: [
    { key: 'announcementBar', label: 'ঘোষণা বার (উপরে)', type: 'text' },
    { key: 'heroEyebrow', label: 'হিরো ছোট লেবেল', type: 'text' },
    { key: 'heroTitle', label: 'হিরো টাইটেল', type: 'text' },
    { key: 'heroSubtitle', label: 'হিরো সাবটাইটেল', type: 'textarea' },
    { key: 'heroImage', label: 'হিরো ছবির URL', type: 'text' },
    { key: 'productName', label: 'প্রোডাক্টের নাম', type: 'text' },
    { key: 'price', label: 'বর্তমান মূল্য (৳)', type: 'number' },
    { key: 'oldPrice', label: 'আগের মূল্য (৳)', type: 'number' },
    { key: 'ctaText', label: 'অর্ডার বাটনের লেখা', type: 'text' },
    { key: 'phoneNumber', label: 'যোগাযোগ নম্বর', type: 'text' },
    { key: 'feature1Title', label: 'ফিচার ১ — টাইটেল', type: 'text' },
    { key: 'feature1Text', label: 'ফিচার ১ — বিবরণ', type: 'text' },
    { key: 'feature2Title', label: 'ফিচার ২ — টাইটেল', type: 'text' },
    { key: 'feature2Text', label: 'ফিচার ২ — বিবরণ', type: 'text' },
    { key: 'feature3Title', label: 'ফিচার ৩ — টাইটেল', type: 'text' },
    { key: 'feature3Text', label: 'ফিচার ৩ — বিবরণ', type: 'text' },
    { key: 'feature4Title', label: 'ফিচার ৪ — টাইটেল', type: 'text' },
    { key: 'feature4Text', label: 'ফিচার ৪ — বিবরণ', type: 'text' },
    { key: 'productDescriptionTitle', label: 'বিবরণ সেকশনের টাইটেল', type: 'text' },
    { key: 'productDescription', label: 'প্রোডাক্ট বিবরণ (প্রতি লাইন = নতুন প্যারাগ্রাফ)', type: 'textarea' },
    { key: 'galleryImage1', label: 'গ্যালারি ছবি ১ URL', type: 'text' },
    { key: 'galleryImage2', label: 'গ্যালারি ছবি ২ URL', type: 'text' },
    { key: 'galleryImage3', label: 'গ্যালারি ছবি ৩ URL', type: 'text' },
    { key: 'testimonial1Name', label: 'রিভিউ ১ — নাম', type: 'text' },
    { key: 'testimonial1Text', label: 'রিভিউ ১ — মন্তব্য', type: 'textarea' },
    { key: 'testimonial2Name', label: 'রিভিউ ২ — নাম', type: 'text' },
    { key: 'testimonial2Text', label: 'রিভিউ ২ — মন্তব্য', type: 'textarea' },
    { key: 'testimonial3Name', label: 'রিভিউ ৩ — নাম', type: 'text' },
    { key: 'testimonial3Text', label: 'রিভিউ ৩ — মন্তব্য', type: 'textarea' },
    { key: 'faq1Q', label: 'FAQ ১ — প্রশ্ন', type: 'text' },
    { key: 'faq1A', label: 'FAQ ১ — উত্তর', type: 'textarea' },
    { key: 'faq2Q', label: 'FAQ ২ — প্রশ্ন', type: 'text' },
    { key: 'faq2A', label: 'FAQ ২ — উত্তর', type: 'textarea' },
    { key: 'faq3Q', label: 'FAQ ৩ — প্রশ্ন', type: 'text' },
    { key: 'faq3A', label: 'FAQ ৩ — উত্তর', type: 'textarea' },
    { key: 'faq4Q', label: 'FAQ ৪ — প্রশ্ন', type: 'text' },
    { key: 'faq4A', label: 'FAQ ৪ — উত্তর', type: 'textarea' },
    { key: 'footerText', label: 'ফুটার লেখা', type: 'text' }
  ],
  checkout: [
    { key: 'checkoutHeading', label: 'চেকআউট হেডিং', type: 'text' },
    { key: 'codNote', label: 'COD নোট', type: 'textarea' },
    { key: 'deliveryChargeDhaka', label: 'ঢাকার ভিতরে ডেলিভারি চার্জ (৳)', type: 'number' },
    { key: 'deliveryChargeOutside', label: 'ঢাকার বাইরে ডেলিভারি চার্জ (৳)', type: 'number' },
    { key: 'confirmButtonText', label: 'কনফার্ম বাটনের লেখা', type: 'text' }
  ],
  thankyou: [
    { key: 'thankyouTitle', label: 'থ্যাংক ইউ টাইটেল', type: 'text' },
    { key: 'thankyouMessage', label: 'থ্যাংক ইউ মেসেজ', type: 'textarea' },
    { key: 'confirmationNote', label: 'কনফার্মেশন নোট', type: 'textarea' }
  ]
};

const STATUS_LABELS = { pending: 'অপেক্ষমান', confirmed: 'কনফার্মড', shipped: 'শিপড', delivered: 'ডেলিভার্ড', cancelled: 'বাতিল' };

document.addEventListener('DOMContentLoaded', function () {
  const loginSection = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardSection');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminEmailLabel = document.getElementById('adminEmailLabel');

  let ordersInitialized = false;
  let contentInitialized = false;

  auth.onAuthStateChanged(function (user) {
    if (user) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      adminEmailLabel.textContent = user.email;
      if (!ordersInitialized) { initOrders(); ordersInitialized = true; }
      if (!contentInitialized) { initContentEditor(); contentInitialized = true; }
    } else {
      loginSection.style.display = 'flex';
      dashboardSection.style.display = 'none';
    }
  });

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    loginError.classList.remove('is-visible');
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    auth.signInWithEmailAndPassword(email, password)
      .catch(function () {
        loginError.textContent = 'লগইন ব্যর্থ হয়েছে। ইমেইল/পাসওয়ার্ড আবার চেক করুন।';
        loginError.classList.add('is-visible');
      })
      .finally(function () { btn.disabled = false; });
  });

  logoutBtn.addEventListener('click', function () { auth.signOut(); });

  // ---- Tabs ----
  document.querySelectorAll('.admin-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('is-active'); });
      document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('is-active'); });
      tab.classList.add('is-active');
      document.getElementById(tab.dataset.panel).classList.add('is-active');
    });
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ================= ORDERS ================= */
  let allOrders = [];

  function initOrders() {
    db.collection('orders').orderBy('createdAt', 'desc').onSnapshot(function (snapshot) {
      allOrders = snapshot.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
      renderOrders();
    }, function (err) { console.error('orders listener error:', err); });

    document.getElementById('statusFilter').addEventListener('change', renderOrders);
    document.getElementById('searchOrders').addEventListener('input', renderOrders);
  }

  function renderOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchOrders').value.trim().toLowerCase();

    const filtered = allOrders.filter(function (o) {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search) {
        const inName = String(o.name || '').toLowerCase().includes(search);
        const inPhone = String(o.phone || '').includes(search);
        if (!inName && !inPhone) return false;
      }
      return true;
    });

    document.getElementById('statTotalOrders').textContent = allOrders.length;
    document.getElementById('statPending').textContent = allOrders.filter(function (o) { return o.status === 'pending'; }).length;
    const revenue = allOrders.filter(function (o) { return o.status !== 'cancelled'; })
      .reduce(function (sum, o) { return sum + (Number(o.total) || 0); }, 0);
    document.getElementById('statRevenue').textContent = '৳' + revenue.toLocaleString('en-IN');

    const tbody = document.getElementById('ordersTableBody');
    const emptyState = document.getElementById('ordersEmptyState');

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    tbody.innerHTML = filtered.map(function (o) {
      const date = (o.createdAt && o.createdAt.toDate) ? o.createdAt.toDate() : null;
      const dateStr = date ? date.toLocaleString('bn-BD', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'এইমাত্র';
      const status = o.status || 'pending';
      const options = Object.keys(STATUS_LABELS).map(function (s) {
        return '<option value="' + s + '"' + (status === s ? ' selected' : '') + '>' + STATUS_LABELS[s] + '</option>';
      }).join('');

      return '<tr>' +
        '<td class="cell-muted">' + dateStr + '</td>' +
        '<td><div class="cell-name">' + escapeHtml(o.name || '') + '</div>' +
            '<div class="cell-muted"><a href="tel:' + escapeHtml(o.phone || '') + '">' + escapeHtml(o.phone || '') + '</a></div></td>' +
        '<td class="cell-muted">' + escapeHtml(o.address || '') + '<br>(' + (o.area === 'dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে') + ')</td>' +
        '<td>' + escapeHtml(o.product || '') + ' × ' + (o.quantity || 1) + '</td>' +
        '<td>' + escapeHtml(o.sareeColor || 'নির্বাচিত নয়') + '</td>' +
        '<td><strong>৳' + Number(o.total || 0).toLocaleString('en-IN') + '</strong></td>' +
        '<td><select class="status-select status-' + status + '" data-order-id="' + o.id + '">' + options + '</select></td>' +
      '</tr>';
    }).join('');

    tbody.querySelectorAll('.status-select').forEach(function (select) {
      select.addEventListener('change', function () {
        const orderId = select.dataset.orderId;
        const newStatus = select.value;
        select.className = 'status-select status-' + newStatus;
        db.collection('orders').doc(orderId).update({ status: newStatus })
          .catch(function (err) {
            console.error('status update failed:', err);
            alert('স্ট্যাটাস আপডেট করা যায়নি, আবার চেষ্টা করুন।');
          });
      });
    });
  }

  /* ================= CONTENT EDITOR ================= */
  let currentContentPage = 'landing';

  function initContentEditor() {
    document.querySelectorAll('.content-page-picker button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.content-page-picker button').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        currentContentPage = btn.dataset.page;
        loadContentForm(currentContentPage);
      });
    });
    document.getElementById('saveContentBtn').addEventListener('click', saveContentForm);
    loadContentForm(currentContentPage);
  }

  function loadContentForm(pageKey) {
    const container = document.getElementById('contentFieldsGrid');
    container.innerHTML = '<p class="cell-muted">লোড হচ্ছে...</p>';
    document.getElementById('saveStatus').textContent = '';
    document.getElementById('saveStatus').className = 'save-status';

    db.collection('siteContent').doc(pageKey).get().then(function (doc) {
      const data = doc.exists ? doc.data() : {};
      const schema = CONTENT_SCHEMA[pageKey];
      container.innerHTML = schema.map(function (field) {
        const value = data[field.key] !== undefined ? data[field.key] : '';
        const id = 'field_' + field.key;
        if (field.type === 'textarea') {
          return '<div class="form-group"><label class="form-label" for="' + id + '">' + field.label + '</label>' +
            '<textarea class="form-textarea" id="' + id + '" data-key="' + field.key + '">' + escapeHtml(value) + '</textarea></div>';
        }
        const inputType = field.type === 'number' ? 'number' : 'text';
        return '<div class="form-group"><label class="form-label" for="' + id + '">' + field.label + '</label>' +
          '<input class="form-input" type="' + inputType + '" id="' + id + '" data-key="' + field.key + '" value="' + escapeHtml(value) + '"></div>';
      }).join('');
    }).catch(function (err) {
      container.innerHTML = '<p class="cell-muted">লোড ব্যর্থ হয়েছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।</p>';
      console.error('content load failed:', err);
    });
  }

  function saveContentForm() {
    const schema = CONTENT_SCHEMA[currentContentPage];
    const payload = {};
    schema.forEach(function (field) {
      const el = document.getElementById('field_' + field.key);
      if (!el) return;
      payload[field.key] = field.type === 'number' ? Number(el.value) : el.value;
    });

    const statusEl = document.getElementById('saveStatus');
    statusEl.textContent = 'সেভ হচ্ছে...';
    statusEl.className = 'save-status';

    db.collection('siteContent').doc(currentContentPage).set(payload, { merge: true })
      .then(function () {
        statusEl.textContent = '✓ সেভ হয়ে গেছে — সাইটে গিয়ে রিফ্রেশ দিলেই পরিবর্তন দেখা যাবে';
        statusEl.className = 'save-status is-success';
      })
      .catch(function (err) {
        statusEl.textContent = 'সেভ ব্যর্থ হয়েছে, আবার চেষ্টা করুন।';
        statusEl.className = 'save-status is-error';
        console.error('content save failed:', err);
      });
  }
});
