import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, User, MapPin, ShieldCheck, Heart, Info, Plus } from 'lucide-react';
import Header from './components/Header';
import OfferCatalog from './components/OfferCatalog';
import OptimizerForm from './components/OptimizerForm';
import OrderList from './components/OrderList';
import AdminConsole from './components/AdminConsole';
import NusaKirimLogo from './components/NusaKirimLogo';
import { ShopeeProduct, JastipOrder } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<'catalog' | 'optimize' | 'orders' | 'admin'>('catalog');
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nusakirim_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.authenticated;
      }
    } catch (_) {}
    return false;
  });
  
  // Set default guest profile
  const [userProfile, setUserProfile] = React.useState({
    name: 'Budi Santoso',
    phone: '081234567890',
    address: 'Kecamatan Sukajadi, Kota Bandung, Jawa Barat 40162'
  });

  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [products, setProducts] = React.useState<ShopeeProduct[]>([]);
  const [orders, setOrders] = React.useState<JastipOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Link for pre-loading in optimize form when coming from Catalog
  const [prefilledLink, setPrefilledLink] = React.useState('');

  const loadUserProfile = () => {
    const saved = localStorage.getItem('shopee_jastip_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved user profile", e);
      }
    }
  };

  const fetchCatalogData = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    }
  };

  const fetchOrdersData = async () => {
    try {
      // Fetch orders for our specific user id
      const res = await fetch('/api/orders?userId=user-default-vip');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Failed to fetch orders", e);
    }
  };

  React.useEffect(() => {
    loadUserProfile();
    
    const initFetch = async () => {
      setLoading(true);
      await Promise.all([fetchCatalogData(), fetchOrdersData()]);
      setLoading(false);
    };
    initFetch();
  }, []);

  const handleOrderFromCatalog = (product: ShopeeProduct) => {
    setPrefilledLink(product.shopeeLink);
    setCurrentTab('optimize');
  };

  const handleOrderCreatedSuccess = async () => {
    await fetchOrdersData();
    setCurrentTab('orders');
    setPrefilledLink('');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-rose-150 border-t-rose-600 animate-spin"></div>
            <p className="text-sm font-semibold text-gray-500 font-mono tracking-wider">MEMUAT DATA PLATFORM...</p>
          </div>
        ) : (
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="pb-16"
          >
            {currentTab === 'catalog' && (
              <OfferCatalog
                products={products}
                onOrderProduct={handleOrderFromCatalog}
              />
            )}

            {currentTab === 'optimize' && (
              <OptimizerForm
                initialLink={prefilledLink}
                userProfile={userProfile}
                onOrderCreated={handleOrderCreatedSuccess}
                openProfileModal={() => setShowProfileModal(true)}
              />
            )}

            {currentTab === 'orders' && (
              <OrderList
                orders={orders}
                onRefresh={fetchOrdersData}
                openOptimizeTab={() => setCurrentTab('optimize')}
              />
            )}

            {currentTab === 'admin' && (
              <AdminConsole
                orders={orders}
                onRefresh={fetchOrdersData}
                onLoginChange={(loggedIn) => setIsAdminLoggedIn(loggedIn)}
              />
            )}
          </motion.div>
        )}
      </main>

      {/* Footer layout */}
      <footer className="bg-white border-t border-gray-100 py-8 shrink-0 text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <NusaKirimLogo size={32} showText={true} />
          </div>

          <p className="text-center sm:text-left leading-normal text-gray-500">
            &copy; 2026 NusaKirim Logistik. Platform Jasa Titip Pembelian Shopee Hemat Berbasis AI & Jaringan Logistik 群岛物流.
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setCurrentTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[10px] text-gray-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer font-medium border-none bg-transparent outline-hidden"
              id="btn-portal-owner"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Akses Owner</span>
            </button>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Server Online
            </span>
            <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              Premium VIP Checkout
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
