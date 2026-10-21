// src/app/models/order-model.ts

export interface OrderItem {
  idProduct?: number; // volitelné, pokud ještě produkt nemá ID v DB
  name: string;
  count: number;
  unit: string; // např. 'kg', 'ks'
}

export interface Order {
  id: string; // unikátní ID objednávky (např. vygenerované UUID)
  customerName: string;
  customerAddress?: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string; // Ukládáme jako ISO string (stejně jako v CV5 localDateIso)
  expectedArrival?: string;
}