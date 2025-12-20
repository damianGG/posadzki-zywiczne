// Types for the e-commerce module

export interface ConfiguratorInput {
  area: number; // in m²
  underfloorHeating: boolean;
  antiSlip: 'none' | 'R10';
  color?: string;
}

export interface ConfiguratorResult {
  sku: string;
  type: 'EP' | 'PU';
  bucketSize: number;
  hasR10: boolean;
  color?: string;
  recommendedKit?: ProductKitWithPrice;
}

export interface ProductKitWithPrice {
  id: string;
  sku: string;
  name: string;
  type: string;
  bucketSize: number;
  hasR10: boolean;
  color?: string;
  basePrice: number;
  finalPrice: number;
  description?: string;
}

export interface CartItem {
  productKitId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface OrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerZip: string;
  paymentMethod: 'COD' | 'PRZELEWY24';
  items: {
    productKitId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}
