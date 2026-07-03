# PT. Firza Jaya Teknik — Website Perusahaan

🏗️ **Website dashboard resmi PT. Firza Jaya Teknik** – Perusahaan Konstruksi & Jasa Penyewaan Alat Berat

---

## ✨ Fitur Website

| Fitur | Keterangan |
|---|---|
| 🔒 Sticky Header | Navbar tetap tampil di atas saat scroll |
| 🏠 Hero Section | Gambar konstruksi dengan animasi teks & statistik counter |
| 🏢 Tentang Kami | Portofolio perusahaan & pencapaian |
| 🔧 Layanan | 6 layanan konstruksi lengkap |
| 🚜 Sewa Alat Berat | 6 kategori alat berat dengan harga & tombol WhatsApp |
| 🗂️ Portofolio | Galeri proyek dengan filter kategori |
| 💬 Testimoni | Slider otomatis testimoni klien |
| 📞 Kontak | Form kontak dengan validasi + integrasi WhatsApp |
| 📱 Footer Sosmed | WhatsApp, Instagram, Facebook, YouTube, LinkedIn |
| 💬 FAB WhatsApp | Tombol chat mengambang dari semua halaman |
| 📸 FAB Instagram | Tombol Instagram mengambang |

---

## 📁 Struktur File

```
📂 project-root/
├── 📄 index.html        — Halaman utama (HTML5 semantik)
├── 🎨 style.css         — Stylesheet lengkap (Dark theme, responsive)
├── ⚡ script.js         — JavaScript interaktivitas
├── 📂 images/
│   ├── hero_construction.png    — Gambar hero section
│   ├── heavy_equipment.png      — Gambar armada alat berat
│   ├── portfolio_project1.png   — Foto proyek 1 (Gedung)
│   ├── portfolio_project2.png   — Foto proyek 2 (Jembatan)
│   └── portfolio_project3.png   — Foto proyek 3 (Industri)
└── 📄 README.md         — Dokumentasi ini
```

---

## 🛠️ Teknologi

- **HTML5** — Semantik, SEO-friendly
- **CSS3 Vanilla** — Custom Properties, Grid, Flexbox, Animasi, Responsive
- **JavaScript ES6+** — IntersectionObserver, Form Validation, Slider, Counter
- **Font Awesome 6** — Ikon sosmed & UI
- **Google Fonts** — Outfit (heading) + Inter (body)

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| Desktop (>1100px) | Full 3-kolom grid |
| Tablet (641–1100px) | 2-kolom grid |
| Mobile (<640px) | 1-kolom + hamburger menu |

---

## ⚙️ Konfigurasi (Ubah di sini)

### 1. Nomor WhatsApp
Cari dan ganti semua **`6281234567890`** dengan nomor WhatsApp Anda di `index.html`.

### 2. Link Instagram
Ganti **`firzajayateknik`** pada semua URL Instagram di `index.html`:
```
https://www.instagram.com/firzajayateknik
```

### 3. Informasi Perusahaan
Di `index.html`, update:
- Alamat kantor
- Nomor telepon
- Email perusahaan
- Jam operasional

### 4. Warna Brand
Di `style.css`, ubah variabel CSS:
```css
:root {
  --primary: #f97316;    /* Warna utama (orange) */
  --accent:  #fbbf24;    /* Warna aksen (kuning emas) */
}
```

---

## 🚀 Deploy ke GitHub Pages

1. **Upload semua file** ke repository GitHub Anda
2. Buka **Settings → Pages**
3. Source: **Deploy from branch → main → / (root)**
4. Klik **Save**
5. Website akan live di: `https://username.github.io/nama-repo`

---

## 🔗 Integrasi Sosial Media

Website ini terintegrasi langsung dengan:

| Platform | Fungsi |
|---|---|
| **WhatsApp** | FAB button, tombol rental, form kontak, footer CTA |
| **Instagram** | FAB button, footer link sosmed |
| **Facebook** | Footer social icon |
| **YouTube** | Footer social icon |
| **LinkedIn** | Footer social icon |

---

## 📞 Kontak

**PT. Firza Jaya Teknik**  
📍 Jl. Raya Konstruksi No. 88, Jakarta Selatan 12560  
📞 +62 21-7654-3210  
📩 info@firzajayateknik.co.id  
💬 WhatsApp: +62 812-3456-7890  

---

## 🔧 Integrasi Claude Code / Bluepack

Project ini sudah dikonfigurasi untuk digunakan dengan ekstensi `Claude Code` di VS Code:

- `.vscode/settings.json` menambahkan environment variables:
  - `BLUEPACK_API_KEY`
  - `API_PROVIDER=bluepack`
  - `CLAUDE_MODEL=claude-3-5-sonnet-latest`
- `.vscode/extensions.json` merekomendasikan ekstensi `Anthropic.claude-code`
- `.vscode/tasks.json` menyediakan task `Run Claude proxy server`

### Cara pakai

1. Buka project ini di VS Code.
2. Install ekstensi `Claude Code` jika diminta.
3. Reload VS Code jika perlu (`Developer: Reload Window`).
4. Jalankan `Terminal` → `Run Task...` → `Run Claude proxy server`.
5. Buka panel Claude Code dan mulai sesi baru.

### Tes Bluepack API

Jika ingin menguji koneksi Bluepack secara langsung, jalankan:

```powershell
npm run test:bluepack
```

Jika berhasil, skrip akan mencoba panggilan API ke Bluepack dan menampilkan status respon.

---

*© 2024 PT. Firza Jaya Teknik. Hak Cipta Dilindungi.*
