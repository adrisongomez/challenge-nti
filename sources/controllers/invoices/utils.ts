import {
  Customer,
  Invoice,
  InvoicePayType,
  LineItem,
  Product,
} from "@prisma/client";

export interface FullLineItem extends LineItem {
  product: Product;
}

export interface FullInvoice extends Invoice {
  customer: Customer;
  lineItems: FullLineItem[];
}

export type CreateInvoice = {
  customerId: string;
  notes: string | null;
  pay_type: InvoicePayType;
  lineItems: CreateLineItem[];
};

export type UpdateInvoice = {
  updateLineItem?: UpdateLineItem[];
  removeLineItem?: string[];
  addLineItem?: CreateLineItem[];
};

export type UpdateLineItem = {
  sell_price?: string;
  discount_price?: string;
  tax?: string;
};

export type CreateLineItem = {
  productId: number;
  sell_price: string;
  discount_price: string;
  tax: string;
};
