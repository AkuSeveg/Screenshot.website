# 📸 WebScreenshot Pro - Frosted Glass Edition
**Version:** 3.0.0 Pro Edition  
**Powered by:** Yoanz

WebScreenshot Pro adalah source code premium (Plug & Play) untuk membuat layanan web tool penangkap layar (screenshot) berkualitas HD dengan fitur canggih seperti ekstraksi teks (OCR) dan auto-upload cloud. Dilengkapi dengan UI modern bergaya Frosted Glass (Glassmorphism).

---

## ✨ Fitur Unggulan
- **💎 Frosted Glass UI:** Desain antarmuka premium, mulus, responsif, dengan efek blur modern dan animasi load.
- **🚀 100% Plug & Play:** Tidak perlu pusing registrasi API Keys! Sistem sudah menggunakan public API yang siap pakai.
- **🖼️ HD & Full Page Capture:** Mendukung resolusi hingga 4K (Device Scale 3x) dan tangkapan satu halaman penuh (Full Page).
- **☁️ Auto-Upload Cloud:** Setiap screenshot langsung mendapatkan *Shareable Cloud Link* tanpa membebani storage server lokal Anda.
- **📝 OCR Text Extractor:** Secara otomatis memindai dan mengekstrak teks yang ada di dalam gambar screenshot.
- **⚡ Serverless Ready:** Backend dioptimalkan khusus untuk Vercel Serverless Function (sangat ringan, tanpa Puppeteer lokal).

---

## 📂 Struktur Folder
```text
web-screenshot-pro/
├── api/
│   └── screenshot.js    (Backend Serverless Function)
├── public/
│   ├── index.html       (Frontend UI)
│   ├── script.js        (Frontend Logic)
│   └── style.css        (Glassmorphism Styling)
├── package.json         (Dependencies)
└── README.md            (Dokumentasi)