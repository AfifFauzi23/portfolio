# Portfolio Template — Afif Fauzi

Template website portfolio pribadi berbasis **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **GSAP + ScrollTrigger**, dan **Lenis**. Seluruh konten dan pengaturan berada di satu berkas (`data/content.ts`) agar aset riil dapat diganti dengan cepat.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di peramban.

## Panduan mengganti teks & pengaturan

Buka [`data/content.ts`](./data/content.ts). Cari komentar `// TODO: ganti dengan aset asli` untuk menemukan semua bagian placeholder:

- `siteConfig.showreelMode`: ubah antara `"carousel"` atau `"video"` untuk mengatur mode awal Showreel (pengunjung tetap dapat mengganti mode melalui tombol di antarmuka).
- `siteConfig.seo`: judul halaman, deskripsi meta, URL produksi, dan gambar Open Graph.
- `profileData`: nama, lokasi, teks pembuka, bio, foto profil, dan daftar keahlian.
- `showreelData`: lokasi video MP4, poster video, dan 8 slide carousel foto.
- `projectsData`: 6 karya dengan `slug`, `title`, `category`, `featured`, `aspect` (`"landscape"` atau `"portrait"`), `description`, `overview`, `role`, `image`, `tools`, `link`, dan `gallery`.
- `timelineData`: urutan pengalaman dan pendidikan (berurutan kronologis).
- `contactData`: email dan tautan sosial media.

## Panduan mengganti aset visual

Letakkan berkas asli Anda di folder berikut lalu perbarui nama berkas di `data/content.ts`:

| Folder | Nama Berkas Disarankan | Rasio & Ukuran Disarankan | Format |
| :--- | :--- | :--- | :--- |
| `public/assets/profile/` | `afif-profile.webp` | 3:4 (`900 × 1200 px`) | WebP / JPG |
| `public/assets/showreel/` | `showreel.mp4` | 16:9 (`1920 × 1080 px`, H.264, < 15 MB) | MP4 |
| `public/assets/showreel/` | `poster.webp` | 16:9 (`1600 × 900 px`) | WebP / JPG |
| `public/assets/showreel/` | `slide-1.webp` .. `slide-8.webp` | 16:10 (`1600 × 1000 px`) | WebP / JPG |
| `public/assets/projects/` | `project-1.webp` .. `project-6.webp` | Lanskap 16:10 (`1600 × 1000 px`) atau Potret 4:5 (`1200 × 1400 px`) | WebP / JPG |
| `public/assets/gallery/` | `gallery-1.webp` .. `gallery-4.webp` | 16:10 (`1600 × 1000 px`) | WebP / JPG |

## Deploy ke Vercel

1. Inisialisasi Git dan unggah proyek ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi portfolio Afif Fauzi"
   ```
2. Masuk ke [vercel.com](https://vercel.com), pilih **Add New Project**, lalu impor repositori Anda.
3. Biarkan pengaturan build bawaan Next.js (`npm run build`), lalu klik **Deploy**.
4. Setelah URL aktif, perbarui `siteConfig.seo.url` di `data/content.ts` dengan domain produksi Anda.
