/* =====================================================================
   pixel.js
   ---------------------------------------------------------------------
   Facebook Pixel লোড করে। শুধু পাবলিক পেজগুলোতে (index, checkout,
   thankyou) লোড হয় — admin.html এ পিক্সেল লাগে না, কারণ সেটা কাস্টমার
   ট্র্যাফিক না, তাই ওখানে বসালে বিজ্ঞাপনের ডেটা নষ্ট হয়ে যাবে।

   পেজ-স্পেসিফিক ইভেন্ট (ViewContent, InitiateCheckout, Purchase) সেই
   পেজের নিজের JS ফাইলে (main.js / checkout.js / thankyou.js) ফায়ার
   করা হয়, এই ফাইলে শুধু বেস সেটআপ + PageView।
   ===================================================================== */

(function initFacebookPixel() {
  // fbq stub — asynchronously fbevents.js লোড হওয়ার আগেই কল করলেও
  // queue তে জমা থাকে, স্ক্রিপ্ট লোড হলে সব একসাথে পাঠিয়ে দেয়
  window.fbq = window.fbq || function () {
    (window.fbq.queue = window.fbq.queue || []).push(arguments);
  };
  window._fbq = window.fbq;

  if (!FB_PIXEL_ID || FB_PIXEL_ID === "YOUR_PIXEL_ID") {
    console.warn(
      "⚠️ Facebook Pixel ID সেট করা হয়নি। config.js ফাইলে FB_PIXEL_ID বসান।"
    );
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", FB_PIXEL_ID);
  fbq("track", "PageView");
})();

