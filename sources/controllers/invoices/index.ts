import { CRUDbase, Controller } from "@controllers/base";
import { Invoice, LineItem, Prisma } from "@prisma/client";
import { CreateInvoice, CreateLineItem, FullInvoice } from "./utils";

export default class InvoiceController
  extends Controller
  implements CRUDbase<FullInvoice, CreateInvoice>
{
  findById(id: string): Promise<FullInvoice> {
    throw new Error("Method not implemented.");
  }
  async create(payload: CreateInvoice): Promise<FullInvoice> {
    const { lineItems: lineItemsInput } = payload;
    const invoice = await this.client.invoice.create({
      data: {
        pay_type: payload.pay_type,
        status: "OPEN",
        customerId: payload.customerId,
        notes: payload.notes,
        createdBy: this.user,
      },
    });
    const lineItems = await Promise.all(
      lineItemsInput.map<Promise<LineItem>>(
        (async (value: CreateLineItem) => {
          const response = await this.client.lineItem.create({
            data: {
              invoiceId: invoice.id,
              productId: value.productId,
              discount_price: value.discount_price,
              sell_price: value.sell_price,
              product_price: value.discount_price,
              tax: value.tax,
              createdBy: this.user,
            },
          });
          return response;
        }).bind(this)
      )
    );
    return {
      ...invoice,
      lineItems: lineItems,
    };
  }
  update(id: string, payload: {}): Promise<FullInvoice> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  list(filter?: {}): Promise<FullInvoice[]> {
    throw new Error("Method not implemented.");
  }
}
