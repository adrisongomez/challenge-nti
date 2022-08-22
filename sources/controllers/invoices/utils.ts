import {
  Invoice,
  InvoicePayType,
  InvoiceStatus,
  LineItem,
} from "@prisma/client";

export interface FullInvoice extends Invoice {
  lineItems: LineItem[];
}

export type CreateInvoice = {
  customerId: string;
  notes: string | null;
  pay_type: InvoicePayType;
  lineItems: CreateLineItem[];
};

export type CreateLineItem = {
  productId: number;
  product_price: string;
  sell_price: string;
  discount_price: string;
  tax: string;
};
