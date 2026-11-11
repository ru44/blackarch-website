export default {
  home: {
    copy: "salin", copied: "tersalin", copyLabel: "Salin perintah", quick: "Perintah instalasi cepat",
    stats: [
      { n: "2800+", l: "paket alat" },
      { n: "x86_64", l: "+ ARM lewat Arch ARM" },
      { n: "Rolling", l: "rilis lewat pacman" },
      { n: "2013", l: "rilis pertama" },
    ],
    features: [
      { t: "Berbasis Arch", d: "Rilis rolling, pacman, kompatibel dengan AUR. Tanpa fork dan tanpa versi beku." },
      { t: "Semua alat dengan satu perintah", d: "Lebih dari 2800 alat, semuanya tersedia lewat pacman -S. Lihat halaman alat untuk daftarnya." },
      { t: "Instal per kategori", d: "Instal seluruh grup blackarch atau satu grup saja, misalnya blackarch-webapp." },
      { t: "Berjalan di Arch Anda", d: "Tambahkan repositori ke sistem yang sudah ada dengan strap.sh. Tidak perlu instal ulang." },
    ],
  },
  shots: { title: "Tampilannya", full: "ISO Lengkap", slim: "ISO Slim", aria: "Tangkapan layar BlackArch" },
  iso: {
    version: "Versi", size: "Ukuran", download: "Unduh", torrent: "Torrent", copy: "salin", copied: "tersalin",
    tags: ["Disarankan", "Minimal", "Offline", "Mesin virtual"],
    desc: [
      "Desktop XFCE, kumpulan alat populer, dan pemasang grafis.",
      "ISO boot berukuran kecil. Pilih hanya yang Anda perlukan; butuh internet.",
      "Semua alat saat build dibuat. Pembaruan dapat menimbulkan konflik; untuk instalasi offline.",
      "Image siap pakai untuk VirtualBox, VMware, dan QEMU.",
    ],
  },
  people: { copy: "salin", copied: "tersalin", label: "Pengembang BlackArch" },
  mirrors: {
    title: "Mirror resmi BlackArch Linux",
    summary: (c, m) => `${c} negara, ${m} mirror. Pilih yang terdekat.`,
    placeholder: "Cari berdasarkan negara atau alamat mirror…", noMatch: "Tidak ada mirror yang cocok", clear: "Hapus pencarian", copy: "salin", ok: "ok",
  },
  donate: {
    title: "Jaga BlackArch tetap bebas",
    intro: "Tim mengerjakan BlackArch secara sukarela di waktu luang. Donasi hanya untuk biaya proyek dan pengembangannya. Berapa pun jumlahnya berarti.",
    method: "Metode pembayaran", paypalTab: "PayPal", btcTab: "Bitcoin",
    paypalText: "Pilih jumlah berapa pun di halaman PayPal yang aman. Kartu atau saldo PayPal.",
    paypalCta: "Donasi lewat PayPal", wallet: "Buka di dompet",
    copy: "salin", copied: "tersalin", qrLabel: "Kode QR alamat Bitcoin", copyAddr: "Salin alamat Bitcoin",
    waysTitle: "Cara lain untuk membantu",
    costs: [
      { t: "Situs web dan domain", d: "Hosting dan domain blackarch.org." },
      { t: "Mirror unduhan", d: "Bandwidth dan penyimpanan agar ISO dan paket cepat diunduh di seluruh dunia." },
      { t: "Perangkat build dan pengujian", d: "Mesin untuk membangun, menandatangani, dan memeriksa paket sebelum rilis." },
      { t: "Pengembangan lanjutan", d: "Alat baru dan rilis berikutnya." },
    ],
    ways: [
      { t: "Beri bintang", d: "Satu bintang di GitHub sangat membantu.", a: "Buka GitHub" },
      { t: "Bantu pengguna", d: "Jawab pertanyaan di Matrix.", a: "Gabung Matrix" },
      { t: "Terjemahkan", d: "Terjemahkan panduan dari sumber LaTeX.", a: "Ambil sumbernya" },
      { t: "Sponsor perusahaan", d: "Organisasi dapat menjadi sponsor resmi.", a: "Hubungi tim" },
    ],
  },
  community: {
    channels: [
      { d: "Tempat terbaik untuk meminta bantuan. Obrolan real-time dengan pengguna dan tim." },
      { d: "Seluruh kode, skrip build, dan sumber situs web. Issue dan pull request dalam ukuran apa pun diterima." },
      { d: "Alat baru, mirror, dan perubahan penting proyek. Sebut kami jika menemukan bug atau punya ide." },
      { d: "Video tentang instalasi, konfigurasi, dan penggunaan alat-alat utama." },
      { d: "Hubungi langsung tim pengembang inti." },
    ],
    newsTitle: "Berita dan pembaruan",
    lead: "Kami terus mengerjakan fitur dan perbaikan baru. Anda dapat mengikutinya di sini.",
    updates: [
      { t: "Issue tracker", d: "Laporan bug dan permintaan alat dicatat dan ditangani di sini." },
      { t: "Pull request", d: "Apa yang sedang dipaketkan, diperbarui, dan dirilis saat ini." },
      { t: "Pengumuman", d: "Berita diterbitkan di Matrix, YouTube, dan X. Tersedia juga feed RSS." },
    ],
  },
  faq: {
    placeholder: "Cari di FAQ…", searchLabel: "Cari pertanyaan", all: "Semua", noResults: "Tidak ada pertanyaan yang cocok", clear: "Hapus pencarian",
    copy: "salin", copied: "tersalin", copyLabel: "Salin perintah", count: (n, t) => `${n} dari ${t} pertanyaan`, permalink: "Tautan ke pertanyaan ini",
  },
  tools: {
    placeholder: "Cari berdasarkan nama atau deskripsi…", searchLabel: "Cari alat", clear: "Hapus pencarian", all: "Semua",
    showing: "Menampilkan", of: "dari", tools: "alat", loading: "Memuat alat…", loadingLabel: "Memuat alat",
    noMatch: "Tidak ada alat yang cocok", clearFilters: "Hapus filter", name: "Nama", version: "Versi", description: "Deskripsi",
    category: "Kategori", website: "Situs web", visit: "Kunjungi situs", noSite: "Tidak ada situs web", install: "Instal", copy: "salin", copied: "tersalin",
    copyAria: (n) => `Salin perintah instalasi ${n}`, expandAria: (n) => `Tampilkan detail: ${n}`, filterLabel: "Filter berdasarkan kategori",
  },
};
