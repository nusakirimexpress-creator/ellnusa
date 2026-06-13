export interface ShopeeProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  imageUrl: string;
  shopeeLink: string;
  rating: number;
  salesCount: number;
  category: string;
  description: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'WAITING_PAYMENT'
  | 'PAID'
  | 'ORDERED'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface JastipChat {
  id: string;
  sender: 'user' | 'admin' | 'ai';
  senderName?: string;
  message: string;
  timestamp: string;
}

export interface JastipOrder {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productUrl: string;
  productName: string;
  productVariant: string;
  originalPrice: number;
  checkoutPrice: number;
  jastipFee: number;
  totalPayment: number;
  status: OrderStatus;
  notes: string;
  recipientName: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  chats: JastipChat[];
  voucherScenarios?: {
    name: string;
    savingAmount: number;
    description: string;
  }[];
}

export interface OptimizationResult {
  productName: string;
  imageUrl?: string;
  originalPrice: number;
  optimizedPrice: number;
  savings: number;
  savingsExplanation: string;
  vouchersApplied: {
    name: string;
    savingAmount: number;
    description: string;
  }[];
  jastipFee: number;
  totalPayment: number;
  variantOptions: string[];
}
