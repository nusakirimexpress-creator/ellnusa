import { ShippingRate } from './types';

export const SHIPPING_RATES = {
  id: [
    { destination: "Singapore (SG Express Hub)", duration: "2 - 4 Hari Kerja", pricePerKg: "Rp 65.000" },
    { destination: "Kuala Lumpur & Selangor (MY Hub)", duration: "3 - 5 Hari Kerja", pricePerKg: "Rp 70.000" },
    { destination: "Sabah & Sarawak (East MY)", duration: "5 - 7 Hari Kerja", pricePerKg: "Rp 95.000" },
    { destination: "Taipei, New Taipei, Taichung (TW)", duration: "4 - 6 Hari Kerja", pricePerKg: "Rp 110.000" },
    { destination: "Hong Kong Island & Kowloon (HK)", duration: "3 - 5 Hari Kerja", pricePerKg: "Rp 90.000" },
    { destination: "Antar-Kota Domestik (Jakarta / Surabaya)", duration: "1 - 2 Hari Kerja", pricePerKg: "Rp 15.000" },
    { destination: "Luar Pulau Domestik (Medan / Makassar)", duration: "2 - 4 Hari Kerja", pricePerKg: "Rp 28.000" }
  ],
  zh: [
    { destination: "新加坡 (SG 快递枢纽)", duration: "2 - 4 工作日", pricePerKg: "Rp 65.000" },
    { destination: "吉隆坡与雪兰莪 (MY 枢纽)", duration: "3 - 5 工作日", pricePerKg: "Rp 70.000" },
    { destination: "沙巴与砂拉越 (东马)", duration: "5 - 7 工作日", pricePerKg: "Rp 95.000" },
    { destination: "台北、新北、台中 (TW)", duration: "4 - 6 工作日", pricePerKg: "Rp 110.000" },
    { destination: "香港岛与九龙 (HK)", duration: "3 - 5 工作日", pricePerKg: "Rp 90.000" },
    { destination: "国内城市间 (雅加达/泗水)", duration: "1 - 2 工作日", pricePerKg: "Rp 15.000" },
    { destination: "国内跨岛 (棉兰/望加锡)", duration: "2 - 4 工作日", pricePerKg: "Rp 28.000" }
  ]
};

export const STEP_GUIDE = {
  id: [
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
  ],
  zh: [
    {
      step: "01",
      title: "寻找心仪商品",
      desc: "在 Shopee、Tokopedia、TikTok Shop 或其他印尼购物网站上寻找您想购买的商品。"
    },
    {
      step: "02",
      title: "复制商品链接",
      desc: "从您的浏览器或购物应用中复制完整的商品 URL 地址。"
    },
    {
      step: "03",
      title: "粘贴在 NusaKirim",
      desc: "选择平台，在我们的表格中粘贴该商品链接，然后发送您的订单。"
    },
    {
      step: "04",
      title: "管理员采购与发货",
      desc: "我们的管理员将立即为您采购该商品，在仓库中安全包装，然后运送到您的目的地址。"
    }
  ]
};

export const EXPRESS_STATISTICS = {
  id: [
    { value: "48k+", label: "Paket Terkirim" },
    { value: "12 MENIT", label: "Rata-rata Respon Admin" },
    { value: "3 Gudang", label: "Yogyakarta, Jakarta, Batam" },
    { value: "99.8%", label: "Sampai Dengan Aman" }
  ],
  zh: [
    { value: "48k+", label: "已发运包裹" },
    { value: "12 分钟", label: "管理员平均回复时间" },
    { value: "3 处仓库", label: "日惹、雅加达、巴淡岛" },
    { value: "99.8%", label: "安全送达率" }
  ]
};

export const LOGISTICS_FAQ = {
  id: [
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
  ],
  zh: [
    {
      q: "从德尔纳特到索菲菲的运费是多少？",
      a: "每公斤 30,000 印尼盾。1公斤以下仍按 30,000 印尼盾计算。超过1公斤，每增加一公斤加收 10,000 印尼盾。"
    },
    {
      q: "在 NusaKirim 上粘贴链接的代购服务是如何运作的？",
      a: "您只需从 Shopee、Tokopedia 或 TikTok Shop 等平台复制商品链接，然后粘贴到我们的网站上。在您确认资金后，我们的管理员将检查商品库存，计算汇率（如果是国际目的地）和预估运费，并为您代购。"
    },
    {
      q: "管理员需要多长时间来回复我粘贴的链接？",
      a: "我们的系统会立即将您的购物链接登记到管理员数据库中。一旦录入，管理员将在工作时间内 10 到 20 分钟内通过我们的商务 WhatsApp 回复您的申请。"
    },
    {
      q: "我可以合并来自不同店铺的多个商品链接吗？",
      a: "当然可以！您可以逐个粘贴商品链接，并在 WhatsApp 上通知管理员，以便将商品合并到一个大包装中（包裹合并），以节省国际和国内运费。"
    }
  ]
