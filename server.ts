import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { 
  getSubmissions, 
  addSubmission, 
  updateSubmission, 
  deleteSubmission, 
  connectDatabase,
  getMessages,
  addMessage,
  getActivityLogs,
  addActivityLog,
  registerUserProfile
} from "./src/db";

/**
 * Mengirim notifikasi WhatsApp otomatis ke nomor Admin secara terprogram di sisi server (backend)
 * menggunakan layanan WhatsApp API / Gateway (seperti Fonnte, Wablas, dll).
 */
async function sendWhatsAppNotificationToAdmin(message: string) {
  const token = process.env.WHATSAPP_API_TOKEN || process.env.FONNTE_TOKEN;
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "6281245695410";

  console.log(`\n======================= WA NOTIFICATION TRIGGER =======================`);
  console.log(`[TARGET ADMIN]: ${adminPhone}`);
  console.log(`[MESSAGE]:\n${message}`);
  console.log(`========================================================================\n`);

  if (!token) {
    console.log(`[WA NOTIFICATION SKIPPED]: WHATSAPP_API_TOKEN / FONNTE_TOKEN belum diatur di file .env.`);
    console.log(`Silakan daftarkan Token Fonnte Anda di .env untuk mengaktifkan notifikasi otomatis ke WhatsApp.`);
    return;
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: adminPhone,
        message: message,
        countryCode: "62"
      })
    });

    const resJson = await response.json();
    console.log(`[WA NOTIFICATION RESULT]:`, resJson);
  } catch (err: any) {
    console.error(`[WA NOTIFICATION ERROR]: Gagal mengirimkan pesan WA programmatik:`, err.message || err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Set up built-in express middleware for parsing requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Endpoints
  
  // 1. GET: Fetch all submissions
  app.get("/api/submissions", async (req, res) => {
    try {
      let data = await getSubmissions();
      const { phone } = req.query;
      if (phone) {
        const normPhone = (phone as string).trim();
        data = data.filter(item => item.customerPhone === normPhone);
      }
      res.json({
        success: true,
        data
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal mengambil data dari server"
      });
    }
  });

  // 2. POST: Submit a new shopping link
  app.post("/api/submissions", async (req, res) => {
    const { marketplace, productUrl, customerName, customerPhone, customerAddress, quantity, notes } = req.body;

    if (!marketplace || !productUrl || !customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: "Mohon isi semua bidang wajib (Kategori Toko, Link Produk, Nama, dan No WhatsApp)"
      });
    }

    try {
      // Prevent duplicate product link submission if there is an active order with the same link (exclude cancelled)
      const allSubmissions = await getSubmissions();
      const targetUrl = productUrl.trim().toLowerCase();
      const isDuplicate = allSubmissions.some(sub => 
        sub.productUrl.trim().toLowerCase() === targetUrl && sub.status !== 'cancelled'
      );
      if (isDuplicate) {
        return res.status(400).json({
          success: false,
          error: "Link produk ini sudah pernah diajukan sebelumnya dan sedang diproses admin agar tidak terjadi pemesanan ganda. / 该商品链接此前已提交，管理员正在处理中，以避免重复下单。"
        });
      }

      const newSubmission = await addSubmission({
        marketplace: marketplace as 'shopee' | 'tokopedia' | 'tiktok' | 'lainnya',
        productUrl,
        customerName,
        customerPhone,
        customerAddress: customerAddress || "",
        quantity: Number(quantity) || 1,
        notes: notes || ""
      });

      // Generate a welcoming automated initial message from the Admin!
      await addMessage(
        newSubmission.id,
        'admin',
        `Halo Kak ${customerName}! 👋 Selamat datang di NusaKirim Live Chat.\n\nPesanan Anda untuk item dari ${marketplace.toUpperCase()} telah kami terima dengan rincian:\n🔗 Link: ${productUrl}\n📦 Jumlah: ${quantity} pcs\n\nAdmin kami sedang mengecek ketersediaan & menghitung estimasi biaya total + kargo Anda. Mohon ditunggu ya! Jika ada pertanyaan atau instruksi tambahan, silakan ketik langsung di sini.`
      );

      // Kirim notifikasi WA otomatis ke Admin (tidak mengganggu respon cepat ke pelanggan)
      const submissionMsg = `🔔 *NOTIFIKASI PESANAN JASTIP BARU*\n\nAda pelanggan baru saja mengajukan pesanan jasa titip:\n\n👤 *Nama:* ${customerName}\n📱 *WhatsApp:* ${customerPhone}\n📍 *Alamat:* ${customerAddress || '-'}\n🏪 *Toko:* ${marketplace.toUpperCase()}\n🔗 *Link Produk:* ${productUrl}\n📦 *Jumlah:* ${quantity} pcs\n📝 *Catatan:* ${notes || '-'}\n\n_Silakan periksa dashboard admin NusaKirim untuk menanggapi._`;
      sendWhatsAppNotificationToAdmin(submissionMsg).catch(err => console.error("Gagal mengirim notifikasi pesanan baru ke WA:", err));

      res.status(201).json({
        success: true,
        message: "Link belanja Anda berhasil diajukan ke admin jasa pengiriman/pembelian kami!",
        data: newSubmission
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal memproses data di server"
      });
    }
  });

  // 3. PUT: Update submission status and pricing details
  app.put("/api/submissions/:id", async (req, res) => {
    const { id } = req.params;
    const { status, priceEstimate } = req.body;

    try {
      const updated = await updateSubmission(id, {
        status: status as any,
        priceEstimate
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: "Data pesanan tidak ditemukan"
        });
      }

      res.json({
        success: true,
        message: "Status pesanan berhasil diperbarui",
        data: updated
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal memperbarui pesanan di server"
      });
    }
  });

  // 4. DELETE: Remove submission entry
  app.delete("/api/submissions/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const success = await deleteSubmission(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: "Data pesanan tidak ditemukan"
        });
      }

      res.json({
        success: true,
        message: "Data pesanan berhasil dihapus"
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal menghapus pesanan di server"
      });
    }
  });

  // 5. GET: Fetch chat messages for a specific order submission
  app.get("/api/submissions/:id/messages", async (req, res) => {
    const { id } = req.params;
    try {
      const messages = await getMessages(id);
      res.json({
        success: true,
        data: messages
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal memuat pesan obrolan"
      });
    }
  });

  // 6. POST: Send a chat message for a specific order submission
  app.post("/api/submissions/:id/messages", async (req, res) => {
    const { id } = req.params;
    const { sender, message } = req.body;

    if (!sender || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Pengirim dan pesan tidak boleh kosong"
      });
    }

    try {
      const newMessage = await addMessage(id, sender as 'admin' | 'customer', message.trim());
      res.status(201).json({
        success: true,
        data: newMessage
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal mengirim pesan obrolan"
      });
    }
  });

  // 7. GET: Fetch recent activity logs / notifications
  app.get("/api/activities", async (req, res) => {
    try {
      const logs = await getActivityLogs();
      res.json({
        success: true,
        data: logs
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal mengambil log aktivitas"
      });
    }
  });

  // 8. POST: Log a new customer login or registration activity
  app.post("/api/activities", async (req, res) => {
    const { type, customerName, customerPhone, customerAddress, details } = req.body;
    
    if (!type || !customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: "Data tipe, nama, dan telepon tidak boleh kosong"
      });
    }

    try {
      const log = await addActivityLog({
        type: type as any,
        customerName,
        customerPhone,
        customerAddress: customerAddress || "",
        details: details || ""
      });
      res.status(201).json({
        success: true,
        data: log
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Gagal menyimpan log aktivitas"
      });
    }
  });

  // 9. POST: Register / Sync user profile with 1-phone-number-per-account validator rule
  app.post("/api/register", async (req, res) => {
    const { name, phone, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Nama dan Nomor WhatsApp harus diisi!"
      });
    }

    try {
      const result = await registerUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address ? address.trim() : ""
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.message
        });
      }

      // Kirim notifikasi WA otomatis ke Admin jika berhasil mendaftar/login (bukan dari client-side redirect)
      const loginMsg = `👤 *NOTIFIKASI PELANGGAN MASUK WEB*\n\nAda pelanggan yang baru saja masuk / mendaftar profil di website NusaKirim:\n\n• *Nama:* ${name.trim()}\n• *WhatsApp/HP:* ${phone.trim()}\n• *Alamat Pengiriman:* ${address ? address.trim() : '-'}\n\n_Sistem otomatis akan menyinkronkan riwayat pesanan pelanggan tersebut._`;
      sendWhatsAppNotificationToAdmin(loginMsg).catch(err => console.error("Gagal mengirim notifikasi login/registrasi ke WA:", err));

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || "Terjadi kesalahan pada server saat mendaftarkan profil."
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RuangKreatif Shipping & Buying Agent Server running on http://localhost:${PORT}`);
    connectDatabase().catch(err => console.error("Database connection failed on startup:", err));
  });
}

startServer();
