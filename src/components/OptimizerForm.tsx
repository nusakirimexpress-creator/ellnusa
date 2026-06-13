import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link2, Sparkles, AlertCircle, Coins, ArrowRight, ShieldCheck, MapPin, Phone, User, CheckCircle2, ShoppingCart } from 'lucide-react';
import { OptimizationResult } from '../types';

interface OptimizerFormProps {
  initialLink?: string;
  userProfile: {
    name: string;
    phone: string;
    address: string;
  };
  onOrderCreated: () => void;
  openProfileModal: () => void;
}

const SAMPLE_LINKS = [
  { label: "Baju Oversize", url: "https://shopee.co.id/Kaos-Oversize-Premium-Comfort-Combed-i.389271.89201" },
  { label: "TWS Earbuds", url: "https://shopee.co.id/TWS-Bluetooth-Wireless-Bass-Pro-i.892718.78912" },
  { label: "Termos Botol", url: "https://shopee.co.id/Hydration-Termos-Stainless-Steel-1L-i.12879.17290" }
];

export default function OptimizerForm({
  initialLink = '',
  userProfile,
  onOrderCreated,
  openProfileModal
}: OptimizerFormProps) {
  const [shopeeLink, setShopeeLink] = React.useState(initialLink);
  const [notes, setNotes] = React.useState('');
  const [optimizing, setOptimizing] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [result, setResult] = React.useState<OptimizationResult | null>(null);

  // checkout form state
  const [selectedVariant, setSelectedVariant] = React.useState('');
  const [checkoutNotes, setCheckoutNotes] = React.useState('');
  const [shippingName, setShippingName] = React.useState(userProfile.name);
  const [shippingPhone, setShippingPhone] = React.useState(userProfile.phone);
  const [shippingAddress, setShippingAddress] = React.useState(userProfile.address);
  const [submitting, setSubmitting] = React.useState(false);
  const [successOrder, setSuccessOrder] = React.useState<any | null>(null);

  // Sync profile edits when user updates it from the header
  React.useEffect(() => {
    if (userProfile) {
      setShippingName(userProfile.name);
      setShippingPhone(userProfile.phone);
      setShippingAddress(userProfile.address);
    }
  }, [userProfile]);

  React.useEffect(() => {
    if (initialLink) {
      setShopeeLink(initialLink);
    }
  }, [initialLink]);

  const LOADING_STEPS = [
    "Menghubungkan ke API Shopee Link Parser...",
    "Memindai daftar diskon Shopee Video aktif (Diskon up to 40%)...",
    "Mengecek rotasi live-streamer untuk mengamankan diskon Live 50%...",
    "Meracik kombinasi Koin Shopee Cashback maksimal...",
    "Mengurangi gratis ongkir XTRA kargo...",
    "Finalisasi rincian checkout di akun VIP Jastip kami..."
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (optimizing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [optimizing]);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopeeLink.trim()) {
      setErrorMsg("Mohon paste link barang Shopee terlebih dahulu.");
      return;
    }

    setOptimizing(true);
    setLoadingStep(0);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch('/api/optimize-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopeeLink, notes })
      });

      if (!res.ok) {
        throw new Error("Gagal mengurai optimasi produk");
      }

      const data: OptimizationResult = await res.json();
      setResult(data);
      if (data.variantOptions && data.variantOptions.length > 0) {
        setSelectedVariant(data.variantOptions[0]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Sistem optimasi kami sedang sibuk atau URL salah format. Sila coba beberapa saat lagi.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    
    if (!shippingName || !shippingPhone || !shippingAddress) {
      setErrorMsg("Mohon isi info penerima lengkap di profil atau form pengiriman.");
      // Auto open profile modal
      openProfileModal();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-default-vip', // local guest id
          customerName: shippingName,
          customerPhone: shippingPhone,
          customerAddress: shippingAddress,
          productUrl: shopeeLink,
          productName: result.productName,
          productVariant: selectedVariant,
          originalPrice: result.originalPrice,
          checkoutPrice: result.optimizedPrice,
          jastipFee: result.jastipFee,
          totalPayment: result.totalPayment,
          notes: checkoutNotes || notes,
          recipientName: shippingName,
          voucherScenarios: result.vouchersApplied
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal membuat order Jastip");
      }

      const orderData = await res.json();
      setSuccessOrder(orderData);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses order");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShopeeLink('');
    setNotes('');
    setResult(null);
    setSuccessOrder(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Introduction Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 text-rose-600">
          <div className="bg-rose-100 p-2.5 rounded-2xl">
            <Sparkles className="font-bold w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">NusaKirim VIP Jastip Optimizer</h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Punya barang bagus di keranjang Shopee kakak tapi harganya kemahalan? Cukup copy-paste link produknya di bawah, lalu lihat bagaimana algoritma logistik NusaKirim menumpuk berbagai diskon voucher ganda dan memaksimalkan potongan harga checkout lewat akun pembeli emas VIP kami!
        </p>

        {/* Form Input Link */}
        {!result && !successOrder && (
          <form onSubmit={handleOptimize} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Paste Link Shopee (Atau Nama Produk)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Link2 className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  value={shopeeLink}
                  onChange={(e) => setShopeeLink(e.target.value)}
                  placeholder="https://shopee.co.id/nama-produk-i.1234.5678"
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Catatan / Varian Khusus (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Warna Hitam pekat, ukuran XXL, packing kayu..."
                className="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white text-gray-700"
              />
            </div>

            {/* Quick Sample Links helper */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-gray-400">Contoh link cepat:</span>
              {SAMPLE_LINKS.map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setShopeeLink(item.url)}
                  className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border border-gray-100 rounded-lg text-[11px] text-gray-500 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-xl border border-red-100 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={optimizing}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-2xl transition shadow-lg shadow-rose-100 flex items-center justify-center space-x-2 cursor-pointer"
              id="btn-mulai-optimasi"
            >
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              <span>{optimizing ? "Menganalisis Link..." : "Mulai Optimasi AI"}</span>
            </button>
          </form>
        )}
      </div>

      {/* Optimizing Futuristic Loading State */}
      <AnimatePresence>
        {optimizing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 text-center space-y-6 shadow-md"
          >
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin"></div>
              <div className="absolute inset-2 bg-rose-50 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-600 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-base">Sedang Berhitung Hemat</h3>
              <p className="text-xs text-rose-600 font-medium font-mono min-h-6 animate-pulse">
                {LOADING_STEPS[loadingStep]}
              </p>
              <div className="w-48 bg-gray-100 h-1 rounded-full mx-auto overflow-hidden">
                <div
                  className="bg-rose-600 h-1 transition-all duration-1000"
                  style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-normal max-w-xs mx-auto">
              Algoritma AI sedang berkolaborasi dengan server kami untuk meng-kueri ribuan rotasi kupon promo VIP di platform Shopee.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Order Screens */}
      {successOrder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 text-center max-w-md mx-auto space-y-6 shadow-xl"
        >
          <div className="font-mono text-left bg-gray-50 p-6 rounded-2xl border border-gray-150 text-gray-800 space-y-4 text-sm whitespace-pre-line leading-relaxed">
            <div>
              <span className="font-bold text-gray-500">ID:</span> {successOrder.id}
            </div>
            <div className="font-bold text-rose-600 tracking-wider">
              {successOrder.status}
            </div>
            <div className="font-medium text-gray-900 border-t border-gray-200/60 pt-3">
              {successOrder.productName}
            </div>
            <div className="text-gray-600">
              <span className="font-bold text-gray-500">Konsumen:</span> {successOrder.recipientName || successOrder.customerName}
            </div>
            
            <div className="border-t border-gray-200/60 pt-4 mt-2">
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                Total Tagihan
              </div>
              <div className="font-sans font-black text-2xl text-rose-600">
                Rp{successOrder.totalPayment.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={resetForm}
              className="px-5 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs hover:bg-gray-50 transition cursor-pointer"
            >
              Order Barang Lain
            </button>
            <button
              onClick={onOrderCreated}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-100 cursor-pointer"
            >
              Kembali Ke Pesanan & Bayar
            </button>
          </div>
        </motion.div>
      )}

      {/* Optimization Result Analysis & Checkout Panel */}
      {result && !successOrder && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-md space-y-6"
        >
          {/* Cover Header */}
          <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-6 text-white relative">
            <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold leading-none">
              Optimal AI Checked!
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={result.imageUrl}
                alt={result.productName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover bg-white border border-white/20 shrink-0 shadow-lg"
              />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-rose-450 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md">
                  Deteksi Sukses
                </span>
                <h3 className="font-sans font-bold text-lg sm:text-xl tracking-tight leading-tight line-clamp-1">
                  {result.productName}
                </h3>
                <p className="text-xs text-gray-300 leading-normal line-clamp-1 max-w-md">
                  Sumber URL: <span className="font-mono text-[10px] underline">{shopeeLink}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Savings Pricing Section (Bento layout style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Harga Ritel Shopee</p>
                <p className="text-lg font-bold text-gray-500 line-through mt-1">
                  Rp{result.originalPrice.toLocaleString('id-ID')}
                </p>
                <span className="text-[9px] text-gray-400 block mt-1">Normal tanpa optimasi kupon</span>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 font-bold font-mono text-5xl">OFF</div>
                <p className="text-[10px] text-rose-600 uppercase tracking-widest font-bold">Harga Jastip Hemat</p>
                <p className="text-2xl font-black text-rose-600 mt-1">
                  Rp{result.optimizedPrice.toLocaleString('id-ID')}
                </p>
                <span className="text-[9px] text-rose-500 font-medium block mt-1">Setelah kupon terpasang ganda</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <p className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold">Total Hemat Kakak</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  Rp{result.savings.toLocaleString('id-ID')}
                </p>
                <span className="text-[9px] text-emerald-600 font-semibold block mt-1">Potongan sebesar {Math.round((result.savings/result.originalPrice)*100)}%!</span>
              </div>
            </div>

            {/* Calculations and Explanations */}
            <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-150 space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5">
                  Tumpukan Voucher yang Diterapkan oleh AI:
                </h4>
                <div className="space-y-2">
                  {result.vouchersApplied.map((voucher, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-100 text-xs">
                      <div>
                        <span className="font-bold text-gray-800 block">{voucher.name}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block leading-normal">{voucher.description}</span>
                      </div>
                      <span className="font-mono font-bold text-rose-600 shrink-0 ml-3 bg-rose-100/50 px-2 py-0.5 rounded-lg text-[11px]">
                        -Rp{voucher.savingAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-200"></div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Coins className="w-4 h-4 text-rose-600" />
                  <span>Bagaimana Cara Kami Menurunkan Harga Ini?</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {result.savingsExplanation}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* Billing & Jastip details & final ordering */}
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <h3 className="text-base font-bold text-gray-900 tracking-tight pb-1">Format Pesanan Jastip Hemat</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Variant Options */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Pilih Varian Produk
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-xs bg-white"
                    required
                  >
                    {result.variantOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional notes for checkout */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Instruksi Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={checkoutNotes}
                    onChange={(e) => setCheckoutNotes(e.target.value)}
                    placeholder="Contoh: Tolong bungkus bubble wrap, dll..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-xs bg-white text-gray-700"
                  />
                </div>
              </div>

              {/* Delivery Destination (Editable inside form or synced from profile) */}
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>Alamat Pengiriman Kurir Shopee</span>
                  </p>
                  <button
                    type="button"
                    onClick={openProfileModal}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center shrink-0 cursor-pointer"
                  >
                    Edit Alamat
                  </button>
                </div>

                {(!shippingName || !shippingAddress) ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center space-y-2">
                    <p className="text-xs text-amber-800">
                      Ups, Anda belum menyimpan data pengiriman. Silahkan klik tombol di bawah untuk melengkapi alamat agar AI kami dapat menghitung ongkir resmi tepat sasaran.
                    </p>
                    <button
                      type="button"
                      onClick={openProfileModal}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      <span>Lengkapi Alamat Kirim</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-150">
                      <p className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Nama Penerima</p>
                      <p className="font-bold text-gray-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{shippingName}</span>
                      </p>
                      <p className="text-gray-500 flex items-center gap-1.5 mt-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{shippingPhone}</span>
                      </p>
                    </div>

                    <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-150">
                      <p className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Alamat Lengkap Tujuan</p>
                      <p className="text-gray-700 leading-normal line-clamp-2">
                        {shippingAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtotal Jastip details representation */}
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Harga Barang Hasil Optimasi AI:</span>
                  <span className="font-mono font-bold">Rp{result.optimizedPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Jasatitip (Flat VIP Fee):</span>
                  <span className="font-mono font-bold text-emerald-600">Rp{result.jastipFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-px bg-rose-150 mt-1"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800">Total Tarif Pembayaran:</span>
                  <span className="font-sans font-black text-xl text-rose-600">
                    Rp{result.totalPayment.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal text-center pt-1.5">
                  Pembayaran menggunakan Transfer Bank / e-Wallet (Gopay/OVO/ShopeePay) yang diproses manual oleh tim kami setelah disetujui.
                </p>
              </div>

              {/* Final Submit CTA */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-5 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-2xl text-xs hover:bg-gray-50 transition"
                >
                  Ganti Link Lain
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-2xl transition shadow-lg shadow-rose-100 flex items-center justify-center space-x-1.5 cursor-pointer"
                  id="btn-submit-jastip"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{submitting ? "Mendaftarkan Pesanan..." : "Pesan Jastip Hemat Sekarang!"}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}
