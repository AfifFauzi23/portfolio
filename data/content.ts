export type ProjectCategory = "UI/UX" | "Grafis" | "Motion" | "Web";
export type ShowreelMode = "video" | "carousel";

export interface ProjectItem {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: string;
  featured: boolean;
  /** Menentukan rasio aspek di grid asimetris */
  aspect: "landscape" | "portrait";
  description: string;
  overview: string;
  role: string;
  image: string;
  tools: string[];
  link: string;
  gallery: {
    src: string;
    alt: string;
    caption: string;
  }[];
}

export interface ShowreelSlide {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  image: string;
  tools: string[];
  link: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  organization: string;
  type: "Pengalaman" | "Pendidikan";
  description: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
}

export const siteConfig = {
  /** Ganti ke "video" atau "carousel" sebagai tampilan awal Showreel */
  showreelMode: "carousel" as ShowreelMode,
  seo: {
    // TODO: ganti dengan aset asli (domain & metadata produksi)
    title: "Afif Fauzi — Desainer UI/UX, Grafis & Motion",
    description:
      "Portfolio Afif Fauzi, mahasiswa Sistem Informasi yang merancang antarmuka digital, sistem identitas visual, dan motion graphic.",
    url: "https://afiffauzi.vercel.app",
    ogImage: "/assets/showreel/poster.svg",
  },
};

export const profileData = {
  name: "Afif Fauzi",
  firstName: "Afif",
  lastName: "Fauzi",
  // TODO: ganti dengan aset asli (/public/assets/profile/afif-profile.jpg atau .webp)
  avatar: "/assets/profile/afif-profile.svg",
  avatarAlt: "Potret Afif Fauzi di studio",
  location: "Jakarta, Indonesia",
  heroIntro:
    "Mahasiswa Sistem Informasi yang merancang antarmuka produk, identitas grafis, dan motion graphic dengan struktur yang jelas.",
  heroPrimaryCta: "Putar showreel",
  heroSecondaryCta: "Lihat karya pilihan",
  aboutHeadline: "Menjembatani struktur sistem informasi dan ekspresi visual.",
  aboutParagraphs: [
    // TODO: ganti dengan aset asli (bio pribadi)
    "Saya menempuh studi Sistem Informasi sambil mendalami perancangan antarmuka, desain grafis, dan animasi gerak. Latar belakang teknis membantu saya menyusun alur produk yang rapi sebelum masuk ke detail visual.",
    "Dalam setiap proyek, saya berfokus pada kejelasan hierarki, ritme tipografi, dan interaksi yang memberi umpan balik nyata bagi pengguna—bukan sekadar hiasan di layar.",
  ],
  skills: [
    {
      name: "UI/UX & Produk",
      items: [
        "Arsitektur informasi",
        "Wireframing & prototipe",
        "Design system",
        "Pengujian kegunaan",
      ],
    },
    {
      name: "Desain Grafis",
      items: [
        "Identitas visual",
        "Tipografi editorial",
        "Poster & publikasi",
        "Sistem grid",
      ],
    },
    {
      name: "Motion Graphic",
      items: [
        "Tipografi kinetik",
        "Animasi antarmuka",
        "Judul & bumper video",
        "Storyboarding",
      ],
    },
    {
      name: "Perangkat & Web",
      items: [
        "Figma & Framer",
        "After Effects & Illustrator",
        "Next.js & TypeScript",
        "Tailwind CSS",
      ],
    },
  ] as SkillGroup[],
};

export const showreelData = {
  heading: "Showreel",
  summary:
    "Kumpulan cuplikan antarmuka, sistem identitas, dan eksplorasi gerak dari proyek terbaru.",
  video: {
    // TODO: ganti dengan aset asli (/public/assets/showreel/showreel.mp4)
    src: "/assets/showreel/showreel.mp4",
    // TODO: ganti dengan aset asli (/public/assets/showreel/poster.jpg atau .webp)
    poster: "/assets/showreel/poster.svg",
    title: "Showreel Karya 2026",
    emptyLabel: "Showreel segera hadir",
    emptyHint:
      "Letakkan berkas video di /public/assets/showreel/showreel.mp4 untuk mengaktifkan pemutar otomatis.",
  },
  slides: [
    {
      id: "slide-1",
      title: "Eksplorasi Antarmuka Sistem Akademik",
      category: "UI/UX",
      description: "Perancangan ulang dasbor mahasiswa agar jadwal dan nilai terbaca dalam sekali lihat.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-1.webp)
      image: "/assets/showreel/slide-1.svg",
      tools: ["Figma", "Prototyping"],
      link: "/projects/portal-akademik-terpadu",
    },
    {
      id: "slide-2",
      title: "Sistem Identitas Pameran Desain Kampus",
      category: "Grafis",
      description: "Bahasa visual modular berbasis tipografi geometris untuk poster dan penunjuk arah.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-2.webp)
      image: "/assets/showreel/slide-2.svg",
      tools: ["Illustrator", "InDesign"],
      link: "/projects/identitas-pameran-ruang-temu",
    },
    {
      id: "slide-3",
      title: "Bumper Pembuka Konferensi Teknologi",
      category: "Motion",
      description: "Sekuens pembuka 20 detik dengan ritme tipografi kinetik dan transisi bentuk presisi.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-3.webp)
      image: "/assets/showreel/slide-3.svg",
      tools: ["After Effects", "Illustrator"],
      link: "/projects/motion-bumper-forum-si",
    },
    {
      id: "slide-4",
      title: "Situs Katalog Studio Arsitektur Mini",
      category: "Web",
      description: "Implementasi web editorial dengan transisi halaman halus dan indeks proyek cepat.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-4.webp)
      image: "/assets/showreel/slide-4.svg",
      tools: ["Next.js", "Framer Motion"],
      link: "/projects/arsip-digital-studio-garis",
    },
    {
      id: "slide-5",
      title: "Aplikasi Pelacakan Kebiasaan Baca",
      category: "UI/UX",
      description: "Pengalaman mobile yang tenang untuk mencatat progres buku tanpa notifikasi mengganggu.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-5.webp)
      image: "/assets/showreel/slide-5.svg",
      tools: ["Figma", "Maze"],
      link: "/projects/aplikasi-catatan-baca-jeda",
    },
    {
      id: "slide-6",
      title: "Seri Poster Tipografi Eksperimental",
      category: "Grafis",
      description: "Studi komposisi grid asimetris dan kontras ukuran huruf untuk cetak risograph.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-6.webp)
      image: "/assets/showreel/slide-6.svg",
      tools: ["Illustrator", "Photoshop"],
      link: "/projects/seri-poster-komposisi-gerak",
    },
    {
      id: "slide-7",
      title: "Mikro-interaksi Sistem Komponen",
      category: "Motion",
      description: "Dokumentasi kurva pegas dan umpan balik status untuk tombol, tab, serta modal.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-7.webp)
      image: "/assets/showreel/slide-7.svg",
      tools: ["After Effects", "Lottie", "Framer"],
      link: "/projects/portal-akademik-terpadu",
    },
    {
      id: "slide-8",
      title: "Halaman Peluncuran Produk Audio Lokal",
      category: "Web",
      description: "Presentasi produk berbasis scroll yang menyorot detail material dan spesifikasi.",
      // TODO: ganti dengan aset asli (/public/assets/showreel/slide-8.webp)
      image: "/assets/showreel/slide-8.svg",
      tools: ["Next.js", "GSAP"],
      link: "/projects/arsip-digital-studio-garis",
    },
  ] as ShowreelSlide[],
};

export const projectsData: ProjectItem[] = [
  {
    slug: "portal-akademik-terpadu",
    title: "Portal Akademik Terpadu",
    category: "UI/UX",
    year: "2026",
    featured: true,
    aspect: "landscape",
    description:
      "Menyederhanakan alur pengisian KRS dan pemantauan jadwal kuliah menjadi antarmuka yang ringkas.",
    overview:
      "Proyek studi kasus Sistem Informasi yang memetakan ulang hambatan mahasiswa saat pendaftaran mata kuliah. Saya menyusun arsitektur informasi baru, merancang komponen tabel jadwal yang responsif di ponsel, dan menguji prototipe bersama 18 responden mahasiswa.",
    role: "Product Designer & Peneliti UX",
    // TODO: ganti dengan aset asli (/public/assets/projects/project-1.webp)
    image: "/assets/projects/project-1.svg",
    tools: ["Figma", "FigJam", "Maze", "Design System"],
    link: "https://example.com/portal-akademik",
    gallery: [
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-1.svg",
        alt: "Peta alur pengguna dan struktur navigasi baru",
        caption: "Pemetaan ulang alur pengisian KRS dari tujuh langkah menjadi tiga langkah utama.",
      },
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-2.svg",
        alt: "Sistem komponen kartu jadwal dan status mata kuliah",
        caption: "Komponen modular untuk mode terang dan gelap dengan standar kontras AA.",
      },
    ],
  },
  {
    slug: "identitas-pameran-ruang-temu",
    title: "Identitas Pameran Ruang Temu",
    category: "Grafis",
    year: "2025",
    featured: false,
    aspect: "portrait",
    description:
      "Sistem identitas visual modular untuk pameran tugas akhir lintas disiplin desain dan teknologi.",
    overview:
      "Membangun bahasa grafis yang mudah diterapkan oleh panitia pada poster cetak, katalog, kartu peserta, dan unggahan media sosial. Struktur grid yang disiplin menjaga konsistensi meski konten tiap divisi beragam.",
    role: "Graphic Designer",
    // TODO: ganti dengan aset asli (/public/assets/projects/project-2.webp)
    image: "/assets/projects/project-2.svg",
    tools: ["Adobe Illustrator", "InDesign", "Photoshop"],
    link: "https://example.com/ruang-temu",
    gallery: [
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-3.svg",
        alt: "Penerapan poster utama pameran pada media cetak",
        caption: "Variasi poster seri A2 dengan hierarki tipografi yang mudah dibaca dari jarak jauh.",
      },
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-4.svg",
        alt: "Panduan penggunaan logo dan penunjuk arah ruangan",
        caption: "Sistem penunjuk arah minimalis untuk tiga area pameran.",
      },
    ],
  },
  {
    slug: "motion-bumper-forum-si",
    title: "Bumper Gerak Forum Sistem Informasi",
    category: "Motion",
    year: "2025",
    featured: false,
    aspect: "portrait",
    description:
      "Sekuens pembuka dan paket grafis siaran untuk seminar nasional mahasiswa Sistem Informasi.",
    overview:
      "Merancang storyboard, gaya visual, dan animasi 60fps untuk layar LED panggung utama serta kebutuhan siaran langsung. Fokus gerak ada pada transisi tipografi yang tegas dan tempo yang mengikuti ketukan audio.",
    role: "Motion Designer",
    // TODO: ganti dengan aset asli (/public/assets/projects/project-3.webp)
    image: "/assets/projects/project-3.svg",
    tools: ["After Effects", "Illustrator", "Premiere Pro"],
    link: "https://example.com/forum-si-motion",
    gallery: [
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-1.svg",
        alt: "Styleframe utama pembuka acara",
        caption: "Eksplorasi tiga styleframe sebelum masuk ke tahap animasi final.",
      },
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-3.svg",
        alt: "Paket lower-third pembicara dan transisi segmen",
        caption: "Template lower-third yang dapat diperbarui cepat oleh operator siaran.",
      },
    ],
  },
  {
    slug: "arsip-digital-studio-garis",
    title: "Arsip Digital Studio Garis",
    category: "Web",
    year: "2026",
    featured: true,
    aspect: "landscape",
    description:
      "Website katalog interaktif untuk studio arsitektur independen dengan fokus pada fotografi ruang.",
    overview:
      "Merancang dan membangun antarmuka web dari awal hingga siap deploy. Pengunjung dapat menyaring proyek berdasarkan tipologi bangunan dan menelusuri dokumentasi foto tanpa jeda muat yang mengganggu.",
    role: "UI Designer & Front-end Developer",
    // TODO: ganti dengan aset asli (/public/assets/projects/project-4.webp)
    image: "/assets/projects/project-4.svg",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    link: "https://example.com/studio-garis",
    gallery: [
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-2.svg",
        alt: "Tampilan indeks proyek desktop dan mobile",
        caption: "Tata letak responsif yang menjaga proporsi foto arsitektur di berbagai ukuran layar.",
      },
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-4.svg",
        alt: "Halaman detail proyek dengan galeri panjang",
        caption: "Ritme baca halaman detail yang memisahkan teks teknis dari foto ruang.",
      },
    ],
  },
  {
    slug: "aplikasi-catatan-baca-jeda",
    title: "Aplikasi Catatan Baca Jeda",
    category: "UI/UX",
    year: "2025",
    featured: true,
    aspect: "landscape",
    description:
      "Konsep aplikasi mobile untuk menyimpan kutipan buku dan meninjau ulang catatan secara berkala.",
    overview:
      "Berawal dari kebutuhan pribadi mencatat bacaan kuliah dan buku desain, Jeda dirancang dengan alur input kutipan cepat lewat kamera maupun teks singkat, serta ringkasan mingguan yang tidak membebani.",
    role: "UI/UX Designer",
    // TODO: ganti dengan aset asli (/public/assets/projects/project-5.webp)
    image: "/assets/projects/project-5.svg",
    tools: ["Figma", "Framer", "Prototyping"],
    link: "https://example.com/jeda-app",
    gallery: [
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-1.svg",
        alt: "Layar beranda dan pencatatan kutipan cepat",
        caption: "Antarmuka satu tangan yang mengutamakan aksi mencatat dalam dua ketukan.",
      },
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-2.svg",
        alt: "Mode baca malam dan indeks topik",
        caption: "Pengelompokan kutipan berdasarkan topik proyek atau mata kuliah.",
      },
    ],
  },
  {
    slug: "seri-poster-komposisi-gerak",
    title: "Seri Poster Komposisi Gerak",
    category: "Grafis",
    year: "2024",
    featured: false,
    aspect: "portrait",
    description:
      "Eksperimen pribadi enam poster tipografi yang menerjemahkan prinsip easing animasi ke media diam.",
    overview:
      "Mengeksplorasi bagaimana kurva percepatan dalam motion graphic dapat dirasakan melalui jarak huruf, pengulangan bentuk, dan pergeseran sumbu pada poster cetak format A3.",
    role: "Graphic Designer",
    // TODO: ganti dengan aset asli (/public/assets/projects/project-6.webp)
    image: "/assets/projects/project-6.svg",
    tools: ["Adobe Illustrator", "Photoshop"],
    link: "https://example.com/komposisi-gerak",
    gallery: [
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-3.svg",
        alt: "Tiga poster pertama dalam seri komposisi gerak",
        caption: "Studi ritme akselerasi dan deselerasi menggunakan satu keluarga huruf.",
      },
      {
        // TODO: ganti dengan aset asli
        src: "/assets/gallery/gallery-4.svg",
        alt: "Detail tekstur cetak dan struktur grid",
        caption: "Struktur grid 12 kolom yang menjadi dasar penempatan elemen.",
      },
    ],
  },
];

export const timelineData: TimelineItem[] = [
  // TODO: ganti dengan aset asli (riwayat pengalaman & pendidikan Anda)
  {
    period: "2025 — Sekarang",
    title: "Desainer UI/UX & Motion Lepas",
    organization: "Proyek Klien & Studio Independen",
    type: "Pengalaman",
    description:
      "Merancang antarmuka web, sistem identitas visual, dan aset gerak pendek untuk kebutuhan peluncuran produk serta acara kampus.",
  },
  {
    period: "2024 — 2025",
    title: "Kepala Divisi Desain Visual",
    organization: "Himpunan Mahasiswa Sistem Informasi",
    type: "Pengalaman",
    description:
      "Menyusun panduan grafis organisasi, mengarahkan tim berisi enam desainer, dan memproduksi materi publikasi seminar tahunan.",
  },
  {
    period: "2024",
    title: "Magang UI/UX Designer",
    organization: "Studio Produk Digital (Placeholder)",
    type: "Pengalaman",
    description:
      "Membantu merapikan pustaka komponen Figma, membuat prototipe interaktif, serta mendokumentasikan hasil uji pengguna.",
  },
  {
    period: "2023 — Sekarang",
    title: "S1 Sistem Informasi",
    organization: "Universitas (Placeholder)",
    type: "Pendidikan",
    description:
      "Fokus pada interaksi manusia-komputer, analisis sistem informasi, dan pengembangan aplikasi web modern.",
  },
];

export const contactData = {
  heading: "Mari berdiskusi tentang proyek atau kolaborasi.",
  description:
    "Terbuka untuk peluang magang, proyek freelance UI/UX, desain grafis, maupun motion graphic. Kirim pesan singkat atau hubungi lewat kanal di bawah.",
  // TODO: ganti dengan aset asli (email & akun sosial media Anda)
  email: "halo@afiffauzi.design",
  socials: [
    {
      label: "Email",
      handle: "halo@afiffauzi.design",
      href: "mailto:halo@afiffauzi.design",
    },
    {
      label: "LinkedIn",
      handle: "linkedin.com/in/afiffauzi",
      href: "https://linkedin.com",
    },
    {
      label: "Behance",
      handle: "behance.net/afiffauzi",
      href: "https://behance.net",
    },
    {
      label: "Instagram",
      handle: "@afiffauzi.design",
      href: "https://instagram.com",
    },
    {
      label: "GitHub",
      handle: "github.com/afiffauzi",
      href: "https://github.com",
    },
  ] as SocialLink[],
};
