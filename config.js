/* =====================================================================
   config.js
   ---------------------------------------------------------------------
   এই ফাইলে আপনার নিজের Firebase প্রজেক্ট আর Facebook Pixel এর তথ্য
   বসাতে হবে। এই একটা ফাইল ঠিক করলেই পুরো সাইট আপনার নিজের একাউন্টের
   সাথে কানেক্ট হয়ে যাবে। বিস্তারিত ধাপ README.md ফাইলে দেওয়া আছে।
   ===================================================================== */

// ---- ধাপ ১: Firebase Console (console.firebase.google.com) থেকে
//      Project settings > General > Your apps থেকে এই অবজেক্টটা কপি করুন ----
const firebaseConfig = {
  apiKey: "AIzaSyBUanIOP4g6OaJNTEceerm7kgk3oYxvXTs",
  authDomain: "device-streaming-5c9e8564.firebaseapp.com",
  databaseURL: "https://device-streaming-5c9e8564-default-rtdb.firebaseio.com",
  projectId: "device-streaming-5c9e8564",
  storageBucket: "device-streaming-5c9e8564.firebasestorage.app",
  messagingSenderId: "482804847649",
  appId: "1:482804847649:web:55e9dd02aac4aea37cbf60"
};

// ---- ধাপ ২: Facebook Events Manager থেকে আপনার Pixel ID বসান ----
// Meta Events Manager > Data Sources > আপনার Pixel > Settings এ পাবেন।
const FB_PIXEL_ID = "1175442975154011";

/* =====================================================================
   এই লাইনের নিচে কিছু এডিট করার দরকার নেই।
   ===================================================================== */

// সব পাবলিক পেজেই (index/checkout/thankyou) Firestore লাগে, তাই এখানেই
// app + firestore ইনিশিয়ালাইজ করা হচ্ছে। Auth শুধু admin.html এ লাগে,
// তাই সেটা admin.js এ আলাদাভাবে চালু করা হয়েছে।
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// কনফিগ ভুল করে বসাতে ভুলে গেলে কনসোলে সুন্দর করে জানিয়ে দেয়
if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.warn(
    "⚠️ config.js এ এখনো আপনার আসল Firebase তথ্য বসানো হয়নি। " +
    "README.md ফাইল দেখে ধাপ অনুযায়ী config.js আপডেট করুন।"
  );
}
