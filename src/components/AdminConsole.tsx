import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, RefreshCw, AlertCircle, Search, MessageSquare, Send } from 'lucide-react';
import { JastipOrder } from '../types';

interface AdminConsoleProps {
  orders: JastipOrder[];
  onRefresh: () => void;
  onLoginChange?: (loggedIn: boolean) => void;
}

export default function AdminConsole({ orders, onRefresh, onLoginChange }: AdminConsoleProps) {
  // Authentication & Session Switch states
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [adminName, setAdminName] = React.useState('Admin');
  const [password, setPassword] = React.useState('');
  const [loggingIn, setLoggingIn] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [activeAdminName, setActiveAdminName] = React.useState('Admin');

  // Operational states
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [updating, setUpdating] = React.useState(false);
  const [trackingNo, setTrackingNo] = React.useState('');
  const [adminChat, setAdminChat] = React.useState('');
  const [sendingAdminChat, setSendingAdminChat] = React.useState(false);

  const activeOrder = orders.find(o => o.id === selectedOrderId);

  // Load saved admin session
  React.useEffect(() => {
    const saved = localStorage.getItem('nusakirim_admin_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.authenticated) {
          setIsAuthenticated(true);
          setAdminName(parsed.name);
          setActiveAdminName(parsed.name);
          if (onLoginChange) {
            onLoginChange(true);
          }
        }
      } catch (e) {
        console.error("Failed to parse saved admin session", e);
      }
    }
  }, []);

  // Sync active admin info from backend
  const fetchActiveAdmin = async () => {
    try {
      const res = await fetch('/api/active-admin');
      if (res.ok) {
        const data = await res.json();
        setActiveAdminName(data.name || 'Owner NusaKirim');
      }
    } catch (e) {
      console.error("Failed to sync active admin info", e);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchActiveAdmin();
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (activeOrder) {
      setTrackingNo(activeOrder.trackingNumber || '');
    }
  }, [selectedOrderId]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoggingIn(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/active-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminName.trim(), password })
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setActiveAdminName(adminName.trim() || 'Owner NusaKirim');
        localStorage.setItem('nusakirim_admin_session', JSON.stringify({
          authenticated: true,
          name: adminName.trim()
        }));
        if (onLoginChange) {
          onLoginChange(true);
        }
        onRefresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Autentikasi gagal.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('nusakirim_admin_session');
    setIsAuthenticated(false);
    setPassword('');
    setErrorMsg('');
    if (onLoginChange) {
      onLoginChange(false);
    }
  };

  // Update Status Alur Jastip
  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrderId) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNo || undefined
        })
      });

      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Send Chat message from Admin
  const handleSendAdminChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChat.trim() || !selectedOrderId) return;

    setSendingAdminChat(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrderId}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'admin',
          senderName: activeAdminName,
          message: adminChat
        })
      });

      if (res.ok) {
        setAdminChat('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingAdminChat(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customerName.toLowerCase().includes(search.toLowerCase()) || 
    o.productName.toLowerCase().includes(search.toLowerCase())
  );

  // If NOT logged in / verified, render password door
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-gray-150 shadow-xl space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-black text-xl text-gray-900">Dashboard Pemilik Jastip</h3>
          <p className="text-xs text-gray-500">Silahkan autentikasi untuk memantau & memproses pesanan konsumen NusaKirim</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Nama Pemilik / Admin Aktif
            </label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Contoh: Admin"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-250 text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-500 text-gray-850"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Password Akses Admin
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-250 text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-500 text-gray-850"
            />
            <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
              Akses khusus. Silakan hubungi pengelola utama untuk password otorisasi pemilik.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loggingIn || !password}
            className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 mt-2"
          >
            {loggingIn ? 'Memverifikasi...' : 'Masuk Dashboard Admin'}
          </button>
        </form>
      </div>
    );
  }

  // Verification successful: Render Dashboard Admin Complete View
  return (
    <div className="space-y-8 text-left">
      {/* Upper Panel Status & Session Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-sans font-bold text-base">Dashboard Simulasi Pemilik Jastip (Admin)</h3>
              <p className="text-xs text-slate-300 mt-1">
                Sebagai pemilik NusaKirim Jastip, di sini Anda bisa melacak semua order konsumen, memverifikasi transfer, memperbarui status pesanan Shopee, memasukkan nomor resi kurir, dan membalas chat pembeli.
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-white border border-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Dynamic admin session identity bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-black/20 p-4 rounded-2xl">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="font-mono text-gray-300">
              Sesi Owner Aktif: <span className="font-bold text-rose-400">{activeAdminName}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-900 text-rose-300 font-bold rounded-xl text-[11px] transition cursor-pointer text-center"
          >
            Ganti / Keluar Admin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Order queue filterable list column */}
        <div className={`${selectedOrderId ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <div className="flex bg-white px-4 py-2 border border-gray-150 rounded-2xl items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, ID order, atau barang..."
              className="w-full text-xs focus:outline-hidden text-gray-700 bg-transparent py-1.5"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
              <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Belum ada konsumen yang membuat pesanan baru.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((o) => {
                const isSelected = o.id === selectedOrderId;
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className={`bg-white rounded-2xl p-4 border text-xs cursor-pointer hover:border-slate-350 transition relative overflow-hidden ${
                      isSelected ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="font-mono font-bold text-slate-500">ID: {o.id}</span>
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase ${
                        o.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        ['APPROVED', 'WAITING_PAYMENT'].includes(o.status) ? 'bg-blue-100 text-blue-800 font-bold' :
                        o.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'SHIPPED' ? 'bg-rose-100 text-rose-800 font-bold' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {o.status}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-gray-900 text-xs mb-1 line-clamp-1">{o.productName}</h4>
                    <p className="text-[10px] text-gray-500 mb-2 leading-none">Konsumen: <span className="font-semibold text-gray-850">{o.customerName}</span></p>

                    <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                      <div>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Total Tagihan</p>
                        <p className="font-mono font-bold text-rose-600">Rp{o.totalPayment.toLocaleString('id-ID')}</p>
                      </div>
                      <span className="text-[9px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Order operational console & Chat board */}
        <AnimatePresence>
          {selectedOrderId && activeOrder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-7 bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-xl space-y-6 flex flex-col h-[700px]"
            >
              <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-amber-400 block font-bold">OPERASIONAL ORDER</span>
                  <span className="text-xs text-gray-300 font-sans block font-semibold truncate max-w-sm mt-0.5">
                    {activeOrder.productName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="px-2.5 py-1 text-xs border border-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                >
                  Tutup Panel
                </button>
              </div>

              {/* Scroll actions panel */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs min-h-0 scrollbar-none">
                
                {/* Monospace view of order mirroring customer ticket */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 font-mono">
                  <p className="font-bold text-gray-700 uppercase tracking-widest text-[9px] block font-sans">SAMPEL TIKET KONSUMEN:</p>
                  <div className="text-left text-[11px] leading-relaxed text-gray-800 space-y-1">
                    <div>ID: {activeOrder.id}</div>
                    <div className="font-bold text-rose-600 uppercase">{activeOrder.status}</div>
                    <div className="font-sans font-semibold text-gray-900 pt-1 border-t border-gray-200/50 mt-1">{activeOrder.productName}</div>
                    <div>Konsumen: {activeOrder.recipientName || activeOrder.customerName}</div>
                    <div className="pt-2 border-t border-gray-200/50 mt-2 text-rose-600 font-sans font-black text-sm">
                      Rp{activeOrder.totalPayment.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Consumer delivery coordinates */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3">
                  <p className="font-bold text-gray-700 uppercase tracking-widest text-[9px] block">Informasi Lengkap Konsumen:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Atas Nama Penerima</span>
                      <p className="font-bold text-slate-900">{activeOrder.recipientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Kontak WhatsApp</span>
                      <p className="font-mono font-bold text-slate-900">{activeOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Alamat Lengkap</span>
                    <p className="text-gray-650 leading-normal bg-white p-2.5 rounded-lg border border-gray-100">
                      {activeOrder.customerAddress}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Link Shopee Asli</span>
                    <a
                      href={activeOrder.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline inline-block break-all font-mono text-[10px]"
                    >
                      {activeOrder.productUrl}
                    </a>
                  </div>
                </div>

                {/* Shopee AirWay Bill Tracking code */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200/80 space-y-3">
                  <label className="block font-bold text-gray-700 uppercase tracking-widest text-[9px]">
                    Update Nomor Resi Shopee (Jika Status Dikirim)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      placeholder="Contoh: JP82910283921 (Resi J&T Shopee)"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-250 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                    <button
                      onClick={() => handleUpdateStatus(activeOrder.status)}
                      disabled={updating}
                      className="bg-slate-900 text-white px-4 py-2 font-semibold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
                    >
                      Simpan Resi
                    </button>
                  </div>
                </div>

                {/* Operations State controls */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200/80 space-y-3">
                  <p className="font-bold text-gray-700 uppercase tracking-widest text-[9px] block">Ubah Status Alur Pembelian:</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus('APPROVED')}
                      disabled={updating}
                      className={`py-2 px-3 border rounded-xl font-bold font-sans text-[10px] transition cursor-pointer ${activeOrder.status === 'APPROVED' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-155 hover:bg-gray-100'}`}
                    >
                      Setujui Jastip (Siap Bayar)
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('WAITING_PAYMENT')}
                      disabled={updating}
                      className={`py-2 px-3 border rounded-xl font-bold font-sans text-[10px] transition cursor-pointer ${activeOrder.status === 'WAITING_PAYMENT' ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-600 border-gray-155 hover:bg-gray-100'}`}
                    >
                      Set Menunggu Transfer
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('PAID')}
                      disabled={updating}
                      className={`py-2 px-3 border rounded-xl font-bold font-sans text-[10px] transition cursor-pointer ${activeOrder.status === 'PAID' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-600 border-gray-155 hover:bg-gray-100'}`}
                    >
                      Konfirmasi Bayar Lunas (PAID)
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('ORDERED')}
                      disabled={updating}
                      className={`py-2 px-3 border rounded-xl font-bold font-sans text-[10px] transition cursor-pointer ${activeOrder.status === 'ORDERED' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-gray-50 text-gray-600 border-gray-155 hover:bg-gray-100'}`}
                    >
                      Belanja di Shopee (Order Selesai)
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('SHIPPED')}
                      disabled={updating}
                      className={`py-2 px-3 border rounded-xl font-bold font-sans text-[10px] transition cursor-pointer ${activeOrder.status === 'SHIPPED' ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-600 border-gray-155 hover:bg-gray-100'}`}
                    >
                      Sedang Dikirim Kurir Shopee
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('COMPLETED')}
                      disabled={updating}
                      className={`py-2 px-3 border rounded-xl font-bold font-sans text-[10px] transition cursor-pointer ${activeOrder.status === 'COMPLETED' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 text-gray-600 border-gray-155 hover:bg-gray-100'}`}
                    >
                      Set Transaksi Selesai
                    </button>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus('CANCELLED')}
                    disabled={updating}
                    className="w-full text-center py-2 bg-red-50 hover:bg-red-100 border border-red-100 font-bold font-sans text-[10px] rounded-xl text-red-700 cursor-pointer"
                  >
                    Batalkan Pengajuan / Tolak Orderan
                  </button>
                </div>
              </div>

              {/* Real-time sync chats room */}
              <div className="bg-slate-50 border-t border-gray-250 flex flex-col h-64 shrink-0">
                <div className="p-3 bg-gray-100 border-b border-gray-150 flex items-center justify-between shrink-0 font-sans">
                  <span className="font-bold flex items-center space-x-1 text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Obrolan Bersama Konsumen</span>
                  </span>
                  <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-sm font-bold font-mono">
                    Owner: {activeAdminName}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 text-[11px]">
                  {activeOrder.chats && activeOrder.chats.map((chat) => {
                    const isMe = chat.sender === 'admin';
                    const isAi = chat.sender === 'ai';
                    const chatSenderName = isMe 
                      ? (chat.senderName || activeAdminName || 'Owner') 
                      : isAi 
                        ? 'AI Support Helper' 
                        : 'Konsumen (Buyer)';

                    return (
                      <div
                        key={chat.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[9px] text-gray-400 mb-0.5 font-sans">
                          {chatSenderName} • {new Date(chat.timestamp).toLocaleTimeString('id-id', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed break-words text-left ${
                          isMe 
                            ? 'bg-slate-900 text-white rounded-tr-none font-sans' 
                            : isAi 
                              ? 'bg-white border border-gray-150 text-gray-700 rounded-tl-none font-sans' 
                              : 'bg-rose-50 border border-rose-100 text-rose-955 rounded-tl-none font-medium font-sans'
                        }`}>
                          {chat.message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Send action chat input */}
                <form onSubmit={handleSendAdminChat} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={adminChat}
                    onChange={(e) => setAdminChat(e.target.value)}
                    placeholder="Tulis balasan pesan untuk konsumen..."
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden text-xs text-gray-750 font-sans"
                    disabled={sendingAdminChat}
                    required
                  />
                  <button
                    type="submit"
                    disabled={sendingAdminChat || !adminChat.trim()}
                    className="p-2 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
