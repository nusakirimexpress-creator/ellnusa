import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Clock,
  Palette,
  ArrowRight,
  MessageCircle,
  MessageSquare,
  Send,
  ChevronLeft,
  X,
  Plus,
  Check,
  Truck,
  Copy,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  Info,
  Shield,
  Phone,
  HelpCircle,
  Search,
  CheckCircle,
  Globe2,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Bell,
  Ticket,
  QrCode
} from 'lucide-react';

import FloatingToast, { Toast } from './components/FloatingToast';
import NusaKirimLogo from './components/NusaKirimLogo';
import { LinkSubmission } from './types';
import {
  SHIPPING_RATES,
  STEP_GUIDE,
  EXPRESS_STATISTICS,
  LOGISTICS_FAQ
} from './data';

export default function App() {
  // Live Submissions list fetched from our Express full-stack API
  const [submissions, setSubmissions] = useState<LinkSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Language state (Indonesian 'id' vs Chinese 'zh')
  const [language, setLanguage] = useState<'id' | 'zh'>(() => {
    try {
      const saved = localStorage.getItem('nusakirim_lang');
      return (saved === 'zh' || saved === 'id') ? saved : 'id';
    } catch {
      return 'id';
    }
  });

  const translations = {
    id: {
      navHome: "Beranda",
      navAbout: "Tentang Kami",
      navHow: "Cara Kerja",
      navRates: "Tarif Kargo",
      navFaq: "FAQ",
      navGuide: "Panduan",
      navAdmin: "Admin Mode",
      navAdminExit: "Keluar Admin",
      title: "NusaKirim Express",
      subtitle: "Jembatan Belanja Ternate – Sofifi",
      loginGreeting: "Halo Kak! Silakan lengkapi profil singkat Anda sebelum memulai. Cukup sekali isi, selanjutnya tinggal salin & tempel link belanja saja!",
      langLabel: "Pilih Bahasa / 选择语言",
      nameLabel: "Nama Lengkap *",
      namePlaceholder: "Contoh: Muhammad Rian",
      nameTip: "Gunakan nama asli untuk mempermudah verifikasi paket.",
      phoneLabel: "Nomor WhatsApp Aktif *",
      phonePlaceholder: "Contoh: 08123456789 atau +62...",
      phoneTip: "Admin akan segera berkabar melalui nomor WhatsApp ini.",
      addressLabel: "Alamat Pengiriman Lengkap *",
      addressPlaceholder: "Contoh: Perumahan Indah Sofifi, Blok C No. 5, Sofifi, Maluku Utara (Dekat Kantor Gubernur)",
      addressTip: "Pastikan rincian rute pengiriman, kelurahan, dan kecamatan ditulis lengkap.",
      loginBtn: "⚡ Masuk & Mulai Belanja ⚡",
      loginFooter: "Data Anda aman & tersimpan secara lokal di browser Anda.",
      
      // Hero / Welcome row
      welcomeBack: "Selamat Datang,",
      userBadge: "PELANGGAN SETIA",
      greetingSearchPlaceholder: "Tempel link barang jastip anda di sini...",
      pointCounter: "Poin NK Anda",
      memberTier: "Member Premium",
      activeOrderDesc: "Punya pesanan? Klik tab di bawah untuk memantau status.",
      
      // Floating services row (Enjoy shopping & Tagihan)
      enjoyShopping: "ENJOY SHOPPING",
      enjoyShoppingSub: "Mulai Jastip Baru",
      tagihanLapor: "TAGIHAN & LAPOR",
      chatAdminLive: "Chat Admin Live",
      
      // Special Info Bar
      specialTitle: "Layanan Spesial NK",
      specialBanner: "⚡ KIRIM PAKET TERNATE - SOFIFI MURAH AMAN ⚡",
      specialBadge: "Mulai Rp 30rb/Kg",
      
      // Order Form
      valuePropTitle: "Formulir Jastip NusaKirim Express",
      valuePropSub: "JASA TITIP BELANJA & KARGO AMAN",
      valuePropStep1: "Tempel link barang idaman Anda & isi formulir di samping.",
      valuePropStep2: "Admin kami akan mengecek, merincikan harga total, dan membuatkan invoice pemesanan.",
      valuePropStep3: "Barang dibelikan, di-repacking gratis dengan bubble wrap tebal, dan dikirimkan dengan kargo murah.",
      orderFormTips: "Tips Lacak: Setelah tombol \"Kirim Pesanan\" diklik, tab chat pelacakan akan otomatis terbuka. Anda juga bebas mengobrol langsung dengan Admin di chat room tersebut.",
      orderFormTitle: "FORMULIR PEMESANAN JASTIP & KARGO",
      marketplaceLabel: "Marketplace Asal Barang *",
      linkInputLabel: "Tempel Link Produk / URL Barang *",
      linkInputPlaceholder: "Contoh: https://shopee.co.id/product/...",
      qtyLabel: "Jumlah Pembelian (Quantity) *",
      notesLabel: "Catatan Tambahan untuk Admin (Opsional)",
      notesPlaceholder: "Contoh: Warna Hitam, Ukuran XL, atau varian alternatif jika kosong.",
      submitOrderBtn: "KIRIM PESANAN JASTIP SEKARANG 🚀",
      shippingEstimateNote: "Estimasi Pengantaran: 1-2 Hari setelah barang mendarat di Gudang Ternate.",
      
      // Pricing Comparer & Steps
      caraKerjaTitle: "Cara Kerja NK Express",
      caraKerjaSub: "NK Express membantu Anda menerima paket di Ternate dan mengirimkannya ke Sofifi. Ongkos kirim dari Ternate ke Sofifi biasanya Rp80.000 per kg. Dengan NK Express, cukup Rp30.000 per kg. Caranya mudah: belanja seperti biasa, isi alamat gudang kami di Ternate, kirim screenshot pesanan ke kami, lalu ambil paket di Sofifi.",
      tarifUmum: "Ongkir Umum Biasa",
      tarifNK: "Tarif Spesial NK Express",
      tarifNKSub: "* Lebih hemat 60%+ untuk pengiriman Bastiong ke Halmahera / Sofifi!",
      prosedurTitle: "PROSEDUR PELANGGAN (3.3)",
      prosedurSub: "4 Langkah Mudah Kirim & Beli",
      
      step1Title: "Belanja seperti biasa",
      step1Desc: "Belanja di Shopee / Tokopedia / TikTok Shop / Lazada seperti biasanya Anda belanja online harian.",
      step2Title: "Isi alamat gudang kami",
      step2Desc: "Gunakan alamat gudang kami di Ternate sebagai alamat pengiriman. Format nama penerima: NK-Nama Anda.",
      step3Title: "Kirim bukti pesanan",
      step3Desc: "Selesaikan pembayaran belanja, lalu screenshot rincian pesanan dan kirim langsung ke WhatsApp kami.",
      step4Title: "Ambil paket di Sofifi",
      step4Desc: "Kami akan memantau kedatangan di Ternate, melalukan cross-shipping cepat, dan mengabari begitu paket tiba di Sofifi.",
      
      // Admin Mode Translations
      adminCommandCenter: "NusaKirim Order Command Center",
      adminTitle: "Pengelola Link & Pesanan Masuk",
      adminSubtitle: "Gunakan panel ini untuk meninjau link produk yang ditempelkan pembeli, mengisi estimasi harga, merubah status, dan mengirim instruksi bayar langsung via WhatsApp.",
      adminTotalLinks: "Total Link",
      adminTabPending: "🆕 Masuk",
      adminTabProcessing: "⚙️ Diproses",
      adminTabCompleted: "✅ Selesai",
      adminTabCancelled: "❌ Batal",
      adminWaConfigTitle: "Konfigurasi Notifikasi WhatsApp Admin",
      adminWaConfigDesc: "Masukkan nomor WhatsApp Anda (dengan kode negara, contoh: 6281245695410). Pelanggan baru akan otomatis diarahkan untuk mengirim pesan notifikasi pendaftaran ke nomor ini setelah mereka berhasil login/daftar.",
      adminWaConfigActive: "Aktif",
      adminSearchPlaceholder: "Cari berdasarkan nama, No WA, produk, atau ID...",
      adminAllStatus: "Semua Status",
      adminLoading: "Memuat pesanan dan draf pengiriman...",
      adminNoOrdersTitle: "Belum Ada Pesanan yang Masuk",
      adminNoOrdersDesc: "Sistem dalam keadaan siap! Pesanan baru yang diajukan oleh pelanggan (menyertakan Nama, No. WhatsApp, serta Link Produk) akan otomatis muncul secara instan di panel admin ini.",
      adminRefreshFilter: "Refresh / Tampilkan Semua Saringan",
      adminOrderLabel: "ORDER #",
      adminBuyerLabel: "NAMA PEMBELI",
      adminWaLabel: "NO WHATSAPP",
      adminAddressLabel: "ALAMAT PENGIRIMAN",
      adminLinkCustomer: "LINK BELANJA PELANGGAN",
      adminQtyLabel: "QTY PESANAN",
      adminNotesLabel: "CATATAN KHUSUS PELANGGAN",
      adminNoNotes: "Tidak ada catatan khusus.",
      adminCostLabel: "ESTIMASI BIAYA & ONGKIR",
      adminAutoSave: "AUTO-SAVE",
      adminCostNote: "Tekan 'Enter' atau klik di luar kotak untuk menyimpan biaya.",
      adminChangeStatusLabel: "RUBAH STATUS PESANAN",
      adminStatusPendingOpt: "🆕 Masuk (Pending)",
      adminStatusProcessingOpt: "⚙️ Sedang Diproses",
      adminStatusCompletedOpt: "✅ Selesai Dibelikan",
      adminStatusCancelledOpt: "❌ Batalkan Pesanan",
      adminChatLiveBtn: "Chat Live",
      adminWaChatBtn: "WA Chat",
      adminActivityTitle: "Aktivitas Masuk (Live)",
      adminActivityLogCount: "Log",
      adminActivityDesc: "Laporan aktivitas real-time pengunjung yang membuka web, mendaftar biodata, atau mengirim link belanja kargo secara instan.",
      adminNoActivity: "Belum ada aktivitas terekam...",
      adminRefreshLogBtn: "REFRESH LOG",
      adminSimulationBtn: "🧪 Simulasi Masuk",
      adminChatLiveHeader: "CUSTOMER LIVE CHAT",
      adminChatLoading: "Memanggil pesan obrolan...",
      adminChatNoMessagesTitle: "Belum Ada Obrolan",
      adminChatNoMessagesDesc: "Hubungi pelanggan untuk koordinasi pengemasan barang, konfirmasi harga, atau ongkir jastip mereka.",
      adminChatPlaceholder: "Ketik pesan balasan...",
      adminQuickBought: "🛒 Sedang dibelikan",
      adminQuickCost: "💳 Estimasi biaya",
      adminQuickReady: "📦 Siap kirim",
      duplicateLinkError: "Link produk ini sudah pernah diajukan sebelumnya dan sedang diproses admin agar tidak terjadi pemesanan ganda.",
    },
    zh: {
      navHome: "首页",
      navAbout: "关于我们",
      navHow: "运作流程",
      navRates: "货运价格",
      navFaq: "常见问题",
      navGuide: "指南",
      navAdmin: "管理员模式",
      navAdminExit: "退出管理员",
      title: "NusaKirim Express (NK快递)",
      subtitle: "德尔纳特 – 索菲菲 购物桥梁",
      loginGreeting: "您好！在开始之前，请先完善您的简要个人信息。只需填写一次，之后即可直接复制和粘贴购物链接！",
      langLabel: "Pilih Bahasa / 选择语言",
      nameLabel: "真实姓名 *",
      namePlaceholder: "例如: Muhammad Rian",
      nameTip: "请使用真实姓名，以便于包裹核对和签收。",
      phoneLabel: "有效的 WhatsApp 号码 *",
      phonePlaceholder: "例如: 08123456789 或 +62...",
      phoneTip: "管理员将通过此 WhatsApp 号码与您取得联系。",
      addressLabel: "详细收货地址 *",
      addressPlaceholder: "例如: Perumahan Indah Sofifi, Blok C No. 5, Sofifi, Maluku Utara (靠近省长办公室)",
      addressTip: "请确保写明配送路线详情、村和区等完整信息。",
      loginBtn: "⚡ 登录并开始购物 ⚡",
      loginFooter: "您的数据安全，且在浏览器中本地加密保存。",
      
      // Hero / Welcome row
      welcomeBack: "欢迎回来，",
      userBadge: "忠实客户",
      greetingSearchPlaceholder: "在此处粘贴您的代购产品链接...",
      pointCounter: "您的 NK 积分",
      memberTier: "高级会员",
      activeOrderDesc: "有订单吗？点击下方标题栏即可监控订单状态。",
      
      // Floating services row (Enjoy shopping & Tagihan)
      enjoyShopping: "享受购物",
      enjoyShoppingSub: "开始新代购下单",
      tagihanLapor: "账单与反馈",
      chatAdminLive: "与在线客服沟通",
      
      // Special Info Bar
      specialTitle: "NK 特别服务",
      specialBanner: "⚡ 德尔纳特 - 索菲菲 特惠安全包裹运输 ⚡",
      specialBadge: "3万印尼盾/公斤起",
      
      // Order Form
      valuePropTitle: "NK Express 代购与货运申请表",
      valuePropSub: "安全代购与超值货运服务",
      valuePropStep1: "粘贴您心仪商品的链接并在右侧填写表格。",
      valuePropStep2: "我们的客服会审核、罗列总价，并为您生成付款账单。",
      valuePropStep3: "我们采购商品，免费提供气泡膜加厚包装，并安排特惠物流发货。",
      orderFormTips: "追踪小贴士：点击“提交代购订单”按钮后，追踪聊天窗口将自动打开。您也可以在聊天室中直接与客服沟通。",
      orderFormTitle: "代购与货运下单表格",
      marketplaceLabel: "商品来源平台 *",
      linkInputLabel: "粘贴商品链接 / 网址 URL *",
      linkInputPlaceholder: "例如: https://shopee.co.id/product/...",
      qtyLabel: "购买数量 *",
      notesLabel: "给管理员的备注 (选填)",
      notesPlaceholder: "例如：黑色，XL码，或者缺货时的备选颜色款式。",
      submitOrderBtn: "立即提交代购订单 🚀",
      shippingEstimateNote: "预计送达时间：货物抵达德尔纳特仓库后 1-2 天内送达。",
      
      // Pricing Comparer & Steps
      caraKerjaTitle: "NK Express 运作流程",
      caraKerjaSub: "NK Express 帮助您在德尔纳特代收包裹并运送到索菲菲。从德尔纳特到索菲菲的普通运费通常高达 80,000 印尼盾/公斤，而通过 NK Express 仅需 30,000 印尼盾/公斤。流程非常简单：像平常一样网购，收货地址填写我们在德尔纳特的仓库地址，截图订单发送给我们，最后在索菲菲提货即可。",
      tarifUmum: "普通物流运费",
      tarifNK: "NK Express 特惠运费",
      tarifNKSub: "* 巴斯提翁到哈马黑拉/索菲菲的货运可节省60%以上！",
      prosedurTitle: "客户操作流程 (3.3)",
      prosedurSub: "只需 4 步 轻松网购与转运",
      
      step1Title: "第一步：轻松购物",
      step1Desc: "像往常一样在 Shopee / Tokopedia / TikTok Shop / Lazada 平台挑选心仪的商品并下单付款。",
      step2Title: "第二步：填写我们的仓库地址",
      step2Desc: "下单时，使用我们在德尔纳特的仓库地址作为收货地址。收货人格式：NK-您的姓名。",
      step3Title: "第三步：发送订单凭证",
      step3Desc: "在商城下单后，将订单详情截图直接发送到我们的客服 WhatsApp 上进行登记。",
      step4Title: "第四步：在索菲菲提取包裹",
      step4Desc: "我们将实时监控货物在德尔纳特的到达情况，迅速安排驳船转运，并在货物抵达索菲菲后即时通知您签收。",
      
      // Admin Mode Translations
      adminCommandCenter: "NusaKirim 订单控制中心",
      adminTitle: "链接与入库订单管理",
      adminSubtitle: "使用此面板审核买家粘贴的商品链接、填写预估价格、更改状态并通过 WhatsApp 直接发送支付指示。",
      adminTotalLinks: "链接总数",
      adminTabPending: "🆕 待处理",
      adminTabProcessing: "⚙️ 处理中",
      adminTabCompleted: "✅ 已完成",
      adminTabCancelled: "❌ 已取消",
      adminWaConfigTitle: "管理员 WhatsApp 通知配置",
      adminWaConfigDesc: "输入您的 WhatsApp 号码（带国家代码，例如：6281245695410）。新客户在成功登录/注册后将自动引导向该号码发送注册通知消息。",
      adminWaConfigActive: "已启用",
      adminSearchPlaceholder: "按姓名、WhatsApp号、产品或ID搜索...",
      adminAllStatus: "所有状态",
      adminLoading: "正在加载订单和出货草稿...",
      adminNoOrdersTitle: "暂无新订单",
      adminNoOrdersDesc: "系统准备就绪！客户提交的新订单（包含姓名、WhatsApp 号码以及商品链接）将自动即时显示在此管理面板中。",
      adminRefreshFilter: "刷新 / 显示所有筛选",
      adminOrderLabel: "订单 #",
      adminBuyerLabel: "买家姓名",
      adminWaLabel: "WhatsApp 号码",
      adminAddressLabel: "收货地址",
      adminLinkCustomer: "客户购物链接",
      adminQtyLabel: "订单数量",
      adminNotesLabel: "客户特别备注",
      adminNoNotes: "暂无特别备注。",
      adminCostLabel: "预估费用与运费",
      adminAutoSave: "自动保存",
      adminCostNote: "按回车键或点击框外以保存费用。",
      adminChangeStatusLabel: "修改订单状态",
      adminStatusPendingOpt: "🆕 新建 (待处理)",
      adminStatusProcessingOpt: "⚙️ 正在处理",
      adminStatusCompletedOpt: "✅ 采购完成",
      adminStatusCancelledOpt: "❌ 取消订单",
      adminChatLiveBtn: "在线客服",
      adminWaChatBtn: "WA 聊天",
      adminActivityTitle: "实时入站活动",
      adminActivityLogCount: "日志",
      adminActivityDesc: "实时报告打开网页、注册个人信息或即时发送货运购物链接的访问者活动。",
      adminNoActivity: "暂无记录的活动...",
      adminRefreshLogBtn: "刷新日志",
      adminSimulationBtn: "模拟进入",
      adminChatLiveHeader: "客户在线客服",
      adminChatLoading: "正在拉取聊天记录...",
      adminChatNoMessagesTitle: "暂无聊天记录",
      adminChatNoMessagesDesc: "联系客户以协调商品包装、确认价格或确认其代购运费。",
      adminChatPlaceholder: "输入回复消息...",
      adminQuickBought: "🛒 正在采购中",
      adminQuickCost: "预估所需费用",
      adminQuickReady: "📦 打包完成准备发货",
      duplicateLinkError: "该商品链接此前已提交，管理员正在处理中，以避免重复下单。",
    }
  };

  const t = translations[language];

  const handleLanguageChange = (lang: 'id' | 'zh') => {
    setLanguage(lang);
    try {
      localStorage.setItem('nusakirim_lang', lang);
    } catch {}
    addToast(lang === 'zh' ? '语言已切换为中文' : 'Bahasa berhasil diubah ke Indonesia', 'success');
  };
  
  // User Profile from local storage (Login / Signup)
  const [userProfile, setUserProfile] = useState<{ name: string; phone: string; address: string } | null>(() => {
    try {
      const saved = localStorage.getItem('nusakirim_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showWaNotificationModal, setShowWaNotificationModal] = useState(false);
  const [recentRegisteredUser, setRecentRegisteredUser] = useState<{ name: string; phone: string; address: string } | null>(null);
  const [adminWhatsAppNumber, setAdminWhatsAppNumber] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('nusakirim_admin_whatsapp');
      return saved || '6281245695410';
    } catch {
      return '621245695410';
    }
  });

  // New Submission Form State
  const [selectedMarketplace, setSelectedMarketplace] = useState<'shopee' | 'tokopedia' | 'tiktok' | 'lainnya'>('shopee');
  const [productUrl, setProductUrl] = useState('');
  
  const [customerName, setCustomerName] = useState(() => {
    try {
      const saved = localStorage.getItem('nusakirim_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || '';
      }
    } catch {}
    return '';
  });

  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      const saved = localStorage.getItem('nusakirim_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.phone || '';
      }
    } catch {}
    return '';
  });

  const [customerAddress, setCustomerAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('nusakirim_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.address || '';
      }
    } catch {}
    return '';
  });

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Real-time visitor activity states & admin notifications
  const [activities, setActivities] = useState<any[]>([]);
  const [seenActivityIds, setSeenActivityIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nusakirim_seen_activity_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const logActivity = async (type: 'login' | 'register' | 'enter' | 'submit_order', name: string, phone: string, address: string, details?: string) => {
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, customerName: name, customerPhone: phone, customerAddress: address, details })
      });
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  // Report visitor enter/presence once per session
  useEffect(() => {
    const notifyVisitorEnter = async () => {
      try {
        const saved = localStorage.getItem('nusakirim_user_profile');
        if (saved) {
          const profile = JSON.parse(saved);
          if (profile.name && profile.phone) {
            const reported = sessionStorage.getItem('nusakirim_session_notified');
            if (!reported) {
              await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'enter',
                  customerName: profile.name,
                  customerPhone: profile.phone,
                  customerAddress: profile.address || '',
                  details: 'Membuka / Masuk kembali ke Web NusaKirim'
                })
              });
              sessionStorage.setItem('nusakirim_session_notified', 'true');
            }
          }
        }
      } catch (err) {
        console.error("Gagal mengirim notifikasi kunjungan:", err);
      }
    };
    
    const timer = setTimeout(() => {
      notifyVisitorEnter();
    }, 1200);
    return () => clearTimeout(timer);
  }, [userProfile]);

  // Local active orders for tracking & live chat
  const [mySubmissions, setMySubmissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nusakirim_my_submissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Automatically save customer tracking items to local storage
  useEffect(() => {
    localStorage.setItem('nusakirim_my_submissions', JSON.stringify(mySubmissions));
  }, [mySubmissions]);

  // Customer Chat widget states
  const [isOpenChatWidget, setIsOpenChatWidget] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'admin' | 'customer'; message: string; createdAt: string }[]>([]);
  const [chatInputText, setChatInputText] = useState('');
  const [isChatBoxLoading, setIsChatBoxLoading] = useState(false);
  const [customerTrackInput, setCustomerTrackInput] = useState('');

  // Admin Side Active Chat
  const [adminActiveChatId, setAdminActiveChatId] = useState<string | null>(null);

  // Admin and filtering states
  const [adminFilter, setAdminFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');
  const [adminSearch, setAdminSearch] = useState('');

  // Admin password validation states
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Scroll to section helper
  const handleScrollToSection = (id: string) => {
    if (isAdminMode) {
      setIsAdminMode(false);
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Floating Toasts Center
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status submission submit lock
  const [submitPending, setSubmitPending] = useState(false);

  // 1. Fetch live submissions from server
  const fetchSubmissions = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch('/api/submissions');
      const result = await response.json();
      if (result.success) {
        setSubmissions(result.data);
      } else {
        console.error("Gagal mengambil submissions:", result.error);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 1b. Fetch live activity logs
  const fetchActivities = async (silent = false) => {
    try {
      const response = await fetch('/api/activities');
      const result = await response.json();
      if (result.success) {
        const fetchedLogs = result.data;
        
        // If we have unseen activities, trigger toast alerts
        if (fetchedLogs.length > 0) {
          const unseenLogs = fetchedLogs.filter((log: any) => !seenActivityIds.includes(log.id));
          if (unseenLogs.length > 0) {
            // Only trigger toast alerts if we are in admin mode or if they are recent submit_orders
            unseenLogs.forEach((log: any) => {
              let iconMsg = "🎒";
              let titleMsg = "Aktivitas Pelanggan";
              if (log.type === "register") {
                iconMsg = "✨ PENDAFTARAN BARU";
                titleMsg = `${log.customerName} baru saja mendaftar profil di NusaKirim! No. WA: ${log.customerPhone}`;
              } else if (log.type === "enter") {
                iconMsg = "🟢 PENGUNJUNG DATANG";
                titleMsg = `${log.customerName} baru saja membuka website NusaKirim.`;
              } else if (log.type === "submit_order") {
                iconMsg = "🛍️ LINK BELANJA BARU";
                titleMsg = `${log.customerName} baru saja mengajukan pesanan link belanja baru!`;
              }

              // Notify with a toast
              addToast(`[${iconMsg}] ${titleMsg}`, 'success');
            });

            const newSeen = [...seenActivityIds, ...unseenLogs.map((log: any) => log.id)];
            const limitedSeen = newSeen.slice(-100);
            setSeenActivityIds(limitedSeen);
            localStorage.setItem('nusakirim_seen_activity_ids', JSON.stringify(limitedSeen));
          }
        }
        setActivities(fetchedLogs);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Poll submissions every 3 seconds so both views stay automatically in sync!
  useEffect(() => {
    fetchSubmissions();
    fetchActivities();
    const interval = setInterval(() => {
      fetchSubmissions(true);
      fetchActivities(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAdminMode, seenActivityIds]);

  // Fetch messages from a specific order thread
  const fetchChatMessages = async (id: string, silent = false) => {
    if (!id) return;
    if (!silent) setIsChatBoxLoading(true);
    try {
      const response = await fetch(`/api/submissions/${id}/messages`);
      const result = await response.json();
      if (result.success) {
        setChatMessages(result.data);
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    } finally {
      setIsChatBoxLoading(false);
    }
  };

  // Submit a chat message from either a customer or admin
  const handleSendChatMessage = async (id: string, sender: 'admin' | 'customer', textMessage: string) => {
    if (!textMessage.trim()) return false;
    try {
      const response = await fetch(`/api/submissions/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender,
          message: textMessage.trim()
        })
      });
      const result = await response.json();
      if (result.success) {
        // Update messages list optimistically
        setChatMessages((prev) => [...prev, result.data]);
        return true;
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
    return false;
  };

  // Polling active chat threads every 3 seconds for fast reply visibility!
  useEffect(() => {
    const activeId = selectedChatId || adminActiveChatId;
    if (!activeId) return;

    // Load initial messages immediately (if first time opening chatId)
    fetchChatMessages(activeId, true);

    const interval = setInterval(() => {
      fetchChatMessages(activeId, true);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedChatId, adminActiveChatId]);

  // 2. Add Toast notification handler
  const addToast = (message: string, type: 'success' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 3. Post a new order submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productUrl.trim()) {
      addToast('Harap tempelkan link produk terlebih dahulu.', 'info');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      addToast('Harap lengkapi nama dan No WhatsApp Anda.', 'info');
      return;
    }

    // Prevent duplicate product link submission if there is an active order with the same link
    const targetUrl = productUrl.trim().toLowerCase();
    const isDuplicate = submissions.some(sub => 
      sub.productUrl.trim().toLowerCase() === targetUrl && sub.status !== 'cancelled'
    );
    if (isDuplicate) {
      addToast(t.duplicateLinkError, 'info');
      return;
    }

    setSubmitPending(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          marketplace: selectedMarketplace,
          productUrl: productUrl.trim(),
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          quantity: quantity,
          notes: notes.trim()
        })
      });

      const result = await response.json();
      if (result.success) {
        addToast('Link belanja Anda berhasil diajukan! Admin segera memprosesnya.', 'success');
        
        // Add to customer's locally tracked order submissions
        if (result.data && result.data.id) {
          setMySubmissions((prev) => {
            if (!prev.includes(result.data.id)) {
              return [...prev, result.data.id];
            }
            return prev;
          });
          // Auto-focus chat on their new order
          setSelectedChatId(result.data.id);
          setIsOpenChatWidget(true);
        }

        // Reset customer form
        setProductUrl('');
        setQuantity(1);
        setNotes('');
        
        // Refresh items list
        fetchSubmissions(true);
        
        // Log submission activity to admin feed
        logActivity('submit_order', customerName.trim(), customerPhone.trim(), customerAddress.trim(), `Mengajukan link pesanan baru (${selectedMarketplace.toUpperCase()} - Qty: ${quantity})`);
      } else {
        addToast(result.error || 'Gagal mengirimkan pengajuan.', 'info');
      }
    } catch (error) {
      addToast('Terjadi kesalahan koneksi server.', 'info');
    } finally {
      setSubmitPending(false);
    }
  };

  // 4. Update order status and pricing (Admin Only)
  const handleUpdateStatus = async (id: string, newStatus: string, updatedPrice?: string) => {
    try {
      const payload: any = {};
      if (newStatus) payload.status = newStatus;
      if (updatedPrice !== undefined) payload.priceEstimate = updatedPrice;

      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        addToast(`Pesanan #${id.replace('sub-', '')} berhasil diperbarui!`, 'success');
        fetchSubmissions(true);
      } else {
        addToast(result.error || 'Gagal mengubah status.', 'info');
      }
    } catch (error) {
      addToast('Gagal merubah status di server.', 'info');
    }
  };

  // 5. Delete an order (Admin Only)
  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data pengajuan pesanan ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        addToast('Data pesanan berhasil dihapus dari sistem.', 'success');
        fetchSubmissions(true);
      } else {
        addToast('Gagal menghapus data.', 'info');
      }
    } catch (error) {
      addToast('Kesalahan sewaktu mengirim request hapus.', 'info');
    }
  };

  // Helper: Copy a link to clipboard
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    addToast(`${label} disalin ke clipboard!`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Helper: Format WA URL for Admin to directly ping the customer
  const getWhatsAppPingUrl = (item: LinkSubmission) => {
    const cleanPhone = item.customerPhone.replace(/\D/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '62' + cleanPhone.slice(1);
    }

    let statusGreeting = '';
    if (item.status === 'pending') {
      statusGreeting = 'sedang kami tinjau dan hitung estimasi biaya pengirimannya.';
    } else if (item.status === 'processing') {
      statusGreeting = `telah kami proses ke tahap pembelian. Estimasi tagihan adalah ${item.priceEstimate || 'menunggu konfirmasi berat kargo'}.`;
    } else if (item.status === 'completed') {
      statusGreeting = 'telah selesai kami belikan dan siap diberangkatkan melalui kurir ekspedisi NusaKirim!';
    } else {
      statusGreeting = 'mengalami kendala atau dibatalkan. Silakan kirimkan link pengganti.';
    }

    const text = `Halo Kak *${item.customerName}*, kami dari Admin *NusaKirim Cargo & Jastip* 📦

Mengonfirmasi pengajuan link belanja Anda:
• *Kode Pesanan:* #${item.id.replace('sub-', '')}
• *Asal Marketplace:* ${item.marketplace.toUpperCase()}
• *Tautan Produk:* ${item.productUrl}
• *Jumlah Qty:* ${item.quantity} pcs
• *Catatan Anda:* ${item.notes || '-'}

Status pesanan saat ini ${statusGreeting}

Silakan konfirmasikan kelanjutan pemesanan jika estimasi sudah sesuai. Terima kasih!`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  // Filtered submissions list for the admin view
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchStatus = adminFilter === 'all' || item.status === adminFilter;
      const cleanSearch = adminSearch.toLowerCase();
      const matchText =
        item.customerName.toLowerCase().includes(cleanSearch) ||
        item.customerPhone.includes(cleanSearch) ||
        item.productUrl.toLowerCase().includes(cleanSearch) ||
        item.id.toLowerCase().includes(cleanSearch);
      return matchStatus && matchText;
    });
  }, [submissions, adminFilter, adminSearch]);

  // Dynamically yield matching color styles based on selected marketplace tab
  const getMarketplaceStyling = (provider: 'shopee' | 'tokopedia' | 'tiktok' | 'lainnya') => {
    switch (provider) {
      case 'shopee':
        return {
          tabColor: 'border-orange-500 text-orange-600 bg-orange-50',
          borderColor: 'border-orange-200 focus:ring-orange-500',
          accentBg: 'bg-orange-500 hover:bg-orange-600',
          badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
          label: 'Shopee Indonesia'
        };
      case 'tokopedia':
        return {
          tabColor: 'border-emerald-500 text-emerald-600 bg-emerald-50',
          borderColor: 'border-emerald-200 focus:ring-emerald-500',
          accentBg: 'bg-emerald-500 hover:bg-emerald-650',
          badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          label: 'Tokopedia'
        };
      case 'tiktok':
        return {
          tabColor: 'border-zinc-800 text-zinc-900 bg-zinc-100',
          borderColor: 'border-zinc-350 focus:ring-zinc-900',
          accentBg: 'bg-zinc-900 hover:bg-zinc-800',
          badgeColor: 'bg-zinc-100 text-zinc-800 border-zinc-300',
          label: 'TikTok Shop'
        };
      case 'lainnya':
        return {
          tabColor: 'border-studio-accent text-amber-700 bg-amber-50',
          borderColor: 'border-zinc-250 focus:ring-studio-accent',
          accentBg: 'bg-studio-accent hover:bg-studio-accent/90 text-studio-charcoal',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Lainnya / Situs Web Bebas'
        };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nusakirim_user_profile');
    setUserProfile(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    addToast('Anda berhasil keluar dari profil.', 'info');
  };

  const marketingStyle = getMarketplaceStyling(selectedMarketplace);

  return (
    <div className="min-h-screen bg-studio-beige text-studio-charcoal flex flex-col justify-between">
      
      {/* 1. NAVIGATION HEADER */}
      <header id="main-navigation" className="sticky top-0 z-40 bg-studio-beige/90 backdrop-blur-md border-b border-zinc-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Identity mark */}
          <NusaKirimLogo size="md" layout="horizontal" />

          {/* Menu links in the center (Visible on md and up) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-650">
            <button 
              onClick={() => handleScrollToSection('hero-portal')} 
              className="hover:text-studio-accent transition-colors cursor-pointer text-zinc-600 hover:underline decoration-studio-accent decoration-2 underline-offset-4"
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => handleScrollToSection('tentang-kami')} 
              className="hover:text-studio-accent transition-colors cursor-pointer text-zinc-600 hover:underline decoration-studio-accent decoration-2 underline-offset-4"
            >
              {t.navAbout}
            </button>
            <button 
              onClick={() => handleScrollToSection('how-it-works')} 
              className="hover:text-studio-accent transition-colors cursor-pointer text-zinc-600 hover:underline decoration-studio-accent decoration-2 underline-offset-4"
            >
              {t.navHow}
            </button>
          </nav>

          {/* Quick options and mode trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher in Header */}
            <div className="flex items-center gap-1 bg-zinc-200/60 border border-zinc-350/20 rounded-xl p-0.5 select-none shrink-0">
              <button
                onClick={() => handleLanguageChange('id')}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  language === 'id'
                    ? 'bg-[#E61C24] text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 bg-transparent'
                }`}
                title="Bahasa Indonesia"
              >
                🇮🇩 ID
              </button>
              <button
                onClick={() => handleLanguageChange('zh')}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  language === 'zh'
                    ? 'bg-[#E61C24] text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 bg-transparent'
                }`}
                title="中文 (Chinese)"
              >
                🇨🇳 华语
              </button>
            </div>

            <button
              onClick={() => setShowGuideModal(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 hover:text-studio-charcoal hover:bg-zinc-150/60 transition-colors flex items-center gap-1.5 border border-zinc-200"
            >
              <HelpCircle className="w-3.5 h-3.5 text-studio-accent" />
              <span className="hidden sm:inline">{t.navGuide}</span>
            </button>

            <div className="w-[1px] h-6 bg-zinc-250"></div>

            {/* Admin toggle switch */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (isAdminMode) {
                  setIsAdminMode(false);
                  addToast(language === 'zh' ? '返回访客模式' : 'Kembali ke Halaman Pelanggan NusaKirim', 'info');
                } else {
                  // Reset states and present password challenge modal
                  setAdminPasswordInput('');
                  setPasswordError('');
                  setShowPassword(false);
                  setShowAdminPasswordModal(true);
                }
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer border ${
                isAdminMode
                  ? 'bg-studio-terracotta text-white border-studio-terracotta shadow-md shadow-studio-terracotta/25'
                  : 'bg-studio-charcoal text-white hover:bg-studio-charcoal/90 border-studio-charcoal shadow-sm'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 ${isAdminMode ? 'animate-pulse' : ''}`} />
              <span>{isAdminMode ? (language === 'zh' ? '退出管理' : 'Keluar Admin') : `🔐 ${t.navAdmin}`}</span>
              
              {/* Counter status badge for unchecked submissions in header */}
              {!isAdminMode && submissions.filter(s => s.status === 'pending').length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-studio-terracotta text-[9px] text-white flex items-center justify-center font-mono font-bold animate-bounce">
                  {submissions.filter(s => s.status === 'pending').length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Horizontal scroll menu (Visible ONLY on small mobile devices to give intuitive access) */}
        {!isAdminMode && (
          <div className="flex md:hidden bg-zinc-100 border-t border-zinc-200/80 px-4 py-2 overflow-x-auto scrollbar-none gap-4 text-[11px] font-bold tracking-wide text-zinc-500 whitespace-nowrap">
            <button onClick={() => handleScrollToSection('hero-portal')} className="active:text-studio-accent">
              📍 {t.navHome}
            </button>
            <button onClick={() => handleScrollToSection('tentang-kami')} className="active:text-studio-accent">
              ℹ️ {t.navAbout}
            </button>
            <button onClick={() => handleScrollToSection('how-it-works')} className="active:text-studio-accent">
              💡 {t.navHow}
            </button>
            <button onClick={() => handleScrollToSection('logistics-faq')} className="active:text-studio-accent">
              ❓ {t.navFaq}
            </button>
          </div>
        )}
      </header>

      {/* MAIN LAYOUT GATEWAY: ADMIN VIEW VS CUSTOMER GATEWAY */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* ==================== A: ADMIN LIVE DASHBOARD PANEL ==================== */}
          {isAdminMode ? (
            <motion.section
              key="admin-workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              {/* Admin Head Summary Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-250/80 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-studio-charcoal" />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-[11px] font-mono font-bold mb-3">
                    <Shield className="w-3.5 h-3.5 text-studio-terracotta" />
                    <span>{t.adminCommandCenter}</span>
                  </div>
                  <h2 className="text-3xl font-display font-black text-studio-charcoal tracking-tight">
                    {t.adminTitle}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    {t.adminSubtitle}
                  </p>
                </div>

                {/* Submissions summary analytics inside dashboard */}
                <div className="flex gap-4 sm:gap-6 shrink-0 bg-studio-beige/60 p-4 rounded-2xl border border-zinc-200">
                  <div className="text-center">
                    <span className="block text-2xl font-display font-black text-studio-charcoal">{submissions.length}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{t.adminTotalLinks}</span>
                  </div>
                  <div className="w-[1px] bg-zinc-300"></div>
                  <div className="text-center">
                    <span className="block text-2xl font-display font-black text-orange-600">
                      {submissions.filter(s => s.status === 'pending').length}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{language === 'zh' ? '待处理' : 'Masuk'}</span>
                  </div>
                  <div className="w-[1px] bg-zinc-300"></div>
                  <div className="text-center">
                    <span className="block text-2xl font-display font-black text-emerald-600">
                      {submissions.filter(s => s.status === 'completed').length}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{language === 'zh' ? '已完成' : 'Selesai'}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Admin Alerts Config Panel */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50/50 rounded-2xl p-5 border border-emerald-250/50 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600 border border-emerald-200">
                    <span className="text-xl">⚙️</span>
                  </div>
                  <div className="text-left py-0.5">
                    <h4 className="font-display font-black text-sm text-emerald-950">
                      {t.adminWaConfigTitle}
                    </h4>
                    <p className="text-[11px] text-emerald-800 font-medium leading-relaxed max-w-xl">
                      {t.adminWaConfigDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 select-none">
                  <input
                    type="text"
                    placeholder="Contoh: 6282292305555"
                    value={adminWhatsAppNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAdminWhatsAppNumber(val);
                      try {
                        localStorage.setItem('nusakirim_admin_whatsapp', val);
                      } catch {}
                    }}
                    className="w-full sm:w-48 bg-white border border-emerald-250 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-900 focus:outline-emerald-500"
                  />
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-black px-2 py-1 rounded-lg shrink-0">
                    {t.adminWaConfigActive}
                  </span>
                </div>
              </div>

              {/* Filtering + Search Controls */}
              <div id="admin-controls" className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-xs mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search box input */}
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder={t.adminSearchPlaceholder}
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-250 text-sm focus:outline-none focus:ring-1 focus:ring-studio-charcoal"
                  />
                  {adminSearch && (
                    <button onClick={() => setAdminSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter status buttons */}
                <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
                  {(['all', 'pending', 'processing', 'completed', 'cancelled'] as const).map((filterOpt) => (
                    <button
                      key={filterOpt}
                      onClick={() => setAdminFilter(filterOpt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize tracking-wide transition-all border cursor-pointer ${
                        adminFilter === filterOpt
                          ? 'bg-studio-charcoal text-white border-studio-charcoal'
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-200'
                      }`}
                    >
                      {filterOpt === 'all' ? t.adminAllStatus : filterOpt === 'pending' ? t.adminTabPending : filterOpt === 'processing' ? t.adminTabProcessing : filterOpt === 'completed' ? t.adminTabCompleted : t.adminTabCancelled}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submissions List & Live Activity Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Submissions (Col span: 8) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Submissions List */}
                  {isLoading ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-zinc-200 shadow-xs">
                  <RefreshCw className="w-10 h-10 text-studio-accent mx-auto animate-spin mb-4" />
                  <p className="text-zinc-500 font-medium">{t.adminLoading}</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200">
                    <ShoppingBag className="w-8 h-8 text-zinc-400" />
                  </div>
                  <p className="text-zinc-850 font-display font-bold text-lg">{t.adminNoOrdersTitle}</p>
                  <p className="text-zinc-500 text-xs mt-2 px-6 max-w-md mx-auto leading-relaxed">
                    {t.adminNoOrdersDesc}
                  </p>
                  <button
                    onClick={() => { setAdminFilter('all'); setAdminSearch(''); }}
                    className="mt-5 px-5 py-2.5 bg-studio-charcoal text-white rounded-xl text-xs font-semibold hover:bg-zinc-805 transition-all text-center select-none"
                  >
                    {t.adminRefreshFilter}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredSubmissions.map((item) => {
                    const styling = getMarketplaceStyling(item.marketplace);
                    
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`bg-white rounded-3xl border p-6 shadow-xs relative overflow-hidden transition-all hover:shadow-md ${
                          item.status === 'pending'
                            ? 'ring-2 ring-studio-terracotta/20 border-studio-terracotta/40'
                            : 'border-zinc-200'
                        }`}
                      >
                        {/* Status bar colors based on node */}
                        <div className={`absolute top-0 right-0 left-0 h-1.5 ${
                          item.status === 'pending' ? 'bg-orange-500' : item.status === 'processing' ? 'bg-emerald-500' : item.status === 'completed' ? 'bg-zinc-800' : 'bg-red-400'
                        }`} />

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pt-2">
                          
                          {/* Left specs detail */}
                          <div className="space-y-3 flex-1">
                            
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Order ID Tag */}
                              <span className="text-[11px] font-mono bg-zinc-150 text-zinc-700 px-2 py-1 rounded-md font-bold">
                                ORDER #{item.id.replace('sub-', '')}
                              </span>

                              {/* Marketplace Type Pill */}
                              <span className={`text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded border ${styling.badgeColor}`}>
                                {styling.label}
                              </span>

                              {/* Timestamp */}
                              <span className="text-xs text-zinc-400 font-mono">
                                {new Date(item.createdAt).toLocaleString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>

                            {/* Client Identification */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 bg-zinc-50/70 p-4 rounded-xl border border-zinc-100">
                              <div>
                                <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{t.adminBuyerLabel}</span>
                                <span className="text-sm font-bold text-studio-charcoal block mt-0.5">{item.customerName}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{t.adminWaLabel}</span>
                                <a
                                  href={`https://wa.me/${item.customerPhone.replace(/\D/g, '').replace(/^0/, '62')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 mt-0.5"
                                >
                                  <span>{item.customerPhone}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                              {item.customerAddress && (
                                <div className="md:border-l md:pl-4 border-zinc-200">
                                  <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{t.adminAddressLabel}</span>
                                  <span className="text-xs font-bold text-zinc-700 block mt-0.5 leading-relaxed">{item.customerAddress}</span>
                                </div>
                              )}
                            </div>

                            {/* Product Paste Link Container */}
                            <div className="space-y-1">
                              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{t.adminLinkCustomer}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-zinc-100 text-zinc-600 px-3 py-2 rounded-xl truncate flex-1 block font-mono border border-zinc-150 relative">
                                  {item.productUrl}
                                </span>
                                
                                <button
                                  onClick={() => handleCopyText(item.productUrl, 'Link produk')}
                                  className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 rounded-xl transition-colors shrink-0"
                                  title="Copy URL"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>

                                <a
                                  href={item.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-studio-charcoal text-white hover:bg-studio-charcoal/90 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                                  title={language === 'zh' ? '打开商品链接' : 'Buka Link Produk'}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>

                            {/* Quantity and Custom notes */}
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-zinc-400 block font-mono">{t.adminQtyLabel}</span>
                                <p className="font-bold text-studio-charcoal text-sm mt-0.5">{item.quantity} Qty</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-zinc-400 block font-mono">{t.adminNotesLabel}</span>
                                <p className="text-zinc-600 mt-0.5 italic text-xs">{item.notes || t.adminNoNotes}</p>
                              </div>
                            </div>
                          </div>

                          {/* Right side interactions: status update, pricing inline state */}
                          <div className="flex flex-col justify-between gap-4 w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-zinc-200/80 pt-4 lg:pt-0 lg:pl-6">
                            
                            {/* Update Pricing estimate */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                                {t.adminCostLabel}
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={language === 'zh' ? '例如：Rp 250.000' : 'Contoh: Rp 250.000'}
                                  defaultValue={item.priceEstimate || ''}
                                  onBlur={(e) => handleUpdateStatus(item.id, '', e.target.value)}
                                  className="w-full text-xs px-3 py-2 border border-zinc-250 rounded-xl focus:outline-none focus:border-zinc-500 font-mono shadow-inner bg-zinc-50/50"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 pointer-events-none font-mono font-bold">
                                  {t.adminAutoSave}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-400">{t.adminCostNote}</p>
                            </div>

                            {/* Set Status Selection dropdown */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                                {t.adminChangeStatusLabel}
                              </label>
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-zinc-250 text-studio-charcoal font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-studio-charcoal bg-white"
                              >
                                <option value="pending">{t.adminStatusPendingOpt}</option>
                                <option value="processing">{t.adminStatusProcessingOpt}</option>
                                <option value="completed">{t.adminStatusCompletedOpt}</option>
                                <option value="cancelled">{t.adminStatusCancelledOpt}</option>
                              </select>
                            </div>

                            {/* Direct WhatsApp actions / Delete */}
                            <div className="flex gap-1.5 flex-wrap">
                              <button
                                onClick={() => {
                                  setAdminActiveChatId(item.id);
                                }}
                                className="flex-1 min-w-[70px] bg-studio-charcoal hover:bg-zinc-805 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                                title={language === 'zh' ? '通过 NusaKirim 在线客服与客户沟通' : 'Chat dengan Pelanggan via NusaKirim Live Chat'}
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-studio-accent shrink-0" />
                                <span>{t.adminChatLiveBtn}</span>
                              </button>

                              <a
                                href={getWhatsAppPingUrl(item)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[70px] bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Phone className="w-3.5 h-3.5 shrink-0" />
                                <span>{t.adminWaChatBtn}</span>
                              </a>

                              <button
                                onClick={() => handleDeleteSubmission(item.id)}
                                className="p-2.5 text-red-500 hover:text-white border border-red-200 hover:bg-red-500 rounded-xl transition-colors cursor-pointer shrink-0"
                                title={language === 'zh' ? '删除订单数据' : 'Hapus Data Pesanan'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
                </div>

                {/* Right Column: Live Activity Feed (Col span: 4) */}
                <div id="admin-activity-panels" className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden text-left p-5">
                    
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-150 mb-4 select-none">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <h4 className="font-display font-black text-xs text-zinc-800 tracking-tight uppercase flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-[#E61C24]" />
                          <span>{t.adminActivityTitle}</span>
                        </h4>
                      </div>
                      <span className="bg-zinc-100 text-zinc-650 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                        {activities.length} {t.adminActivityLogCount}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed select-none font-medium">
                      {t.adminActivityDesc}
                    </p>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      {activities.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50 select-none">
                          <span className="text-xl block mb-2">📡</span>
                          <p className="text-xs font-bold text-zinc-400">{t.adminNoActivity}</p>
                        </div>
                      ) : (
                        activities.map((act) => {
                          let cardBg = "bg-zinc-50/70 border-zinc-150";
                          let badgeBg = "bg-zinc-100 text-zinc-700 border-zinc-200";
                          let actIcon = "🎒";
                          let actTitle = language === 'zh' ? '活动' : 'Aktivitas';

                          if (act.type === 'register') {
                            cardBg = "bg-emerald-50/50 border-emerald-200/60";
                            badgeBg = "bg-emerald-100 text-emerald-800 border-emerald-200/40";
                            actIcon = "✨";
                            actTitle = language === 'zh' ? '新注册' : 'Daftar Baru';
                          } else if (act.type === 'enter') {
                            cardBg = "bg-sky-50/55 border-sky-200/60";
                            badgeBg = "bg-sky-100 text-sky-800 border-sky-200/40";
                            actIcon = "🟢";
                            actTitle = language === 'zh' ? '进入网站' : 'Masuk Web';
                          } else if (act.type === 'submit_order') {
                            cardBg = "bg-amber-50/50 border-amber-200/60";
                            badgeBg = "bg-amber-100 text-amber-800 border-amber-200/40";
                            actIcon = "🛍️";
                            actTitle = language === 'zh' ? '发送链接' : 'Kirim Link';
                          }

                          let formattedTime = "";
                          try {
                            if (act.createdAt) {
                              const d = new Date(act.createdAt);
                              formattedTime = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIT';
                            }
                          } catch {}

                          return (
                            <div 
                              key={act.id} 
                              className={`p-3.5 rounded-2xl border text-left text-xs transition-all relative overflow-hidden flex flex-col gap-2 ${cardBg} hover:-translate-y-[1px]`}
                            >
                              <div className="flex items-center justify-between gap-2 select-none">
                                <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeBg}`}>
                                  <span>{actIcon}</span>
                                  <span>{actTitle}</span>
                                </span>
                                <span className="text-[9px] font-mono text-zinc-400 font-extrabold">{formattedTime}</span>
                              </div>

                              <div>
                                <h5 className="font-extrabold text-zinc-800 leading-snug flex items-center gap-1.5 capitalize">
                                  <span>{act.customerName}</span>
                                  {act.type === 'register' && (
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100/50 px-1 rounded">{language === 'zh' ? '新' : 'BARU'}</span>
                                  )}
                                </h5>
                                <p className="text-[10px] font-sans text-zinc-500 font-semibold mt-0.5 leading-relaxed">
                                  {act.details === 'Membuka Website NusaKirim (Simulasi)' && language === 'zh'
                                    ? '打开 NusaKirim 网站（模拟）'
                                    : act.details === 'Membuka Halaman Utama' && language === 'zh'
                                    ? '打开主页'
                                    : act.details}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-dashed border-zinc-200/80 flex flex-col gap-1 text-[10px]">
                                <div className="flex items-center gap-2 text-zinc-500 font-mono font-bold">
                                  <span>📞 WA:</span>
                                  <span className="text-zinc-700">{act.customerPhone}</span>
                                </div>
                                {act.customerAddress && (
                                  <div className="text-zinc-400 italic font-semibold line-clamp-1 truncate" title={act.customerAddress}>
                                    📍 {language === 'zh' ? '收货地址' : 'Alamat'}: {act.customerAddress}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Simulation Actions */}
                    <div className="mt-4 pt-4 border-t border-zinc-150 flex gap-2 select-none">
                      <button 
                        onClick={() => {
                          fetchActivities();
                          addToast(language === 'zh' ? '📡 成功更新活动日志。' : '📡 Berhasil memperbarui log aktivitas.', 'info');
                        }}
                        className="flex-1 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 rounded-xl text-[10px] font-bold text-zinc-650 tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      >
                        <RefreshCw className="w-3 h-3 text-zinc-400" />
                        <span>{t.adminRefreshLogBtn}</span>
                      </button>
                      
                      <button 
                        onClick={async () => {
                          try {
                            const sampleNames = ["Andi Sofifi", "Kak Ros", "Hasan Ternate", "Siti Halmahera", "Mitra Mandiri", "Fahri", "Lia"];
                            const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
                            await fetch('/api/activities', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                type: 'enter',
                                customerName: `${randomName}`,
                                customerPhone: `0813${Math.floor(10000000 + Math.random() * 90000000)}`,
                                customerAddress: 'Rute Pelabuhan Bastiong, Ternate',
                                details: 'Membuka Website NusaKirim (Simulasi)'
                              })
                            });
                            fetchActivities();
                            addToast(language === 'zh' ? '🧪 模拟进入已触发！' : '🧪 Simulasi masuk dipicu!', 'success');
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="py-1.5 px-3 bg-zinc-50 hover:bg-[#E61C24]/5 hover:text-[#E61C24] border border-zinc-200 hover:border-red-200 rounded-xl text-[10px] font-bold text-zinc-500 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap"
                        title={language === 'zh' ? '模拟新访问通知' : 'Simulasikan Notifikasi Kunjungan Baru'}
                      >
                        <span>{t.adminSimulationBtn}</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* ADMIN CHAT SLIDE OVER SIDE-PANEL */}
              <AnimatePresence>
                {(() => {
                  const activeAdminChatSubmission = submissions.find(s => s.id === adminActiveChatId);
                  if (!adminActiveChatId || !activeAdminChatSubmission) return null;

                  return (
                    <>
                      {/* Background Dim Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAdminActiveChatId(null)}
                        className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
                      />

                      {/* Floating Panel Shell */}
                      <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-zinc-200 z-50 shadow-2xl flex flex-col font-sans"
                      >
                        {/* Header */}
                        <div className="p-5 border-b border-zinc-150 flex items-center justify-between bg-studio-charcoal text-white relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-studio-accent" />
                          <div className="pl-2">
                            <span className="text-[10px] font-mono tracking-widest text-zinc-300 block uppercase">CUSTOMER LIVE CHAT</span>
                            <h3 className="font-display font-black text-base truncate tracking-tight text-white block mt-0.5">
                              {activeAdminChatSubmission.customerName}
                            </h3>
                            <p className="text-[10px] font-mono text-studio-accent font-bold mt-0.5 tracking-wider">
                              PESANAN #{activeAdminChatSubmission.id.replace('sub-', '')} • {activeAdminChatSubmission.marketplace.toUpperCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => setAdminActiveChatId(null)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Product Details Mini Banner */}
                        <div className="bg-zinc-50 border-b border-zinc-150 p-4 text-xs text-zinc-650 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-zinc-800">
                            <ShoppingBag className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="font-semibold truncate">Link: {activeAdminChatSubmission.productUrl}</span>
                            <a
                              href={activeAdminChatSubmission.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-studio-accent hover:underline font-bold inline-flex items-center gap-0.5 shrink-0"
                            >
                              Buka <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                          {activeAdminChatSubmission.notes && (
                            <p className="italic text-[11px] text-zinc-500 bg-white border border-zinc-100 p-2 rounded-lg mt-0.5">
                              " {activeAdminChatSubmission.notes} "
                            </p>
                          )}
                        </div>

                        {/* Message Thread Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/55">
                          {isChatBoxLoading && chatMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-405 gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-zinc-300" />
                              <p className="text-xs">Memanggil pesan obrolan...</p>
                            </div>
                          ) : chatMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4 text-zinc-400 space-y-2">
                              <MessageSquare className="w-10 h-10 text-zinc-300 animate-pulse" />
                              <p className="text-xs font-bold text-zinc-700">Belum Ada Obrolan</p>
                              <p className="text-[11px] leading-relaxed max-w-xs">Hubungi pelanggan untuk koordinasi pengemasan barang, konfirmasi harga, atau ongkir jastip mereka.</p>
                            </div>
                          ) : (
                            chatMessages.map((msg, i) => {
                              const isAdmin = msg.sender === 'admin';
                              return (
                                <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                                    isAdmin 
                                      ? 'bg-studio-charcoal text-white rounded-br-none' 
                                      : 'bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-bl-none'
                                  }`}>
                                    <p className="font-sans whitespace-pre-wrap">{msg.message}</p>
                                    <span className={`block text-[9px] mt-1.5 text-right font-mono ${isAdmin ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                      {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Quick templates shortcut bar */}
                        <div className="px-4 py-2 bg-zinc-100 border-t border-zinc-200 flex gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setChatInputText('Halo Kak, orderan sedang kami belikan & proses ya.')}
                            className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-250 rounded-full text-zinc-600 transition-colors cursor-pointer font-medium"
                          >
                            🛒 Sedang dibelikan
                          </button>
                          <button
                            type="button"
                            onClick={() => setChatInputText(`Halo Kak, barang sudah dibelikan. Total checkout & estimasi biaya kargo Anda adalah: ${activeAdminChatSubmission.priceEstimate || 'Rp ...'}`)}
                            className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-250 rounded-full text-zinc-600 transition-colors cursor-pointer font-medium"
                          >
                            💳 Estimasi biaya
                          </button>
                          <button
                            type="button"
                            onClick={() => setChatInputText('Pembelian sukses! Paket sudah kami kemas ulang dengan aman & siap dikirim.')}
                            className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-250 rounded-full text-zinc-600 transition-colors cursor-pointer font-medium"
                          >
                            📦 Siap kirim
                          </button>
                        </div>

                        {/* Chat input footer form */}
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const text = chatInputText.trim();
                            if (!text) return;
                            setChatInputText('');
                            await handleSendChatMessage(activeAdminChatSubmission.id, 'admin', text);
                          }}
                          className="p-3 border-t border-zinc-200 flex gap-2 bg-white"
                        >
                          <input
                            type="text"
                            value={chatInputText}
                            onChange={(e) => setChatInputText(e.target.value)}
                            placeholder="Ketik pesan balasan..."
                            className="flex-1 bg-zinc-50 border border-zinc-250 focus:border-zinc-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-studio-charcoal focus:outline-none transition-all placeholder:text-zinc-405"
                          />
                          <button
                            type="submit"
                            className="p-2.5 bg-studio-charcoal hover:bg-zinc-805 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                          >
                            <Send className="w-4 h-4 text-studio-accent" />
                          </button>
                        </form>
                      </motion.div>
                    </>
                  );
                })()}
              </AnimatePresence>
            </motion.section>
          ) : !userProfile ? (
            
            // ==================== B1: MANDATORY CUSTOMER LOGIN GATEWAY ====================
            <motion.div
              key="customer-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-md mx-auto my-12 px-4 select-none"
            >
              <div id="customer-login-form-card" className="bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden relative text-left">
                {/* Visual red header */}
                <div className="bg-[#E61C24] text-white p-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-800/40 to-transparent skew-x-12 pointer-events-none" />
                  <div className="flex items-center gap-3.5 mb-2 relative z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      🚚
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg tracking-tight uppercase">
                        NusaKirim Express
                      </h3>
                      <p className="text-[10px] text-zinc-200 font-bold tracking-widest uppercase">
                        {language === 'zh' ? '德尔纳特 – 索菲菲 购物转运桥梁' : 'Jembatan Belanja Ternate – Sofifi'}
                      </p>
                    </div>
                  </div>
                  <div className="w-24 h-0.5 bg-[#ECC828] rounded-full my-3" />
                  <p className="text-xs text-white/90 leading-relaxed font-sans">
                    {t.loginGreeting}
                  </p>
                </div>

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    
                    const name = (e.currentTarget.elements.namedItem('loginName') as HTMLInputElement).value.trim();
                    const phone = (e.currentTarget.elements.namedItem('loginPhone') as HTMLInputElement).value.trim();
                    const address = (e.currentTarget.elements.namedItem('loginAddress') as HTMLTextAreaElement).value.trim();

                    if (!name || !phone || !address) {
                      addToast(language === 'zh' ? '请填写完整您的个人档案。' : 'Mohon lengkapi semua data profil Anda.', 'info');
                      return;
                    }

                    try {
                      const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, phone, address })
                      });

                      const result = await response.json();

                      if (!response.ok || !result.success) {
                        addToast(result.error || (language === 'zh' ? '档案注册失败' : 'Pendaftaran profil gagal.'), 'info');
                        return;
                      }

                      const profile = { name, phone, address };
                      localStorage.setItem('nusakirim_user_profile', JSON.stringify(profile));
                      
                      setUserProfile(profile);
                      setCustomerName(name);
                      setCustomerPhone(phone);
                      setCustomerAddress(address);
                      setRecentRegisteredUser(profile);

                      // Automatically fetch user's historical submissions from server to synchronize their orders list
                      try {
                        const historyResp = await fetch(`/api/submissions?phone=${encodeURIComponent(phone)}`);
                        const historyResult = await historyResp.json();
                        if (historyResult.success && Array.isArray(historyResult.data)) {
                          const fetchedIds = historyResult.data.map((item: any) => item.id);
                          setMySubmissions(prev => {
                            const merged = Array.from(new Set([...prev, ...fetchedIds]));
                            return merged;
                          });
                        }
                      } catch (historyErr) {
                        console.error("Gagal menyinkronkan riwayat pesanan dari server:", historyErr);
                      }

                      addToast(result.message || (language === 'zh' ? `欢迎回来，${name}！` : `Selamat Datang, ${name}! Profil berhasil disinkronkan.`), 'success');
                      
                      // Push registration report to the server for live admin notifications
                      logActivity('register', name, phone, address, 'Mendaftar Profil Baru di NusaKirim');
                    } catch (err: any) {
                      console.error("Gagal melakukan registrasi profil:", err);
                      addToast(language === 'zh' ? '同步个人档案失败，请重试。' : 'Gagal menghubungkan ke server untuk sinkronisasi profil.', 'info');
                    }
                  }}
                  className="p-6 space-y-5"
                >
                  {/* Language selection choice */}
                  <div className="space-y-1.5 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                    <label className="block text-[11px] uppercase tracking-wider font-extrabold text-zinc-600 flex items-center gap-1.5">
                      🌐 Pilih Bahasa / 选择语言
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleLanguageChange('id')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          language === 'id'
                            ? 'bg-red-50 border-red-500 text-red-600 shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="text-sm">🇮🇩</span>
                        <span>Bahasa Indonesia</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange('zh')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          language === 'zh'
                            ? 'bg-red-50 border-red-500 text-red-600 shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="text-sm">🇨🇳</span>
                        <span>中文 (Chinese)</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase tracking-wider font-extrabold text-zinc-650">
                      {t.nameLabel}
                    </label>
                    <div className="relative">
                      <input
                        name="loginName"
                        type="text"
                        required
                        placeholder={t.namePlaceholder}
                        className="w-full text-xs sm:text-sm pl-4 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white text-studio-charcoal focus:outline-none transition-all font-sans"
                      />
                    </div>
                    <p className="text-[9px] text-zinc-400">{t.nameTip}</p>
                  </div>

                  {/* 2. No WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase tracking-wider font-extrabold text-zinc-650">
                      {t.phoneLabel}
                    </label>
                    <div className="relative">
                      <input
                        name="loginPhone"
                        type="text"
                        required
                        placeholder={t.phonePlaceholder}
                        className="w-full text-xs sm:text-sm pl-4 pr-10 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white text-studio-charcoal focus:outline-none transition-all font-mono"
                      />
                      <div className="absolute right-3.5 top-3.5 text-zinc-400">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[9px] text-zinc-400">{t.phoneTip}</p>
                  </div>

                  {/* 3. Alamat pengiriman */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase tracking-wider font-extrabold text-zinc-650">
                      {t.addressLabel}
                    </label>
                    <textarea
                      name="loginAddress"
                      rows={3}
                      required
                      placeholder={t.addressPlaceholder}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white text-studio-charcoal focus:outline-none transition-all resize-none font-sans"
                    />
                    <p className="text-[9px] text-zinc-400">{t.addressTip}</p>
                  </div>

                  {/* CTA button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 bg-[#E61C24] hover:bg-red-700 active:scale-95 text-white rounded-xl font-bold font-display text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-150"
                  >
                    <span>{t.loginBtn}</span>
                  </motion.button>
                </form>

                {/* Secure footer block */}
                <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-150 flex items-center gap-3 text-[10px] text-zinc-500 font-semibold justify-center">
                  <span>🛡️</span>
                  <span>{t.loginFooter}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            
            // ==================== B: CUSTOMER LANDING PORTAL GATEWAY ====================
            <motion.div
              key="customer-workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
                      {/* ==================== AESTHETIC HIGH-CONTRAST APP WRAPPER: ALFAGIFT / MIDI KRIING inspired red header ==================== */}
              <div className="w-full bg-[#E61C24] text-white pt-5 pb-6 px-4 rounded-b-[2.5rem] shadow-xl relative z-30 font-sans select-none">
                <div className="max-w-5xl mx-auto space-y-4">
                  {/* Search and Navigation Icons top row */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Input search box mockup */}
                    <div 
                      onClick={() => {
                        setShowOrderForm(true);
                        setTimeout(() => {
                          const el = document.getElementById('order-form-anchor');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 150);
                        addToast("Silakan isi link produk jastip Anda pada formulir pemesanan!", "success");
                      }}
                      className="flex-1 bg-white rounded-2xl flex items-center px-4 py-2.5 text-zinc-400 border border-zinc-200 shadow-inner select-none max-w-xl cursor-pointer hover:bg-zinc-50 transition-colors"
                    >
                      <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                      <span className="text-xs font-semibold truncate flex-grow text-left">Mau belanja apa hari ini?</span>
                      <QrCode className="w-4.5 h-4.5 text-zinc-500 hover:text-zinc-800 transition-colors shrink-0" />
                    </div>

                    {/* Notification & Cart Badges */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button 
                        onClick={() => addToast("Belum ada notifikasi baru untuk Anda saat ini.", "info")}
                        className="relative p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer"
                      >
                        <Bell className="w-4.5 h-4.5 text-white" />
                        <span className="absolute -top-1 -right-1 bg-[#ECC828] text-zinc-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-red-650">
                          3
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          const el = document.getElementById('my-submissions-history');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            addToast("Menampilkan Pelacakan Status & Nota Belanja Anda!", "info");
                          } else {
                            addToast("Belum ada riwayat pesanan lokal disimpan di browser Anda.", "info");
                          }
                        }}
                        className="relative p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-4.5 h-4.5 text-white" />
                        {mySubmissions.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-zinc-950 text-[#ECC828] font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                            {mySubmissions.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Pengiriman dan Lokasi Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/10 text-xs">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 max-w-max">
                      <span className="text-sm">🚚</span>
                      <span>
                        <strong className="font-sans font-bold">Pengiriman dari: </strong>
                        <span className="underline">Toko NusaKirim Ternate (0.7 km)</span>
                      </span>
                    </div>

                    <div className="text-left space-y-0.5">
                      <span className="block text-[9px] uppercase font-bold text-white/60 tracking-wider">Tujuan Pengiriman :</span>
                      <p className="flex items-center gap-1 font-bold text-white leading-none">
                        <MapPin className="w-4 h-4 text-[#ECC828] shrink-0" />
                        <span className="truncate max-w-xs sm:max-w-md">Lokasi Kamu Saat Ini - Jl. Hijra, Galala, Ternate (Rute Kilat Sofifi)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================== A-POINTS COINS & VOUCHER DOCK CARD (ALFAGIFT STYLE) ==================== */}
              <div className="max-w-5xl mx-auto px-4 -mt-4 relative z-40 select-none">
                <div className="bg-white rounded-3xl border border-zinc-200/95 shadow-xl p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* 1. Profile / Greetings */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-red-50 text-[#E61C24] border border-red-200/40 rounded-2xl flex items-center justify-center text-base font-black italic">
                      NK
                    </div>
                    <div className="text-left font-sans">
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">PELANGGAN SETIA</p>
                      <h4 className="font-display font-black text-sm text-zinc-800 mt-0.5 max-w-[150px] sm:max-w-xs truncate" title={userProfile?.name}>
                        {userProfile ? userProfile.name : "Mitra NusaKirim"}
                      </h4>
                      {userProfile?.phone && (
                        <p className="text-[10px] text-zinc-500 font-mono font-semibold mt-0.5">WhatsApp: {userProfile.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Right side info & actions */}
                  <div className="flex flex-wrap items-center gap-3 font-sans">
                    {userProfile?.address && (
                      <div className="hidden md:block max-w-[280px] text-zinc-500 text-[11px] leading-tight text-left pr-4 border-r border-zinc-205">
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block leading-none mb-1">ALAMAT KIRIM:</span>
                        <span className="truncate block font-semibold text-zinc-700" title={userProfile.address}>{userProfile.address}</span>
                      </div>
                    )}
                    {userProfile && (
                      <button
                        onClick={handleLogout}
                        className="text-[10px] text-zinc-500 hover:text-[#E61C24] font-bold border border-zinc-200 hover:border-red-200 bg-zinc-50 hover:bg-red-50/50 px-3.5 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        title="Keluar / Ganti Akun"
                      >
                        🔄 Ganti Akun
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* ==================== CORE BRAND PROMOTION BANNER CAROUSEL (LITERAL VISUAL MATCH) ==================== */}
              <div className="max-w-5xl mx-auto px-4 pt-7 pb-2 relative z-10 select-none">
                <div className="w-full bg-[#0D2C54] text-white rounded-3xl overflow-hidden border-2 border-[#ECC828] relative shadow-lg min-h-[190px] flex flex-col justify-between">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-900/40 to-transparent skew-x-12 pointer-events-none" />
                  
                  <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10 text-left">
                    {/* Left: Beautiful NK Brand logo block */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2.5">
                      <div className="flex items-center gap-2 justify-center lg:justify-start bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <div className="flex flex-col gap-1 justify-center shrink-0 pr-1">
                          <div className="h-0.5 w-4 bg-[#ECC828] rounded-full"></div>
                          <div className="h-1 w-6 bg-white rounded-full"></div>
                          <div className="h-0.5 w-3 bg-[#ECC828] rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-3xl tracking-tighter text-[#ECC828] italic">
                            NK
                          </span>
                          <div className="bg-[#ECC828] text-zinc-950 text-[10px] font-display font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider italic">
                            EXPRESS
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-32 h-0.5 bg-[#ECC828] rounded-full opacity-70 mx-auto lg:mx-0" />
                      
                      <p className="font-display font-black text-[9px] sm:text-[10px] tracking-wide text-white uppercase leading-tight">
                        JEMBATAN BELANJA ONLINE <br/>
                        <span className="text-[#ECC828]">TERNATE – SOFIFI</span>
                      </p>
                    </div>

                    {/* Right Side: Ad details */}
                    <div className="lg:col-span-7 space-y-3 flex flex-col items-center lg:items-start w-full">
                      <div className="flex items-center gap-2 justify-center lg:justify-start">
                        <h2 className="font-display font-black text-base sm:text-lg tracking-tight text-white uppercase italic">
                          BELANJA ONLINE?
                        </h2>
                        <div className="bg-white/10 border border-white/25 rounded-xl px-2 py-0.5 flex items-center gap-1.5 text-[9px]">
                          <span>🛒</span>
                          <div className="flex gap-0.5">
                            <span className="w-3.5 h-3.5 bg-orange-500 rounded-full text-[7px] font-bold text-white flex items-center justify-center">S</span>
                            <span className="w-3.5 h-3.5 bg-emerald-600 rounded-full text-[7px] font-bold text-white flex items-center justify-center">T</span>
                            <span className="w-3.5 h-3.5 bg-black rounded-full text-[7px] font-bold text-white flex items-center justify-center">J</span>
                          </div>
                        </div>
                      </div>

                      {/* MAHAL banner card */}
                      <div className="bg-white text-zinc-900 px-5 py-2 rounded-2xl shadow-md border-2 border-red-600/35 w-full max-w-sm text-center lg:text-left transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                        <span className="text-[8px] uppercase tracking-wider font-mono text-zinc-400 font-bold block leading-none">
                          ONGKIR KE SOFIFI
                        </span>
                        <span className="font-display font-black text-lg sm:text-xl text-red-650 uppercase tracking-tight mt-0.5 block">
                          MAHAL?
                        </span>
                      </div>

                      {/* HEMAT Ribbons sticker */}
                      <div className="bg-[#ECC828] text-[#0D2C54] px-5 py-1.5 rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 justify-center transform rotate-1 hover:rotate-0 transition-transform">
                        <span>⚡ HEMAT HINGGA 50% ⚡</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand marketplace ticker bottom row */}
                  <div className="bg-blue-950/45 border-t border-white/5 py-2 px-5 flex flex-wrap items-center justify-between text-[8px] sm:text-[9px] text-zinc-300 font-bold gap-2">
                    <span>BELANJA DARI SEMUA MARKETPLACE:</span>
                    <div className="flex gap-2.5">
                      <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/25">Shopee</span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25">Tokopedia</span>
                      <span className="bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-white/10">TikTok Shop</span>
                      <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/25">Lazada</span>
                    </div>
                  </div>
                </div>

                {/* Dot Slider indicators */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <span className="w-3 h-1.5 rounded-full bg-red-600 transition-all"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                  <span className="text-[10px] text-zinc-400 font-bold ml-1 hover:underline cursor-pointer" onClick={() => addToast("Membuka 10 halaman promo terbaik NusaKirim!", "info")}> Lihat Semua (10)</span>
                </div>
              </div>

              {/* ==================== A-GRID SERVICES: SPESIAL DI MIDIKRIING / NUSAKIRIM COMPONENT ==================== */}
              <div className="max-w-5xl mx-auto px-4 py-6 font-sans select-none text-left relative z-25">
                <div className="flex items-center justify-between mb-4.5">
                  <h4 className="font-display font-black text-sm text-zinc-800 tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#E61C24] animate-pulse" />
                    <span>Spesial di NusaKirim Express</span>
                  </h4>
                  <span className="text-[10px] text-red-600 font-bold hover:underline cursor-pointer" onClick={() => handleScrollToSection('tentang-kami')}>Info Layanan</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Item 1: Jastip Order Form (Purple soft gradient) */}
                  <button
                    onClick={() => {
                      const el = document.getElementById('order-form-anchor');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      addToast("Silakan isi formulir pesanan belanja Anda di bawah ini!", "success");
                    }}
                    className={`relative p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/70 border border-purple-200/50 flex flex-col justify-between items-start text-left min-h-[120px] shadow-xs active:scale-98 hover:shadow-md hover:border-purple-300 transition-all select-none cursor-pointer group w-full`}
                  >
                    <span className="text-2xl sm:text-3xl group-hover:scale-115 transition-transform duration-300">🛍️</span>
                    <div>
                      <span className="block font-sans font-black text-[12px] sm:text-[13px] text-purple-950 uppercase tracking-tight">ENJOY SHOPPING</span>
                      <span className="block text-[9px] sm:text-[10px] text-purple-600/90 font-bold mt-1 leading-tight">Mulai Jastip Baru</span>
                    </div>
                  </button>

                  {/* Item 2: Lacak & Chat live CS (Cyan soft gradient) */}
                  <button
                    onClick={() => {
                      setSelectedChatId(null);
                      setIsOpenChatWidget(true);
                      addToast("Menghubungkan Anda ke Layanan Pelanggan Live CS...", "success");
                    }}
                    className="relative p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100/70 border border-cyan-200/50 flex flex-col justify-between items-start text-left min-h-[120px] shadow-xs active:scale-98 hover:shadow-md hover:border-cyan-300 transition-all select-none cursor-pointer group w-full"
                  >
                    <span className="text-2xl sm:text-3xl group-hover:scale-115 transition-transform duration-300">💬</span>
                    <div>
                      <span className="block font-sans font-black text-[12px] sm:text-[13px] text-cyan-950 uppercase tracking-tight">TAGIHAN & LAPOR</span>
                      <span className="block text-[9px] sm:text-[10px] text-cyan-600/90 font-bold mt-1 leading-tight">Chat Admin Live</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* Anchor block for smooth layout scroll target */}
              <div id="order-form-anchor" />

              {/* Order form block statically displayed directly under Special section */}
              <div className="overflow-hidden">
                {/* Hero Banner with the dynamic Link Paste Form Box */}
                <div className="border-t border-b border-zinc-200/80 bg-zinc-50/50 py-12">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                      
                      {/* Left: Value proposition */}
                      <div className="lg:col-span-5 space-y-6 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-studio-accent/15 border border-studio-accent/20">
                          <Truck className="w-4 h-4 text-studio-accent" />
                          <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-studio-charcoal">
                            JASA TITIP BELANJA & KARGO AMAN
                          </span>
                        </div>

                        <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-studio-charcoal leading-tight">
                          Formulir Jastip <br/>
                          <span className="text-studio-accent">NusaKirim Express</span>
                        </h2>

                        <div className="space-y-4 text-xs sm:text-sm text-zinc-600">
                          <p className="font-semibold text-zinc-850">
                            Mudahnya titip beli barang dari mana saja dengan 2 langkah sederhana:
                          </p>
                          <ol className="space-y-2.5 pl-1">
                            <li className="flex items-start gap-2.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00AA13]/10 text-[#00AA13] text-[10px] font-bold shrink-0 mt-0.5">1</span>
                              <span>Tempel link barang idaman Anda & isi formulir di samping.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00AA13]/10 text-[#00AA13] text-[10px] font-bold shrink-0 mt-0.5">2</span>
                              <span>Admin kami akan mengecek, merincikan harga total, dan membuatkan invoice pemesanan.</span>
                            </li>
                          </ol>

                          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-zinc-700 italic">
                            💡 <strong>Tips Lacak:</strong> Setelah tombol &quot;Kirim Pesanan&quot; diklik, tab chat pelacakan akan otomatis terbuka. Anda juga bebas mengobrol langsung dengan Admin di chat room tersebut.
                          </div>
                        </div>
                      </div>

                      {/* Right: Dynamic Interactive Form Box */}
                      <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl border border-zinc-250/90 shadow-2xl overflow-hidden relative">
                          
                          {/* Interactive Banner headers matching selection */}
                          <div className={`p-5 text-white transition-all duration-305 flex items-center justify-between ${marketingStyle.accentBg}`}>
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="w-5 h-5" />
                              <span className="font-display font-bold text-xs sm:text-sm tracking-wide">
                                FORMULIR PEMESANAN JASTIP & KARGO
                              </span>
                            </div>
                          </div>

                              {/* Interactive Tabs selector for marketplaces */}
                              <div className="grid grid-cols-4 border-b border-zinc-205 font-display text-center">
                                {(['shopee', 'tokopedia', 'tiktok', 'lainnya'] as const).map((plat) => (
                                  <button
                                    key={plat}
                                    onClick={() => setSelectedMarketplace(plat)}
                                    className={`py-3.5 text-xs font-bold border-b-2 hover:bg-zinc-50 transition-all uppercase cursor-pointer ${
                                      selectedMarketplace === plat
                                        ? plat === 'shopee'
                                          ? 'border-orange-500 text-orange-600 font-extrabold bg-orange-50/20'
                                          : plat === 'tokopedia'
                                          ? 'border-emerald-500 text-emerald-600 font-extrabold bg-emerald-50/20'
                                          : plat === 'tiktok'
                                          ? 'border-zinc-900 text-zinc-900 font-extrabold bg-zinc-50'
                                          : 'border-studio-accent text-amber-700 font-extrabold bg-amber-50/20'
                                        : 'border-transparent text-zinc-450'
                                    }`}
                                  >
                                    {plat === 'tiktok' ? 'TikTok' : plat}
                                  </button>
                                ))}
                              </div>

                              {/* Form elements */}
                              <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
                                
                                {/* 1. Shop Link product */}
                                <div className="space-y-1.5">
                                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-650 text-left">
                                    Tempel Link Produk {marketingStyle.label} *
                                  </label>
                                  <input
                                    id="product-link-input"
                                    type="url"
                                    required
                                    value={productUrl}
                                    onChange={(e) => setProductUrl(e.target.value)}
                                    placeholder={`Tempel URL ${selectedMarketplace}... (contoh: https://${selectedMarketplace === 'lainnya' ? 'situsbelanja' : selectedMarketplace}.co.id/product)`}
                                    className={`w-full text-xs sm:text-sm px-4 py-3 rounded-xl border bg-zinc-50/60 focus:bg-white text-studio-charcoal focus:outline-none transition-all font-mono placeholder:font-sans ${marketingStyle.borderColor}`}
                                  />
                                  <p className="text-[10px] text-zinc-400 text-left">Pastikan link produk masih aktif dan stok tersedia.</p>
                                </div>

                                {/* Dynamic User Profile Info (Pre-filled via Login Gate) */}
                                <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-left space-y-3 relative overflow-hidden">
                                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Profil Terisi</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-zinc-500 tracking-wider">
                                    <span>📋 Detail Penerima & Pengiriman</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Nama Lengkap</span>
                                      <span className="font-extrabold text-zinc-800">{customerName || userProfile?.name}</span>
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">No. WhatsApp</span>
                                      <span className="font-mono font-bold text-zinc-800">{customerPhone || userProfile?.phone}</span>
                                    </div>
                                  </div>

                                  <div className="pt-2.5 border-t border-zinc-200 text-xs">
                                    <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Alamat Pengiriman</span>
                                    <p className="font-semibold text-zinc-700 mt-0.5 leading-relaxed">{customerAddress || userProfile?.address}</p>
                                  </div>
                                </div>

                                {/* Qty Select Field */}
                                <div className="space-y-1.5 text-left">
                                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-650">
                                    Jumlah Barang (Qty) *
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    required
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-28 text-xs sm:text-sm px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white text-studio-charcoal focus:outline-none transition-all text-center font-mono font-bold"
                                  />
                                </div>

                          {/* 4. Notes Specifications */}
                          <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-650">
                              Catatan Spesifikasi (Warna / Ukuran / Bubble Wrap)
                            </label>
                            <textarea
                              rows={3}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Contoh: Tolong pilih warna Hitam cadangan Abu-abu, ukuran XL, minta bungkus kayu/extra bubble wrap agar aman."
                              className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white text-studio-charcoal focus:outline-none transition-all resize-none"
                            />
                          </div>

                          {/* Button trigger */}
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitPending}
                            className={`w-full py-3.5 rounded-xl font-bold font-display text-xs sm:text-sm tracking-wide text-white transition-all flex items-center justify-center gap-2 cursor-pointer ${marketingStyle.accentBg}`}
                          >
                            {submitPending ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Sedang Mengirim Data...</span>
                              </>
                            ) : (
                              <>
                                <Truck className="w-4 h-4" />
                                <span>Kirim Pengajuan Jasa Titip Beli</span>
                              </>
                            )}
                          </motion.button>
                        </form>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

              {/* Tentang Kami Section */}
              <section id="tentang-kami" className="py-20 bg-white border-b border-zinc-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#D91E1E_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Visual Brand Panel with Logo */}
                    <div className="lg:col-span-5 bg-studio-beige/30 p-8 rounded-3xl border border-zinc-250/70 shadow-sm flex flex-col items-center justify-center space-y-6 text-center relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-[#D91E1E]" />
                      <NusaKirimLogo size="xl" layout="vertical" />
                      
                      <div className="w-full h-[1px] bg-zinc-200" />
                      
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider">MITRA LOGISTIK UTAMA ANDA / 您的首选物流伙伴</p>
                        <p className="text-xs font-sans text-zinc-650 leading-relaxed font-normal">
                          {language === 'zh' ? (
                            "现代代购与货运服务，方便海外侨胞、留学生、外籍人士和海外买家直接从印尼最受欢迎的在线商店购买正品商品，无需为付款或地址烦恼。我们也接受从德尔纳特（Ternate）到索菲菲（Sofifi）的包裹运输服务。"
                          ) : (
                            "Layanan jastip modern yang memudahkan diaspora, pelajar, ekspatriat, dan pembeli mancanegara berbelanja barang orisinal langsung dari toko-toko online terpopuler Indonesia tanpa ribet urusan pembayaran maupun alamat. Kita juga menerima jasa pengiriman dari Ternate ke Sofifi."
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Copied Info Layout */}
                    <div className="lg:col-span-7 space-y-8">
                      <div>
                        <span className="text-[11px] font-mono tracking-widest font-bold text-[#D91E1E] uppercase">
                          TENTANG NUSAKIRIM EXPRESS
                        </span>
                        <h2 className="text-3xl font-display font-black text-studio-charcoal mt-1.5 tracking-tight leading-tight">
                          Jembatan Belanja & Kargo Terpercaya Anda
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2 font-normal leading-relaxed">
                          NusaKirim didirikan untuk memecahkan dilema belanja lintas batas. Kami menyediakan alamat transit lokal di Indonesia, mengabaikan ketatnya regulasi pembayaran bank lokal, dan mengirimkan paket dengan penanganan prioritas.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Point 1 */}
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200/60 flex items-center justify-center font-bold text-lg">
                            📦
                          </div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-studio-charcoal">
                            100% Pembelian Aman (Jastip)
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Kami mengurus seluruh proses pemesanan, pengecekan ketersediaan stok, hingga pelunasan ke merchant. Cukup tempel link belanja, tim kami yang membelikan untuk Anda.
                          </p>
                        </div>

                        {/* Point 2 */}
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200/60 flex items-center justify-center font-bold text-lg">
                            🛡️
                          </div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-studio-charcoal">
                            Konsolidasi & Re-Packing Gratis
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Belanja dari banyak toko berbeda? Kami satukan semua kiriman Anda di satu paket besar berbalut bubble wrap tebal secara gratis demi memangkas biaya ongkos kirim.
                          </p>
                        </div>

                        {/* Point 3 */}
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200/60 flex items-center justify-center font-bold text-lg">
                            🚀
                          </div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-studio-charcoal">
                            Kargo Kilat Berasuransi
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Kemitraan kargo udara eksklusif menjangkau Singapura, Malaysia, Taiwan, Hong Kong, dan rute domestik dengan perlindungan asuransi kehilangan barang hingga 100%.
                          </p>
                        </div>

                        {/* Point 4 */}
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200/60 flex items-center justify-center font-bold text-lg">
                            💬
                          </div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-studio-charcoal">
                            Update & Respon WhatsApp Instan
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Nikmati pelacakan transparan. Timbangan real, dokumentasi foto fisik sebelum dikirim, hingga update nomor resi pengiriman diteruskan langsung ke WhatsApp Anda.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* Step By Step Guide Panel */}
              <section id="how-it-works" className="py-16 bg-zinc-100 border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  {/* Catchy dynamic intro content requested by user */}
                  <div className="bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-xs mb-12 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-8 space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold tracking-widest uppercase">
                          ⚡ SOLUSI KIRIM LEBIH HEMAT
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-black text-studio-charcoal tracking-tight">
                          Cara Kerja NK Express
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-semibold">
                          NK Express membantu Anda menerima paket di Ternate dan mengirimkannya ke Sofifi. 
                          Ongkos kirim dari Ternate ke Sofifi biasanya <span className="line-through text-red-500">Rp80.000 per kg</span>. 
                          Dengan NK Express, cukup <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Rp30.000 per kg</span>.
                        </p>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Caranya sangat mudah: belanja online seperti biasa, isi alamat pengiriman dengan alamat gudang kami di Ternate, kirim screenshot bukti pesanan Anda ke WhatsApp admin, lalu santai dan ambil paket Anda di Sofifi ketika telah tiba!
                        </p>
                      </div>
                      
                      {/* Interactive visually appealing price card comparing the savings */}
                      <div className="lg:col-span-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 p-5 text-center select-none">
                        <div className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase mb-2">METODE BANDING ONGKIR / KG</div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-white border border-zinc-150 rounded-lg">
                            <span className="text-zinc-500">Ongkir Umum Biasa</span>
                            <span className="font-bold text-red-500 line-through font-mono">Rp 80.000</span>
                          </div>
                          <div className="flex items-center justify-between text-xs px-2.5 py-2 bg-[#E61C24]/5 border border-red-200 rounded-lg">
                            <span className="text-red-700 font-bold">Tarif Spesial NK Express</span>
                            <span className="font-extrabold text-[#E61C24] font-mono text-sm animate-pulse">Rp 30.000</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-zinc-500 font-medium mt-3 italic">
                          * Lebih hemat 60%+ untuk pengiriman Bastiong ke Halmahera / Sofifi!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3.3 Prosedur untuk Pelanggan */}
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-[10px] font-mono tracking-widest font-bold text-[#E61C24] uppercase">
                      PROSEDUR PELANGGAN (3.3)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-black text-studio-charcoal mt-1 tracking-tight">
                      4 Langkah Mudah Kirim & Beli
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                    
                    {/* Langkah 1 */}
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs relative flex flex-col justify-between min-h-[170px] hover:border-zinc-300 hover:shadow-md transition-all">
                      <div>
                        <span className="font-mono text-[9px] font-extrabold tracking-wider text-[#E61C24] uppercase bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          LANGKAH 1
                        </span>
                        <h4 className="font-display font-black text-sm text-studio-charcoal mt-3 mb-2">
                          Belanja seperti biasa
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                          Belanja di Shopee / Tokopedia / TikTok Shop / Lazada seperti biasanya Anda belanja online harian.
                        </p>
                      </div>
                      <span className="absolute bottom-4 right-4 text-2xl select-none opacity-50">🛍️</span>
                    </div>

                    {/* Langkah 2 */}
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs relative flex flex-col justify-between min-h-[170px] hover:border-zinc-300 hover:shadow-md transition-all">
                      <div>
                        <span className="font-mono text-[9px] font-extrabold tracking-wider text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          LANGKAH 2
                        </span>
                        <h4 className="font-display font-black text-sm text-studio-charcoal mt-3 mb-2">
                          Isi alamat gudang kami
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                          Gunakan alamat gudang kami di Ternate sebagai alamat pengiriman. Format nama penerima: <strong className="text-zinc-700 font-extrabold">NK-Nama Anda</strong>.
                        </p>
                      </div>
                      <span className="absolute bottom-4 right-4 text-2xl select-none opacity-50">📍</span>
                    </div>

                    {/* Langkah 3 */}
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs relative flex flex-col justify-between min-h-[170px] hover:border-zinc-300 hover:shadow-md transition-all">
                      <div>
                        <span className="font-mono text-[9px] font-extrabold tracking-wider text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          LANGKAH 3
                        </span>
                        <h4 className="font-display font-black text-sm text-studio-charcoal mt-3 mb-2">
                          Kirim bukti pesanan
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                          Selesaikan pembayaran belanja, lalu screenshot rincian pesanan dan kirim langsung ke WhatsApp kami.
                        </p>
                      </div>
                      <span className="absolute bottom-4 right-4 text-2xl select-none opacity-50">📲</span>
                    </div>

                    {/* Langkah 4 */}
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs relative flex flex-col justify-between min-h-[170px] hover:border-zinc-300 hover:shadow-md transition-all">
                      <div>
                        <span className="font-mono text-[9px] font-extrabold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          LANGKAH 4
                        </span>
                        <h4 className="font-display font-black text-sm text-studio-charcoal mt-3 mb-2">
                          Ambil paket di Sofifi
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                          Kami akan memantau kedatangan di Ternate, melalukan cross-shipping cepat, dan mengabari begitu paket tiba di Sofifi.
                        </p>
                      </div>
                      <span className="absolute bottom-4 right-4 text-2xl select-none opacity-50">🎁</span>
                    </div>

                  </div>
                </div>
              </section>

              {/* Logistics FAQ Section */}
              <section id="logistics-faq" className="py-20 bg-white border-t border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] font-mono tracking-widest font-bold text-studio-sage uppercase">
                      PERTANYAAN UMUM (FAQ)
                    </span>
                    <h2 className="text-3xl font-display font-black text-studio-charcoal mt-1 tracking-tight">
                      Butuh Informasi Tambahan?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {LOGISTICS_FAQ.map((faq, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-studio-beige/50 border border-zinc-200/80">
                        <h4 className="font-display font-bold text-base text-studio-charcoal mb-2 flex items-start gap-2">
                          <span className="text-studio-accent font-extrabold font-mono">Q:</span>
                          <span>{faq.q}</span>
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed pl-6">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              </section>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-studio-charcoal text-zinc-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-zinc-800 pb-8 mb-8">
            <div className="text-center md:text-left">
              <NusaKirimLogo size="sm" layout="horizontal" inverse={true} className="mb-2 justify-center md:justify-start" />
              <p className="text-xs text-zinc-500 mt-1">
                Jembatan Belanja Tercepat & Terpercaya antar Marketplace Indonesia.
              </p>
            </div>

            {/* Direct Links */}
            <div className="flex flex-wrap gap-6 text-xs font-semibold justify-center">
              <a href="#hero-portal" className="hover:text-white transition-colors">Tempel Link</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">Panduan</a>
              <a href="#logistics-faq" className="hover:text-white transition-colors">Pertanyaan</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-650 font-mono gap-4 text-center sm:text-left">
            <p>© 2026 NusaKirim Express. Hak Cipta Dilindungi Undang-Undang.</p>
            <p>Kalau ada kiriman dari Ternate ke Sofifi, silakan hubungi kami</p>
          </div>
        </div>
      </footer>

      {/* 5. FLOWING TOASTS PORTAL */}
      <FloatingToast toasts={toasts} removeToast={removeToast} />

      {/* 6. CARA KERJA GUIDE MODAL POPUP */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuideModal(false)}
              className="absolute inset-0 bg-studio-charcoal/40 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl max-w-lg w-full"
            >
              <button
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-studio-charcoal cursor-pointer text-sm font-bold w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                  <Truck className="w-5 h-5 text-studio-accent" />
                </div>
                
                <h3 className="font-display font-black text-2xl text-studio-charcoal tracking-tight">
                  Cara Kerja Jasa Titip Beli NusaKirim
                </h3>

                <div className="text-xs text-zinc-650 space-y-3.5 leading-relaxed font-sans">
                  <p>
                    NusaKirim dikembangkan khusus untuk mempermudah Anda melakukan checkout & kargo pengiriman dari platform belanja besar Indonesia sekalipun Anda berada di luar pulau / luar negeri.
                  </p>
                  <ol className="list-decimal list-inside space-y-2.5 text-zinc-600 font-semibold">
                    <li className="font-normal">
                      <strong className="text-studio-charcoal">Salin Tautan:</strong> Cari barang di Shopee, Tokopedia, atau TikTok. Salin alamat webnya.
                    </li>
                    <li className="font-normal">
                      <strong className="text-studio-charcoal">Tempel di Sini:</strong> Pilih tab marketplace yang sesuai di form, tempel link, isi Nama, no WhatsApp, Qty, & ketentuan ukuran/warna. Lalu kirimkan.
                    </li>
                    <li className="font-normal">
                      <strong className="text-studio-charcoal">Verifikasi Admin:</strong> Sistem kami akan meneruskan link tersebut secara real-time ke data admin. Admin segera merinci harga, berat kargo, serta ongkir ke lokasi Anda.
                    </li>
                    <li className="font-normal">
                      <strong className="text-studio-charcoal">Transaksi Terjamin:</strong> Anda akan dihubungi otomatis oleh admin di WhatsApp untuk rincian tagihan aman. Setelah dibayar, barang langsung dikirim dengan asuransi penuh!
                    </li>
                  </ol>
                </div>

                <button
                  onClick={() => setShowGuideModal(false)}
                  className="w-full mt-4 bg-studio-charcoal hover:bg-studio-charcoal/90 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm cursor-pointer hover:shadow-md"
                >
                  Mulai Tempel Link Sekarang!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* 7. ADMIN PASSWORD GATE MODAL */}
      <AnimatePresence>
        {showAdminPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminPasswordModal(false)}
              className="absolute inset-0 bg-studio-charcoal/40 backdrop-blur-sm cursor-pointer"
            />
 
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Highlight bar with accent colors */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-[#D91E1E]" />
 
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowAdminPasswordModal(false)}
                className="absolute top-4 right-4 text-zinc-450 hover:text-studio-charcoal cursor-pointer w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm transition-colors border border-zinc-200"
              >
                ✕
              </button>
 
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanPassword = adminPasswordInput.trim().toLowerCase();
                  if (cleanPassword === 'nusakirim123' || cleanPassword === 'adminnusakirim') {
                    setIsAdminMode(true);
                    setShowAdminPasswordModal(false);
                    setPasswordError('');
                    setAdminPasswordInput('');
                    addToast('Berhasil masuk ke Mode Admin NusaKirim!', 'success');
                  } else {
                    setPasswordError('Kata sandi salah! Silakan coba lagi.');
                    addToast('Gagal otorisasi: Kata sandi salah', 'info');
                  }
                }}
                className="space-y-5 text-left mt-2"
              >
                {/* Emblem header */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[#D91E1E] shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-studio-charcoal tracking-tight">
                      Otorisasi Admin Kargo
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-wide">NusaKirim Logistics Verification</p>
                  </div>
                </div>
 
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    Halaman ini dibatasi hanya untuk staff operasional & Admin kargo NusaKirim. Silakan masukkan kata sandi akses Anda.
                  </p>
                </div>
 
                {/* Input Container */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-650">
                    Kata Sandi Admin *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="Masukkan kata sandi..."
                      className="w-full text-xs sm:text-sm pl-4 pr-10 py-3 rounded-xl border border-zinc-250 bg-zinc-50/60 focus:bg-white text-studio-charcoal focus:outline-none transition-all font-mono"
                    />
                    
                    {/* View password visibility switch */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
 
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1.5"
                    >
                      <span>⚠️ {passwordError}</span>
                    </motion.p>
                  )}
                </div>
 
                {/* Confirm Sign-In Button */}
                <button
                  type="submit"
                  className="w-full bg-studio-charcoal hover:bg-studio-charcoal/90 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm cursor-pointer tracking-wider hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-studio-accent" />
                  <span>VERIFIKASI & MASUK PANEL</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* ==================== C: CLIENT LIVE TRACKING & CHAT FLOATING WIDGET ==================== */}
      {!isOpenChatWidget && !isAdminMode && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            setIsOpenChatWidget(true);
            if (mySubmissions.length > 0 && !selectedChatId) {
              // Auto-focus the last submitted order if they have any saved
              setSelectedChatId(mySubmissions[mySubmissions.length - 1]);
            }
          }}
          className="fixed bottom-6 right-6 z-50 bg-[#D91E1E] text-white p-4 rounded-full shadow-2xl hover:bg-[#b01616] transition-all flex items-center gap-2 cursor-pointer border border-[#ff4d4d]/30 group select-none"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 animate-none" />
            {mySubmissions.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-amber-405 text-studio-charcoal text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#D91E1E]">
                {mySubmissions.length}
              </span>
            )}
          </div>
          <span className="max-w-px overflow-hidden group-hover:max-w-[120px] transition-all duration-300 ease-out text-xs font-bold font-sans uppercase tracking-wider whitespace-nowrap hidden sm:inline-block">
            Lacak & Chat
          </span>
        </motion.button>
      )}

      {/* CLIENT LIVE TRACKING & CHAT PANEL */}
      <AnimatePresence>
        {isOpenChatWidget && !isAdminMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed bottom-6 right-1 sm:right-6 w-[95vw] sm:w-[380px] h-[520px] bg-white rounded-3xl border border-zinc-200 shadow-2xl z-50 overflow-hidden flex flex-col font-sans"
          >
            {/* Head */}
            <div className="bg-[#D91E1E] p-4 text-white flex items-center justify-between relative shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <MessageCircle className="w-5 h-5 text-amber-305" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-black text-sm tracking-tight text-white leading-tight">
                    NusaKirim Chat & Lacak
                  </h3>
                  <p className="text-[9px] text-white/75 font-mono tracking-wider">Logistics Customer Portal</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpenChatWidget(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY GATEWAY: CHAT WORKSPACE vs TRACKING LIST */}
            {selectedChatId ? (
              /* ================= MULTI-ORDER CHAT SCREEN ================= */
              (() => {
                const activeItem = submissions.find(s => s.id === selectedChatId);
                if (!activeItem) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 gap-2">
                      <AlertCircle className="w-8 h-8 text-zinc-300 animate-pulse" />
                      <p className="text-xs font-semibold">Pesanan tidak ditemukan</p>
                      <p className="text-[10px] leading-relaxed max-w-[200px]">Data pesanan #{selectedChatId.replace('sub-', '')} belum sinkron ke server.</p>
                      <button
                        onClick={() => setSelectedChatId(null)}
                        className="mt-2 text-xs text-[#D91E1E] font-bold underline cursor-pointer"
                      >
                        Kembali ke Daftar
                      </button>
                    </div>
                  );
                }

                const statusColor = activeItem.status === 'pending' ? 'text-orange-500 bg-orange-50 border-orange-150' : activeItem.status === 'processing' ? 'text-emerald-600 bg-emerald-50 border-emerald-150' : activeItem.status === 'completed' ? 'text-zinc-600 bg-zinc-50 border-zinc-150' : 'text-red-500 bg-red-50 border-red-150';
                const statusText = activeItem.status === 'pending' ? '🆕 Masuk' : activeItem.status === 'processing' ? '⚙️ Diproses' : activeItem.status === 'completed' ? '✅ Selesai' : '❌ Batal';

                return (
                  <div className="flex-1 flex flex-col min-h-0 bg-zinc-50/50">
                    
                    {/* Back & Status Header */}
                    <div className="px-3.5 py-2 bg-white border-b border-zinc-150 flex items-center justify-between gap-1 text-xs shrink-0 select-none">
                      <button
                        onClick={() => setSelectedChatId(null)}
                        className="flex items-center gap-1 text-zinc-500 hover:text-[#D91E1E] transition-colors font-bold cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 shrink-0" />
                        <span>Kembali</span>
                      </button>

                      {/* Tracker Indicator */}
                      <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusColor}`}>
                        {statusText}
                      </div>
                    </div>

                    {/* Product URL scroll indicator bar inside client chat */}
                    <div className="bg-zinc-100/90 px-4 py-1.5 border-b border-zinc-200 text-[10px] text-zinc-500 flex items-center justify-between gap-2 shrink-0 select-none">
                      <span className="truncate flex-1 text-left font-mono text-[9px] block">
                        <strong>Pesanan:</strong> #{activeItem.id.replace('sub-', '')} • {activeItem.productUrl}
                      </span>
                      {activeItem.priceEstimate && (
                        <span className="shrink-0 bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded font-mono">
                          {activeItem.priceEstimate}
                        </span>
                      )}
                    </div>

                    {/* Chat Thread Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {isChatBoxLoading && chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-[#D91E1E]" />
                          <p className="text-[10px]">Memuat percakapan...</p>
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-6 px-4 text-zinc-400 space-y-2">
                          <MessageSquare className="w-8 h-8 text-zinc-300 animate-pulse" />
                          <p className="text-xs font-bold text-zinc-700 font-display">Obrolan Dimulai</p>
                          <p className="text-[11px] leading-relaxed max-w-xs text-zinc-500">Tanyakan progres pembelian, ubah jumlah pesanan, atau koordinasi biaya pengiriman bersama kami di sini.</p>
                        </div>
                      ) : (
                        chatMessages.map((msg, i) => {
                          const isClient = msg.sender === 'customer';
                          return (
                            <div key={i} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-none leading-relaxed ${
                                isClient 
                                  ? 'bg-[#D91E1E] text-white rounded-br-none' 
                                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                              }`}>
                                <p className="font-sans whitespace-pre-wrap text-left">{msg.message}</p>
                                <span className={`block text-[9px] mt-1 text-right font-mono ${isClient ? 'text-red-200' : 'text-zinc-400'}`}>
                                  {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Suggestion Prompts for client */}
                    <div className="px-3 py-1.5 bg-zinc-100 border-t border-zinc-200 flex gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap shrink-0">
                      <button
                        type="button"
                        onClick={() => setChatInputText('Halo admin, apakah pesanan kargo jastip saya sudah diproses?')}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full text-zinc-650 transition-colors cursor-pointer"
                      >
                        ❓ Apakah sudah diproses?
                      </button>
                      <button
                        type="button"
                        onClick={() => setChatInputText('Tolong tambahkan bubble wrap tebal ya min supaya aman.')}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full text-zinc-650 transition-colors cursor-pointer"
                      >
                        🧼 Mohon bubble wrap ekstra
                      </button>
                      <button
                        type="button"
                        onClick={() => setChatInputText('Sudah saya bayarkan ya min. Terima kasih!')}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full text-zinc-650 transition-colors cursor-pointer"
                      >
                        🙏 Sudah dibayar
                      </button>
                    </div>

                    {/* Input section inside Client chat */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const text = chatInputText.trim();
                        if (!text) return;
                        setChatInputText('');
                        await handleSendChatMessage(activeItem.id, 'customer', text);
                      }}
                      className="p-3 border-t border-zinc-150 flex gap-2 bg-white shrink-0"
                    >
                      <input
                        type="text"
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        placeholder="Ketik pesan kepada admin..."
                        className="flex-1 bg-zinc-50 border border-zinc-250 focus:border-[#D91E1E]/40 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-studio-charcoal focus:outline-none transition-all placeholder:text-zinc-404"
                      />
                      <button
                        type="submit"
                        className="p-2.5 bg-[#D91E1E] hover:bg-[#b01616] text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </form>

                  </div>
                );
              })()
            ) : (
              /* ================= LIST OF SAVED SUBMISSIONS ================= */
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                
                {/* Searching Order code manually */}
                <div className="p-4 bg-zinc-50 border-b border-zinc-150 shrink-0 text-left">
                  <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">
                    🔎 Hubungkan Kode Pesanan Lain
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: sub-1234..."
                      value={customerTrackInput}
                      onChange={(e) => setCustomerTrackInput(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-250 bg-white font-mono placeholder:font-sans uppercase text-studio-charcoal focus:outline-none focus:border-[#D91E1E]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const queryId = customerTrackInput.trim().toLowerCase();
                        if (!queryId) return;
                        const targetId = queryId.startsWith('sub-') ? queryId : `sub-${queryId}`;
                        
                        // Check if this exists on the global submissions list
                        const matchedItem = submissions.find(item => item.id === targetId);
                        if (matchedItem) {
                          setSelectedChatId(targetId);
                          setCustomerTrackInput('');
                          // Add to browser localStorage tracking list
                          setMySubmissions(prev => prev.includes(targetId) ? prev : [...prev, targetId]);
                          addToast(`Pesanan #${targetId.replace('sub-', '')} berhasil terhubung!`, 'success');
                        } else {
                          addToast(`Kode pesanan #${queryId.replace('sub-', '')} tidak ditemukan di server`, 'info');
                        }
                      }}
                      className="bg-studio-charcoal hover:bg-zinc-850 text-white px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center select-none cursor-pointer shrink-0"
                    >
                      Lacak
                    </button>
                  </div>
                </div>

                {/* Submissions items stream list */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-zinc-50/20 text-left">
                  <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-bold">
                    📋 DAFTAR PESANAN SAYA ({mySubmissions.length})
                  </p>

                  {mySubmissions.length === 0 ? (
                    <div className="text-center py-14 px-4 space-y-3">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-350 border border-zinc-205">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-black text-zinc-700">Belum Ada Riwayat Pesanan</p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                        Setelah Anda menempelkan link dan mengajukan pesanan baru di halaman depan, riwayat pesanan & ruang obrolan Anda dengan admin akan otomatis terdaftar di sini!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mySubmissions.map((savedId) => {
                        const item = submissions.find(s => s.id === savedId);
                        if (!item) return null;

                        const statusColor = item.status === 'pending' ? 'text-orange-500 bg-orange-50 border-orange-100' : item.status === 'processing' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : item.status === 'completed' ? 'text-zinc-650 bg-zinc-50 border-zinc-150' : 'text-red-500 bg-red-50 border-red-100';
                        const statusText = item.status === 'pending' ? 'Masuk' : item.status === 'processing' ? 'Diproses' : item.status === 'completed' ? 'Selesai' : 'Batal';

                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedChatId(item.id)}
                            className="p-3 bg-white border border-zinc-200 rounded-2xl cursor-pointer hover:border-[#D91E1E]/40 hover:shadow-xs transition-all flex items-center justify-between gap-3 relative overflow-hidden group select-none"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-200 group-hover:bg-[#D91E1E] transition-all" />
                            <div className="space-y-0.5 truncate pl-1 flex-1">
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500 leading-none">
                                <span className="font-mono text-[10px] font-bold text-studio-charcoal">#{item.id.replace('sub-', '')}</span>
                                <span className="text-[9px] uppercase tracking-wide bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500 font-extrabold">{item.marketplace}</span>
                              </div>
                              <p className="text-[11px] font-semibold text-zinc-700 truncate mt-1">
                                {item.productUrl}
                              </p>
                            </div>

                            {/* Right info actions */}
                            <div className="flex items-center gap-1.5 shrink-0 text-right">
                              <div className="space-y-0.5">
                                <span className={`block text-[8px] font-bold px-1.5 py-0.5 rounded border text-center ${statusColor}`}>
                                  {statusText}
                                </span>
                                {item.priceEstimate ? (
                                  <span className="block text-[9px] font-mono font-extrabold text-emerald-600">
                                    {item.priceEstimate}
                                  </span>
                                ) : (
                                  <span className="block text-[8px] text-zinc-450 font-mono italic">
                                    Dihitung...
                                  </span>
                                )}
                              </div>

                              <ChevronRight className="w-4 h-4 text-zinc-405 group-hover:text-[#D91E1E] transition-colors shrink-0" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-zinc-50 border-t border-zinc-150 text-center text-[10px] text-zinc-400 shrink-0">
                  <span>NusaKirim Cargo & Jastip • Respon & Pelayanan Cepat</span>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
