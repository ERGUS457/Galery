# Panduan Ethereal Gallery & Integrasi Google Drive 📸✨

Ethereal Gallery adalah website galeri modern bernuansa *glassmorphism* yang memungkinkan Anda mengunggah gambar langsung ke folder Google Drive milik Anda, dan menampilkannya di website tanpa login sama sekali.

Website ini bisa dihosting di mana saja dan diakses dari perangkat apapun!

## Langkah 1: Setup Google Drive & Google Apps Script
Agar website dapat menyimpan ke Google Drive sesuai folder Anda (`17MctjZzUff2BttRSrZCiMEWdxdQSXH7-`), ikuti langkah ini:

1. Buka [Google Apps Script](https://script.google.com/) menggunakan akun Google Anda.
2. Klik tombol **New Project** (Proyek Baru).
3. Hapus semua kode bawaan `function myFunction() {}`.
4. Buka file `apps-script.js` pada folder proyek ini, lalu **salin seluruh isinya (copy)**, dan **tempelkan (paste)** ke editor Google Apps Script.
5. Simpan proyek tersebut dengan nama misalnya "Ethereal Gallery API".
6. Di bagian atas kanan, klik tombol **Deploy** -> **New deployment**.
7. Klik icon gerigi (`Select type`) dan pilih **Web app**.
8. Isi dengan konfigurasi berikut:
   - **Description**: `Gallery Upload API`
   - **Execute as**: Pilih `Me` (Akun Anda) -> *Penting agar file tersimpan ke Drive Anda*
   - **Who has access**: Pilih `Anyone` (Siapapun) -> *Penting agar upload tak perlu login!*
9. Klik **Deploy**. (Google akan meminta izin akses "Authorize access", silakan setujui dengan memilih akun Anda, pilih Advanced, dan "Go to Ethereal Gallery API (unsafe)").
10. Setelah langkah selesai, Anda akan mendapatkan sebuah **Web app URL** yang panjang (berawal dari `https://script.google.com/macros/s/...`). 
11. **SALIN (COPY) URL TERSEBUT**.

## Langkah 2: Hubungkan Script ke Website
1. Buka kode sumber website ini.
2. Cari file `script.js`.
3. Di baris kedua (`baris 3`), temukan kode:
   ```javascript
   const SCRIPT_URL = '';
   ```
4. Tempelkan (Paste) Web app URL dari Google Script yang sudah Anda copy di langkah 1 ke dalam tanda kutip tersebut. 
   Contoh: 
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw.../exec';
   ```
5. **Simpan file script.js**.

## Langkah 3: Online-kan Website Anda
Agar website bisa diakses *kapanpun dan di manapun*, Anda harus menghosting folder ini (gratis dan mudah):
  
**Opsi Terbaik: Vercel / Netlify / GitHub Pages**
1. Karena web ini murni HTML, CSS, dan Javascript, cara paling mudah adalah upload menggunakan [Vercel](https://vercel.com) atau [Netlify Drop](https://app.netlify.com/drop).
2. Jika memakai **Netlify Drop**: cukup buat/login akun Netlify, arahkan ke halaman Drop, dan *drag & drop* (seret) folder `gallery-app` ini ke sana.
3. Tunggu beberapa detik, Netlify akan memberi Anda link live website.
4. Bagikan link tersebut dan Anda sudah bisa mulai mengunggah/menampilkan galeri kenangan Anda!

---
*Tema yang dibangun mendukung perubahan warna yang dinamis dan dirancang sangat cantik layaknya Premium App.*
