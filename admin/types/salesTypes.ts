export interface OrderDetail {
  id: string;
  price: {
    id: string;
    type: string;
    active: boolean;
    object: string;
    created: number;
    product: string;
    currency: string;
    livemode: boolean;
    metadata: Record<string, any>;
    nickname: null | string;
    recurring: null | any;
    lookup_key: null | string;
    tiers_mode: null | string;
    unit_amount: number;
    tax_behavior: string;
    billing_scheme: string;
    custom_unit_amount: null | any;
    transform_quantity: null | any;
    unit_amount_decimal: string;
  };
  object: string;
  currency: string;
  quantity: number;
  amount_tax: number;
  description: string;
  amount_total: number;
  amount_discount: number;
  amount_subtotal: number;
}

export interface Order {
  id: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  orderDetails: OrderDetail[];
}

export interface DailySales {
  [date: string]: number;
}

export interface ProductSales {
  [productName: string]: number;
}
