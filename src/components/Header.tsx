import React from 'react';
import { Sparkles, User, MapPin, ShieldCheck, Activity } from 'lucide-react';
import NusaKirimLogo from './NusaKirimLogo';

interface HeaderProps {
  currentTab: 'catalog' | 'optimize' | 'orders' | 'admin';
  setCurrentTab: (tab: 'catalog' | 'optimize' | 'orders' | 'admin') => void;
  userProfile: {
    name: string;
    phone: string;
    address: string;
  };
  setUserProfile: (profile: any) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  isAdminLoggedIn?: boolean;
}

export default function Header({
  currentTab,
  setCurrentTab,
  userProfile,
  setUserProfile,
  showProfileModal,
  setShowProfileModal,
  isAdminLoggedIn = false
}: HeaderProps) {
  const [tempProfile, setTempProfile] = React.useState(userProfile);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(tempProfile);
    localStorage.setItem('shopee_jastip_profile', JSON.stringify(tempProfile));
    setShowProfileModal(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* NusaKirim Branding Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentTab('catalog')}>
            <NusaKirimLogo size={36} showText={true} />
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1 bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setCurrentTab('catalog')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                currentTab === 'catalog'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              id="tab-catalog"
            >
              Katalog Promo Hemat
            </button>
            <button
              onClick={() => setCurrentTab('optimize')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center space-x-1.5 ${
                currentTab === 'optimize'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              id="tab-optimize"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimasi Link Shopee</span>
            </button>
            <button
              onClick={() => setCurrentTab('orders')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                currentTab === 'orders'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              id="tab-orders"
            >
              Pesanan Saya
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center space-x-1.5 ${
                  currentTab === 'admin'
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                id="tab-admin"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Profile Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-2 text-left bg-gray-50 hover:bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition cursor-pointer border border-gray-100"
              id="btn-profile"
            >
              <div className="w-7 h-7 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-gray-800 leading-none truncate max-w-28">
                  {userProfile.name}
                </p>
                <p className="text-[10px] text-gray-400 truncate max-w-28 leading-none mt-0.5">
                  {userProfile.address ? 'Alamat Diset' : 'Isi Alamat'}
                </p>
              </div>
            </button>

            {/* Mobile Tab Trigger Menu fallback */}
            <div className="md:hidden flex space-x-1">
              <button
                onClick={() => setCurrentTab('optimize')}
                className={`p-2 rounded-xl border ${currentTab === 'optimize' ? 'bg-rose-600 text-white' : 'bg-gray-50 text-gray-600 border-gray-100'}`}
                title="Optimize Link"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTab('orders')}
                className={`p-2 rounded-xl border ${currentTab === 'orders' ? 'bg-rose-600 text-white' : 'bg-gray-50 text-gray-600 border-gray-100'}`}
                title="Orders"
              >
                <NusaKirimLogo size={20} showText={false} />
              </button>
              {isAdminLoggedIn && (
                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`p-2 rounded-xl border ${currentTab === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                  title="Admin Console"
                >
                  <Activity className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Information Setup Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-5 text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/15 p-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg leading-tight">Data Alamat Pengiriman</h3>
                  <p className="text-xs text-rose-150 font-medium">Melengkapi jaringan logistik terpercaya NusaKirim</p>
                </div>
              </div>
            </div>

            <form onSubmit={saveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  required
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  No. WhatsApp (Aktif)
                </label>
                <input
                  type="tel"
                  required
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Alamat Lengkap (Beserta Kota & Kode Pos)
                </label>
                <textarea
                  required
                  rows={3}
                  value={tempProfile.address}
                  onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                  placeholder="Jl. Mawar No. 12, RT 03/RW 04, Kec. Sukajadi, Kota Bandung, Jawa Barat 40162"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-sm resize-none"
                />
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800">
                  Data Anda tersimpan secara lokal dan aman. Kami hanya menggunakannya untuk menepatkan alur logistik kirim saat memesan barang Shopee pilihan Anda.
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-rose-100"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
