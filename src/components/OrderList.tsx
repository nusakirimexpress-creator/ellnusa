import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Plus, Clipboard, RefreshCw } from 'lucide-react';
import { JastipOrder } from '../types';

interface OrderListProps {
  orders: JastipOrder[];
  onRefresh: () => void;
  openOptimizeTab: () => void;
}

export default function OrderList({ orders, onRefresh, openOptimizeTab }: OrderListProps) {
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [chatMessage, setChatMessage] = React.useState('');
  const [sendingChat, setSendingChat] = React.useState(false);
  const [activeOwner, setActiveOwner] = React.useState('Owner NusaKirim');

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Auto select first order on mount/load
  React.useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  // Poll for status updates or chats every 7 seconds if an order is active
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedOrderId) {
      interval = setInterval(() => {
        onRefresh();
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [selectedOrderId]);

  // Fetch the currently active logged-in admin/owner
  React.useEffect(() => {
    const fetchActiveAdmin = async () => {
      try {
        const res = await fetch('/api/active-admin');
        if (res.ok) {
          const data = await res.json();
          setActiveOwner(data.name || 'Owner NusaKirim');
        }
      } catch (err) {
        console.error("Failed to fetch active admin", err);
      }
    };
    fetchActiveAdmin();
    // Poll active owner every 7 seconds
    const interval = setInterval(fetchActiveAdmin, 7000);
    return () => clearInterval(interval);
  }, []);

  // Scroll active chat list to bottom helper
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedOrder?.chats]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedOrderId) return;

    setSendingChat(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrderId}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'user',
          message: chatMessage
        })
      });

      if (res.ok) {
        setChatMessage('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingChat(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800 font-bold';
      case 'WAITING_PAYMENT': return 'bg-purple-100 text-purple-800 font-bold';
      case 'PAID': return 'bg-emerald-100 text-emerald-800';
      case 'ORDERED': return 'bg-cyan-100 text-cyan-800';
      case 'SHIPPED': return 'bg-rose-100 text-rose-800';
      case 'COMPLETED': return 'bg-green-150 text-green-900';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with refresh button */}
      <div className="flex justify-between items-center bg-white p-5 border border-gray-100 rounded-3xl">
        <div>
          <h3 className="font-sans font-bold text-gray-900 text-base">Antrean Jastip Saya</h3>
          <p className="text-xs text-gray-400 mt-0.5">Daftar item Jastip Shopee Hemat milik Anda</p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2.5 hover:bg-gray-50 rounded-xl border border-gray-150 text-gray-500 cursor-pointer transition flex items-center gap-1.5 text-xs font-semibold"
          title="Refresh Status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 space-y-4">
          <Clipboard className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-gray-800 text-sm">Belum Ada Pesanan</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">Anda belum memasukkan jastip diskon. Silahkan isi link Shopee Anda di menu Optimasi Link!</p>
          </div>
          <button
            onClick={openOptimizeTab}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Optimasi Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column: Mini Order Cards Stack */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Daftar Pengajuan:</p>
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto scrollbar-none pr-1">
              {orders.map((o) => {
                const isSelected = o.id === selectedOrderId;
                const badgeColor = getStatusBadgeColor(o.status);
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className={`cursor-pointer bg-white rounded-2xl p-4 border transition-all duration-150 relative ${
                      isSelected ? 'border-rose-500 ring-2 ring-rose-500/10 shadow-md' : 'border-gray-100 hover:border-gray-200 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-gray-400 font-bold">ID: {o.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${badgeColor}`}>
                        {o.status}
                      </span>
                    </div>
                    <h5 className="font-sans font-bold text-gray-900 text-xs mt-2 line-clamp-1">
                      {o.productName}
                    </h5>
                    <div className="flex justify-between items-end mt-3 pt-2.5 border-t border-gray-50">
                      <span className="font-sans font-bold text-rose-600 text-[11px]">
                        Rp{o.totalPayment.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Exact Ticket Block & Chat Room with Active Owner */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
                >
                  {/* Sub-panel 1: Pure elegant monospace data representation exactly requested */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs flex flex-col justify-between text-left font-mono">
                    <div className="space-y-4 text-xs leading-normal">
                      <div>
                        ID: {selectedOrder.id}
                      </div>

                      <div className="font-bold text-rose-600 tracking-wider">
                        {selectedOrder.status}
                      </div>

                      <div className="font-sans font-semibold text-gray-900 border-t border-gray-200/50 pt-3">
                        {selectedOrder.productName}
                      </div>

                      <div className="text-gray-600">
                        Konsumen: {selectedOrder.recipientName || selectedOrder.customerName}
                      </div>
                    </div>

                    <div className="border-t border-gray-200/50 pt-4 mt-8">
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                        Total Tagihan
                      </div>
                      <div className="font-sans font-black text-2xl text-rose-600">
                        Rp{selectedOrder.totalPayment.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Sub-panel 2: Customer Side Chat Room to conversation with owner */}
                  <div className="bg-gray-50 rounded-3xl border border-gray-150 shadow-xs flex flex-col overflow-hidden max-h-[420px] md:max-h-none h-[420px]">
                    {/* Header */}
                    <div className="bg-white px-4 py-3 border-b border-gray-150 flex justify-between items-center shrink-0">
                      <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                        <span className="truncate max-w-44">Obrolan dengan {activeOwner}</span>
                      </span>
                      <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md font-bold flex items-center space-x-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                        <span>{activeOwner ? 'Online' : 'Aktif'}</span>
                      </span>
                    </div>

                    {/* Chat Thread */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 text-[11px] scrollbar-none">
                      {selectedOrder.chats && selectedOrder.chats.map((chat) => {
                        const isMe = chat.sender === 'user';
                        const isAi = chat.sender === 'ai';
                        const displaySender = isMe 
                          ? 'Anda (Buyer)' 
                          : isAi 
                            ? 'AI Support Helper' 
                            : (chat.senderName || activeOwner || 'Owner NusaKirim');

                        return (
                          <div
                            key={chat.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[9px] text-gray-400 mb-0.5 font-sans">
                              {displaySender} • {new Date(chat.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed break-words text-left ${
                              isMe 
                                ? 'bg-rose-600 text-white rounded-tr-none' 
                                : isAi 
                                  ? 'bg-white border border-gray-200 shadow-xs text-gray-800 rounded-tl-none font-sans' 
                                  : 'bg-rose-100 border border-rose-200 text-rose-850 rounded-tl-none font-medium font-sans'
                            }`}>
                              {chat.message}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef}></div>
                    </div>

                    {/* Form Input send message */}
                    <form onSubmit={handleSendChat} className="p-2.5 bg-white border-t border-gray-150 flex items-center gap-2 shrink-0">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-rose-500 text-gray-700 font-sans"
                        disabled={sendingChat}
                        required
                      />
                      <button
                        type="submit"
                        disabled={sendingChat || !chatMessage.trim()}
                        className="p-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                  <p className="text-xs">Silahkan pilih salah satu pengajuan dari antrean di samping untuk melihat rincian.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}
    </div>
  );
}
