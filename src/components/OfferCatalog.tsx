import React from 'react';
import { motion } from 'motion/react';
import { Search, Tag, Flame, Coins, ShieldCheck, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { ShopeeProduct } from '../types';

interface OfferCatalogProps {
  products: ShopeeProduct[];
  onOrderProduct: (product: ShopeeProduct) => void;
}

const CATEGORIES = ["Semua", "Fashion Pria", "Fashion Wanita", "Elektronik", "Perlengkapan Rumah", "Mebel & Furniture"];

export default function OfferCatalog({ products, onOrderProduct }: OfferCatalogProps) {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Semua');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-br from-rose-600 via-rose-500 to-rose-400 rounded-3xl overflow-hidden shadow-xl p-8 sm:p-12 text-white">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-10 translate-x-10">
          <Flame className="w-96 h-96" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>NusaKirim VIP Checkout Optimizer • Shopee Live & Video</span>
          </div>
          
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
            Belanja Barang Shopee <br className="hidden sm:inline" />
            <span className="text-rose-100">Jauh Lebih Murah & Hemat!</span>
          </h1>
          
          <p className="text-rose-50 text-sm sm:text-base leading-relaxed">
            Kami bantu check-outkan barang impian kakak di Shopee memakai racikan diskon VIP NusaKirim: Kupon Video 40%, Voucher Live 50%, Coin Cashback, dan Jaringan Logistik Pengiriman Hemat Terintegrasi!
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/5 flex items-center space-x-3">
              <Coins className="w-5 h-5 text-amber-300" />
              <div>
                <p className="font-mono text-lg font-bold text-white leading-none">30%-60%</p>
                <p className="text-[10px] text-rose-100 uppercase tracking-wider font-semibold">Tingkat Hemat</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/5 flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <div>
                <p className="font-mono text-lg font-bold text-white leading-none">100% Aman</p>
                <p className="text-[10px] text-rose-100 uppercase tracking-wider font-semibold">Garansi Kirim</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Explanation Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center space-x-2">
          <span>Bagaimana Cara Kerja Keagenan Jastip NusaKirim?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-gray-900">Salin & Tempel Link Shopee</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cari barang apa saja di Shopee reguler. Salin link produknya, paste di tab <b>&quot;Optimasi Link Shopee&quot;</b> di atas.
            </p>
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-gray-900">AI Menghitung Rincian Diskon</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              AI kami memindai voucher toko aktif, slot diskon Shopee Live 50%, Shopee Video 40%, koin, dan memotong ongkos kirim.
            </p>
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-gray-900">Checkout Hemat & Pengiriman</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bayar harga hemat + fee jastip terendah. Tim logistik NusaKirim langsung check-outkan barang kakak dengan aman!
            </p>
          </div>
        </div>
      </div>

      {/* Filter and catalog section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Katalog Promo Hot-item Populer</h2>
            <p className="text-xs text-gray-500 mt-1">Daftar produk diskon up-to 60% yang sering dipesan hari ini</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk hemat..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
            />
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer shrink-0 transition ${
                selectedCategory === category
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-gray-605 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Tidak ada produk yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-rose-200 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-xl text-xs font-black tracking-wide shadow-md flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>HEMAT {product.discountPercent}%</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg text-[10px] font-mono tracking-wider">
                    {product.category}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-sans font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <div className="flex items-center space-x-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                      <span>•</span>
                      <span>Terjual {product.salesCount.toLocaleString('id-ID')}+</span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="bg-rose-50/50 rounded-2xl p-3 border border-rose-100/50 flex align-middle justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-normal line-through block">
                          Harga Normal: Rp{product.originalPrice.toLocaleString('id-ID')}
                        </span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xs text-rose-600 font-extrabold">Rp</span>
                          <span className="text-lg text-rose-600 font-black">
                            {product.discountedPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <span className="self-center bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                        Gabungan Voucher OK
                      </span>
                    </div>

                    {/* Buttons CTA */}
                    <div className="flex gap-2.5">
                      <a
                        href={product.shopeeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 border border-gray-200 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-semibold hover:bg-gray-50 transition flex items-center justify-center space-x-1.5"
                      >
                        <span>Cek Shopee</span>
                      </a>
                      <button
                        onClick={() => onOrderProduct(product)}
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-rose-100 cursor-pointer"
                        id={`btn-beli-${product.id}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Beli Lewat Jastip</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
