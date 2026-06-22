import { ShippingRate } from './types';

export const SHIPPING_RATES: ShippingRate[] = [
  { destination: "Singapore (SG Express Hub)", duration: "2 - 4 Hari Kerja", pricePerKg: "Rp 65.000" },
  { destination: "Kuala Lumpur & Selangor (MY Hub)", duration: "3 - 5 Hari Kerja", pricePerKg: "Rp 70.000" },
  { destination: "Sabah & Sarawak (East MY)", duration: "5 - 7 Hari Kerja", pricePerKg: "Rp 95.000" },
  { destination: "Taipei, New Taipei, Taichung (TW)", duration: "4 - 6 Hari Kerja", pricePerKg: "Rp 110.000" },
  { destination: "Hong Kong Island & Kowloon (HK)", duration: "3 - 5 Hari Kerja", pricePerKg: "Rp 90.000" },
  { destination: "Antar-Kota Domestik (Jakarta / Surabaya)", duration: "1 - 2 Hari Kerja", pricePerKg: "Rp 15.000" },
  { destination: "Luar Pulau Domestik (Medan / Makassar)", duration: "2 - 4 Hari Kerja", pricePerKg: "Rp 28.000" }
];

export const STEP_GUIDE = [
  {
    step: "01",
    title: "Cari Produk Idaman",
    desc: "Cari barang yang ingin Anda beli di Shopee, Tokopedia, TikTok Shop, atau situs belanja Indonesia lainnya."
  },
  {
    step: "02",
    title: "Salin Link Produk",
    desc: "Salin alamat URL produk lengkap dari peramban (browser) atau aplikasi belanja Anda."
  },
  {
    step: "03",
    title: "Tempel di NusaKirim",
    desc: "Tentukan marketplace, tempelkan link produk tersebut di formulir kami, dan kirimkan pesanan Anda."
  },
  {
    step: "04",
    title: "Admin Beli & Kirim",
    desc: "Admin kami akan langsung membelikan barang tersebut, memaketkannya dengan aman di gudang, lalu mengirimkannya ke alamat tujuan Anda."
  }
];

export const EXPRESS_STATISTICS = [
  { value: "48k+", label: "Paket Terkirim" },
  { value: "12 MENIT", label: "Rata-rata Respon Admin" },
  { value: "3 Gudang", label: "Yogyakarta, Jakarta, Batam" },
  { value: "99.8%", label: "Sampai Dengan Aman" }
];

export const LOGISTICS_FAQ = [
  {
    q: "Berapa ongkos kirim Ternate ke Sofifi?",
    a: "Rp30.000 per kg. Di bawah 1 kg tetap Rp30.000. Lebih dari 1 kg, tambah Rp10.000 per kg."
  },
  {
    q: "Bagaimana cara kerja jasa titip beli link di NusaKirim?",
    a: "Anda tinggal menyalin link produk dari marketplace seperti Shopee, Tokopedia, atau TikTok Shop dan menempelkannya di situs kami. Admin kami akan memeriksa stok barang, melakukan perhitungan kurs (bila destinasi internasional) beserta estimasi ongkir, dan membelikannya untuk Anda setelah dana dikonfirmasi."
  },
  {
    q: "Berapa lama waktu yang dibutuhkan admin untuk merespon link yang saya tempel?",
    a: "Sistem kami langsung mendaftarkan link belanja Anda ke database admin. Setelah masuk, admin akan merespon pengajuan Anda via WhatsApp bisnis kami dalam kurun waktu 10 hingga 20 menit pada jam operasional kerja."
  },
  {
    q: "Dapatkah saya menggabungkan beberapa link produk dari toko yang berbeda?",
    a: "Sangat bisa! Anda dapat menempelkan link produk satu per satu dan memberi tahu admin di WhatsApp agar barang digabungkan dalam satu kemasan besar (konsolidasi paket) demi menghemat ongkos kirim internasional maupun domestik."
  }
];
