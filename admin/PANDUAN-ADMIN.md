# 📘 Panduan Admin Panel PPUQHM

## 🎯 Apa Yang Sudah Disiapkan

Admin panel sudah siap. Setelah deploy, kamu bisa edit:

| Bagian | Aksi |
|--------|------|
| 📰 **Berita** | Tambah/edit/hapus artikel berita |
| 📸 **Galeri Foto** | Upload foto kegiatan dengan kategori |
| 📞 **Kontak & Sosmed** | Ubah nomor WA, link Facebook/IG/YouTube, alamat |
| 📝 **Info Pendaftaran** | Update gelombang PSB, biaya, persyaratan tiap tahun |
| 🕌 **Info Profil** | Ubah motto, visi, statistik santri |

---

## 🚀 Cara Setup Setelah Deploy

### **Step 1: Buat akun GitHub**
1. Buka https://github.com → Sign up
2. Pakai email kamu
3. Konfirmasi email

### **Step 2: Upload website ke GitHub**
1. Login GitHub → klik **"New Repository"**
2. Nama: `pesantren-website` (atau apa pun)
3. Pilih **Public** atau Private
4. **Upload folder ini** (drag & drop semua file)

### **Step 3: Deploy ke Netlify**
1. Buka https://app.netlify.com → Sign up dengan **akun GitHub** yang baru dibuat
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** → pilih repo `pesantren-website`
4. Klik **Deploy** → tunggu beberapa menit
5. Website kamu hidup di URL seperti: `https://abc-pesantren.netlify.app`

### **Step 4: Aktifkan Admin Panel**
1. Di dashboard Netlify, klik nama site kamu
2. Klik tab **"Site configuration"** → **"Identity"**
3. Klik tombol **"Enable Identity"**
4. Scroll ke bawah → klik **"Enable Git Gateway"**
5. Di bagian **"Registration"**, pilih **"Invite only"** (biar gak sembarang orang daftar)
6. Klik **"Invite users"** → masukin **email kamu sendiri**
7. Cek email → klik link konfirmasi → buat password

### **Step 5: Buka Admin Panel**
1. Buka: `https://nama-website-kamu.netlify.app/admin/`
2. Login dengan email & password tadi
3. Selesai! 🎉 Admin panel kamu siap pakai

---

## 💡 Cara Pakai Admin Panel

### Tambah Berita Baru
1. Login → klik **"📰 Berita Pesantren"**
2. Klik **"New Berita"** (kanan atas)
3. Isi: Judul, Kategori, Tanggal, Foto Utama, Deskripsi, Isi Artikel
4. Klik **"Publish"** → otomatis muncul di website dalam 1-2 menit

### Ubah Kontak / Nomor WA
1. Login → klik **"⚙️ Pengaturan Pesantren"**
2. Pilih **"📞 Kontak & Sosial Media"**
3. Edit field yang mau diubah
4. Klik **"Publish"**

### Upload Foto Galeri
1. Login → klik **"📸 Galeri Foto"**
2. Klik **"New Foto"**
3. Upload foto, pilih kategori, kasih judul
4. **"Publish"**

---

## ❓ Troubleshooting

**Q: Admin gak bisa dibuka, muncul "Config Error"?**
A: Pastikan file `admin/config.yml` ada dan tidak corrupt. Jangan diedit manual.

**Q: Login gagal terus?**
A: Periksa di Netlify → Identity → pastikan email kamu sudah confirm.

**Q: Foto yang diupload kemana?**
A: Otomatis tersimpan di folder `uploads/` di repo GitHub kamu.

**Q: Mau tambah admin lain (tim pengelola)?**
A: Netlify dashboard → Identity → Invite users → masukin email mereka.

---

## ⚠️ Penting

- **JANGAN edit file `admin/config.yml` langsung** kalau gak paham YAML — bisa rusak.
- **JANGAN hapus folder `admin/`** atau `data/` — admin panel bakal mati.
- **Backup berkala:** GitHub sudah otomatis backup tiap kali kamu publish dari admin.

---

🤝 Kalau ada masalah, hubungi developer atau buka issue di GitHub repo kamu.
