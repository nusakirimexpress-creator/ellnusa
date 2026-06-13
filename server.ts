import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Create Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
const PORT = 3000;

app.use(express.json());

// JSON File Database
const DB_FILE = path.join(process.cwd(), "jasa_shopee_db.json");

interface DBState {
  products: any[];
  orders: any[];
}

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Kaos Oversize Pria Cotton Combed 24s Heavyweight Premium",
    originalPrice: 89000,
    discountedPrice: 42000,
    discountPercent: 53,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
    shopeeLink: "https://shopee.co.id/Kaos-Oversize-Pria-Cotton-Combed-24s",
    rating: 4.8,
    salesCount: 12500,
    category: "Fashion Pria",
    description: "Kaos oversize premium dengan bahan Cotton Combed 24s tebal, menyerap keringat dan sangat adem. Melalui optimasi Jastip Hemat Shopee, kami menggabungkan Voucher Toko, Voucher Shopee Live 40%, dan Koin Shopee Anda untuk memotong harga dari Rp89.000 menjadi hanya Rp42.000 saja!"
  },
  {
    id: "prod-2",
    name: "TWS Earphone Wireless Bluetooth 5.3 Noise Cancelling Waterproof",
    originalPrice: 199000,
    discountedPrice: 85000,
    discountPercent: 57,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    shopeeLink: "https://shopee.co.id/TWS-Earphone-Wireless-Bluetooth-5.3",
    rating: 4.9,
    salesCount: 4300,
    category: "Elektronik",
    description: "Nikmati musik tanpa batas dengan TWS Bluetooth 5.3 terkini. Menggunakan jalur checkout optimasi akun VIP Shopee Video kami, Anda bisa menghemat lebih dari setengah harga ritel normal. Sudah termasuk garansi 12 bulan."
  },
  {
    id: "prod-3",
    name: "Aesthetic Hydration Flask Gelas Termos Stainless Steel 1 Liter",
    originalPrice: 145000,
    discountedPrice: 65000,
    discountPercent: 55,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    shopeeLink: "https://shopee.co.id/Termos-Stainless-Steel-1-Liter",
    rating: 4.7,
    salesCount: 8900,
    category: "Perlengkapan Rumah",
    description: "Termos minum trendy masa kini dengan insulator double wall super tebal. Menjaga suhu air dingin sampai 24 jam dan air panas sampai 12 jam. Jastip Hemat kami menggunakan klaim voucher kilat Flash Sale Shopee untuk membelikan barang ini dengan harga miring."
  },
  {
    id: "prod-4",
    name: "Korean Style Oversized Cardigan Rajut Wanita Tebal Premium",
    originalPrice: 120000,
    discountedPrice: 58000,
    discountPercent: 52,
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60",
    shopeeLink: "https://shopee.co.id/Korean-Style-Oversized-Cardigan",
    rating: 4.8,
    salesCount: 6100,
    category: "Fashion Wanita",
    description: "Kardigan rajut rajutan rapat bergaya kasual Korea yang sangat viral. Nyaman dipakai harian maupun hangout formal. Di-checkout menggunakan Voucher Shopee Video XTRA up to 40% dan voucher Toko terpilih."
  },
  {
    id: "prod-5",
    name: "Ergonomic Office Chair Kursi Kerja Jaring Nyaman dengan Adjustable Armrest",
    originalPrice: 750000,
    discountedPrice: 389000,
    discountPercent: 48,
    imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60",
    shopeeLink: "https://shopee.co.id/Ergonomic-Office-Chair-Kursi-Kerja",
    rating: 4.6,
    salesCount: 1800,
    category: "Mebel & Furniture",
    description: "Kursi kantor ergonomis dengan sandaran jaring breathable yang menopang tulang lumbar belakang. Dilengkapi setelan tinggi hidrolik dan armrest. Checkout menggunakan paket Gratis Ongkir XTRA Kargo + Voucher Elektronik untuk memangkas biaya ongkir dan harga jual."
  }
];

function initDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(data);
      if (!db.products || db.products.length === 0) {
        db.products = DEFAULT_PRODUCTS;
      }
      return db;
    }
  } catch (e) {
    console.error("Error reading database file, using empty schema", e);
  }
  
  // write default db
  const defaultDB: DBState = {
    products: DEFAULT_PRODUCTS,
    orders: []
  };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2));
  } catch (err) {
    console.error("Error writing default database file", err);
  }
  return defaultDB;
}

const db = initDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Global in-memory state for the currently logged in owner/admin
let activeAdmin = {
  name: "Owner NusaKirim",
  lastLogin: new Date().toISOString()
};

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Get currently active admin
app.get("/api/active-admin", (req, res) => {
  res.json(activeAdmin);
});

// Update/Login active admin
app.post("/api/active-admin", (req, res) => {
  const { name, password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password wajib diisi." });
  }
  
  const correctPassword = password === "Useradmin12";
  if (!correctPassword) {
    return res.status(401).json({ error: "Password Admin salah!" });
  }

  if (name && name.trim()) {
    activeAdmin.name = name.trim();
  } else {
    activeAdmin.name = "Owner NusaKirim";
  }
  activeAdmin.lastLogin = new Date().toISOString();
  res.json({ success: true, admin: activeAdmin });
});

// Get Products
app.get("/api/products", (req, res) => {
  res.json({ products: db.products });
});

// Create/Request Product Addition to catalog
app.post("/api/products", (req, res) => {
  const { name, originalPrice, discountedPrice, imageUrl, shopeeLink, category, description } = req.body;
  
  if (!name || !originalPrice || !shopeeLink) {
    return res.status(400).json({ error: "Name, Original Price, and Shopee Link are required." });
  }

  const discountVal = originalPrice > discountedPrice ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    originalPrice: Number(originalPrice),
    discountedPrice: discountedPrice ? Number(discountedPrice) : Math.round(originalPrice * 0.5),
    discountPercent: discountVal || 50,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    shopeeLink,
    rating: 5.0,
    salesCount: 1,
    category: category || "Umum",
    description: description || "Ditambahkan oleh pengguna. Siap dioptimisasi checkout voucher murah!"
  };

  db.products.unshift(newProduct);
  saveDB();
  res.status(201).json(newProduct);
});

// Get orders for a user
app.get("/api/orders", (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.json({ orders: db.orders }); // fallback all
  }
  const filtered = db.orders.filter(order => order.userId === userId);
  res.json({ orders: filtered });
});

// Get single order
app.get("/api/orders/:id", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

// Create Order (Checkout Jastip)
app.post("/api/orders", (req, res) => {
  const {
    userId,
    customerName,
    customerPhone,
    customerAddress,
    productUrl,
    productName,
    productVariant,
    originalPrice,
    checkoutPrice,
    jastipFee,
    totalPayment,
    notes,
    recipientName,
    voucherScenarios
  } = req.body;

  if (!userId || !customerName || !customerPhone || !customerAddress || !productUrl || !productName) {
    return res.status(400).json({ error: "Mohon isi semua data pembeli dan detail produk." });
  }

  const orderId = `order-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder = {
    id: orderId,
    userId,
    customerName,
    customerPhone,
    customerAddress,
    productUrl,
    productName,
    productVariant: productVariant || "Standar (Default)",
    originalPrice: Number(originalPrice),
    checkoutPrice: Number(checkoutPrice),
    jastipFee: Number(jastipFee || 5000),
    totalPayment: Number(totalPayment),
    status: "PENDING",
    notes: notes || "",
    recipientName: recipientName || customerName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chats: [
      {
        id: "chat-init",
        sender: "ai",
        message: `Halo kak ${customerName}! Pengajuan Jastip Shopee Hemat kakak untuk "${productName}" berhasil diterima. AI kami sedang mengoptimalkan voucher Shopee Live / Video untuk orderan kakak. Silakan pantau status pengerjaan atau chat langsung di sini bila ada pertanyaan ya!`,
        timestamp: new Date().toISOString()
      }
    ],
    voucherScenarios: voucherScenarios || []
  };

  db.orders.push(newOrder);
  saveDB();
  res.status(201).json(newOrder);
});

// Admin update status order
app.patch("/api/orders/:id/status", (req, res) => {
  const { status, trackingNumber } = req.body;
  const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order tidak ditemukan" });
  }

  const order = db.orders[orderIndex];
  order.status = status || order.status;
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  order.updatedAt = new Date().toISOString();

  // Add a helper system announcement message
  let statusIndo = "Menunggu pemeriksaan";
  if (status === "APPROVED") statusIndo = "DISETUJUI (Siap Bayar)";
  if (status === "WAITING_PAYMENT") statusIndo = "MENUNGGU PEMBAYARAN KONSUMEN";
  if (status === "PAID") statusIndo = "SUDAH DIBAYAR (Sedang diproses belikan di Shopee oleh tim)";
  if (status === "ORDERED") statusIndo = "PRODUK TELAH DIPESAN DI SHOPEE";
  if (status === "SHIPPED") statusIndo = `SEDANG DIKIRIM (No. Resi: ${trackingNumber || 'Segera update'})`;
  if (status === "COMPLETED") statusIndo = "TRANSAKSI SELESAI (Masukan diterima)";
  if (status === "CANCELLED") statusIndo = "TRANSAKSI DIBATALKAN";

  order.chats.push({
    id: `chat-status-${Date.now()}`,
    sender: "admin",
    message: `[Sistem Jastip] Status pesanan Anda diperbarui ke: ${statusIndo}`,
    timestamp: new Date().toISOString()
  });

  db.orders[orderIndex] = order;
  saveDB();
  res.json(order);
});

// Client/Admin send chat message in order
app.post("/api/orders/:id/chats", async (req, res) => {
  const { sender, message, senderName } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ error: "Sender and message fields are required" });
  }

  const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  const order = db.orders[orderIndex];
  const newChat = {
    id: `chat-${Date.now()}`,
    sender,
    senderName: sender === 'admin' ? (senderName || activeAdmin.name) : undefined,
    message,
    timestamp: new Date().toISOString()
  };

  order.chats.push(newChat);

  // If user sends a chat, let the Gemini AI act as a smart Support Agent answering their queries immediately!
  if (sender === "user") {
    try {
      const historyCtx = order.chats.slice(-10).map(c => `${c.sender}: ${c.message}`).join("\n");
      const systemPrompt = `Anda adalah Customer Support AI dari "Jasa Pembelian Shopee Hemat" (Jastip Hemat).
Aplikasi kami membantu konsumen membeli barang Shopee dengan harga jauh lebih murah menggunakan teknik optimasi voucher ganda, flash sale VIP, Shopee Live 50%, Shopee Video 40%, koin Shopee, dan gratis ongkir kargo tersembunyi.
Informasi Order Saat Ini:
- ID Pesanan: ${order.id}
- Produk: ${order.productName} (Variant: ${order.productVariant})
- Harga Asli Shopee: Rp${order.originalPrice.toLocaleString('id-ID')}
- Harga Optimasi Jastip: Rp${order.checkoutPrice.toLocaleString('id-ID')}
- Fee Jastip: Rp${order.jastipFee.toLocaleString('id-ID')}
- Total Bayar: Rp${order.totalPayment.toLocaleString('id-ID')}
- Status Pesanan: ${order.status}
- Resi Pengiriman: ${order.trackingNumber || 'Belum keluar'}
- Alamat Kirim: ${order.customerAddress} atas nama ${order.recipientName}

Bantulah menjawab pertanyaan dari user dengan ramah, informatif, singkat, santun, dalam Bahasa Indonesia.
Terangkan langkah pembayaran atau rincian penghematan bila ditanya.
Jika status WAITING_PAYMENT atau APPROVED, anjurkan mereka untuk melakukan transfer pembayaran dan konfirmasi di tombol yang disediakan.
Jika status PENDING, jelaskan bahwa tim admin sedang memverifikasi link Shopee produk tersebut dan akan segera mengaktifkan diskon.`;

      const genResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Chat History:\n${historyCtx}\n\nJawablah pesan terakhir user di atas sebagai Customer Support AI:`,
        config: {
          systemInstruction: systemPrompt
        }
      });

      const aiText = genResponse.text || "Halo kak, mohon maaf server kami sibuk sebentar. Tim kami akan segera membantu melayani kakak ya!";
      order.chats.push({
        id: `chat-ai-${Date.now()}`,
        sender: "ai",
        message: aiText,
        timestamp: new Date().toISOString()
      });
    } catch (aiErr) {
      console.error("AI chat reply failed:", aiErr);
      order.chats.push({
        id: `chat-ai-fallback-${Date.now()}`,
        sender: "ai",
        message: "Halo kak, pesan kakak sudah kami terima. Admin kami akan segera mengecek dan merespon pesan kakak secara langsung ya! Terima kasih banyak kabarnya.",
        timestamp: new Date().toISOString()
      });
    }
  }

  order.updatedAt = new Date().toISOString();
  db.orders[orderIndex] = order;
  saveDB();
  res.json(order);
});

// AI Optimization Link Endpoint (Uses Gemini API key)
app.post("/api/optimize-link", async (req, res) => {
  const { shopeeLink, notes } = req.body;
  if (!shopeeLink) {
    return res.status(400).json({ error: "Shopee product link is required." });
  }

  const promptText = `Analyze this Shopee product link: "${shopeeLink}".
Additional Info from User: "${notes || 'Tidak ada catatan tambahan'}"

Role: You are a professional Shopee Checkout Optimization Algorithm.
Task: Evaluate the item based on typical Shopee e-commerce prices, identify potential Shopee vouchers, and make a highly optimized bargain purchasing model.
Find a product name (or create/guess a realistic matching product name in Bahasa Indonesia based on words in the link).
Typical Shopee discount mechanics available:
1. Voucher Toko / Seller Shop (e.g. 5-10% off)
2. Shopee Video Diskon Up to 40% (Max 15k or 25k IDR)
3. Shopee Live Diskon Up to 50% (Max 20k or 30k IDR)
4. Coin Shopee deduction (Up to 10-25% depending on coins)
5. Gratis Ongkir Xtra (Savings of 10k - 30k IDR in shipping fees)

Please invent / extract a matching high-quality original retail price on Shopee (e.g., between Rp 50.000 to Rp 1.500.000) depending on what kind of item is implied in the link.
Calculate the optimized Jastip Price after applying these vouchers. Usually, Jastip is able to save between 30% to 60% off the original price!
Your output MUST be a JSON object conforming exactly to this schema:
{
  "productName": "string representing clean Indonesian name of the product",
  "originalPrice": number_of_rough_original_price_idr,
  "optimizedPrice": number_of_discounted_price_idr,
  "savings": number_of_savings_amount_idr,
  "savingsExplanation": "Detailed step-by-step description in Indonesian explaining exactly how our VIP Buyer account combined multiple vouchers and coupon stacks to cut the price down",
  "vouchersApplied": [
    {
      "name": "Voucher live / video / shop coupon name",
      "savingAmount": number_withdrawn,
      "description": "Short explanation how this specific voucher applies"
    }
  ],
  "jastipFee": number_flat_fee (suggested between 3000 to 15000 depending on item size),
  "totalPayment": number_optimizedPrice_plus_jastipFee,
  "variantOptions": ["Array of short variant strings, e.g. Black - M, White - L, standard"]
}

Output ONLY valid JSON code. Do not wrap in markdown boxes or text block backticks from the generator, start with { and end with }!`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["productName", "originalPrice", "optimizedPrice", "savings", "savingsExplanation", "vouchersApplied", "jastipFee", "totalPayment", "variantOptions"],
          properties: {
            productName: { type: Type.STRING },
            originalPrice: { type: Type.NUMBER },
            optimizedPrice: { type: Type.NUMBER },
            savings: { type: Type.NUMBER },
            savingsExplanation: { type: Type.STRING },
            vouchersApplied: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "savingAmount", "description"],
                properties: {
                  name: { type: Type.STRING },
                  savingAmount: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            jastipFee: { type: Type.NUMBER },
            totalPayment: { type: Type.NUMBER },
            variantOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const optimizationResult = JSON.parse(resultText);

    // Provide a nice default cover photo based on item name category
    let imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"; // generic gadget/backpack
    const lowerName = (optimizationResult.productName || "").toLowerCase();
    
    if (lowerName.includes("baju") || lowerName.includes("kaos") || lowerName.includes("sweater") || lowerName.includes("t-shirt") || lowerName.includes("celana") || lowerName.includes("kemeja") || lowerName.includes("cardigan")) {
      imageUrl = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60";
    } else if (lowerName.includes("sepatu") || lowerName.includes("sandal") || lowerName.includes("sneakers")) {
      imageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60";
    } else if (lowerName.includes("hp") || lowerName.includes("phone") || lowerName.includes("earphone") || lowerName.includes("tws") || lowerName.includes("mouse") || lowerName.includes("keyboard") || lowerName.includes("charger")) {
      imageUrl = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60";
    } else if (lowerName.includes("kosmetik") || lowerName.includes("sunscreen") || lowerName.includes("lipstik") || lowerName.includes("skincare") || lowerName.includes("serum")) {
      imageUrl = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60";
    } else if (lowerName.includes("botol") || lowerName.includes("termos") || lowerName.includes("piring") || lowerName.includes("mug")) {
      imageUrl = "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=500&auto=format&fit=crop&q=60";
    }

    res.json({
      ...optimizationResult,
      imageUrl
    });

  } catch (error) {
    console.error("Link optimization parsing failed:", error);
    // Return a default mock optimization based on link text if Gemini is not set up
    const linkSlug = shopeeLink.split('/').pop() || "Produk Shopee Pilihan";
    const cleanedName = linkSlug
      .replace(/-/g, ' ')
      .replace(/i\.\d+\.\d+/, '')
      .trim();
    const productName = cleanedName ? cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1) : "Produk Jastip Shopee Hemat";
    
    // safe fallback
    const originalPrice = 150000;
    const optimizedPrice = 75000;
    res.json({
      productName,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      originalPrice,
      optimizedPrice,
      savings: 75000,
      savingsExplanation: "Fallback: AI mendeteksi potensi diskon 50% lewat gabungan Voucher Video Kilat & Cashback Shopee Live Xtra. Jasa kami siap memproses pesanan ini menggunakan akun diskon premium dengan aman.",
      vouchersApplied: [
        { name: "Voucher Gabungan Video Xtra", savingAmount: 45000, description: "Potongan harga langsung akun premium" },
        { name: "Promo Flash Live Shopee", savingAmount: 30000, description: "Diskon live diskon jam khusus" }
      ],
      jastipFee: 5000,
      totalPayment: 80000,
      variantOptions: ["Ukuran Standar", "Warna Hitam", "Warna Putih"]
    });
  }
});


// ----------------------------------------------------
// VITE CLIENT AND STATIC FILE SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
