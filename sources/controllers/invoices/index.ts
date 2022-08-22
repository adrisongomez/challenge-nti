import { CRUDbase, Controller } from "@controllers/base";
import CustomerController from "@controllers/customers";
import { ControllerError } from "@controllers/error";
import ProductController from "@controllers/products";
import { PrismaClient } from "@prisma/client";
import {
  CreateInvoice,
  CreateLineItem,
  FullInvoice,
  FullLineItem,
  UpdateInvoice,
} from "./utils";

export default class InvoiceController
  extends Controller
  implements CRUDbase<FullInvoice, CreateInvoice, UpdateInvoice>
{
  private productController: ProductController;
  private customerController: CustomerController;
  constructor(client: PrismaClient, user: string = "system") {
    super(client, user);
    this.productController = new ProductController(this.client, this.user);
    this.customerController = new CustomerController(this.client, this.user);
  }
  async findById(id: string): Promise<FullInvoice> {
    if (!id) throw new ControllerError("ID is not defined");
    const invoice = await this.client.invoice.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        lineItems: true,
      },
    });
    if (!invoice) throw new ControllerError("Resource not found");
    const lineItems: FullLineItem[] = await Promise.all(
      invoice.lineItems.map(async (value) => {
        const product = await this.client.product.findUnique({
          where: {
            id: value.productId,
          },
        });
        if (!product)
          throw new ControllerError(`Product ${value.productId} don't exists`);
        return {
          ...value,
          product,
        };
      })
    );
    const response: FullInvoice = {
      ...invoice,
      lineItems,
    };
    return response;
  }
  async create(payload: CreateInvoice): Promise<FullInvoice> {
    const { lineItems: lineItemsInput } = payload;
    const customer = await this.customerController.findById(payload.customerId);
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
      lineItemsInput.map<Promise<FullLineItem>>(
        ((value: CreateLineItem) =>
          this.createLineItem({ value, invoiceId: invoice.id })).bind(this)
      )
    );
    return {
      ...invoice,
      customer,
      lineItems,
    };
  }

  async update(id: string, payload: UpdateInvoice): Promise<FullInvoice> {
    if (payload?.addLineItem) {
      const updateCallback = (value: CreateLineItem) =>
        this.createLineItem({ value, invoiceId: id });
      const promises = payload.addLineItem.map(updateCallback.bind(this));
      await Promise.all(promises);
    }
    if (payload?.updateLineItem) {
    }
    if (payload?.removeLineItem) {
    }

    return this.findById(id);
  }

  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  list(filter?: {}): Promise<FullInvoice[]> {
    throw new Error("Method not implemented.");
  }

  private async createLineItem({
    value,
    invoiceId,
  }: {
    value: CreateLineItem;
    invoiceId: string;
  }): Promise<FullLineItem> {
    const product = await this.productController.findById(
      value.productId.toString()
    );
    const result = await this.client.lineItem.create({
      data: {
        invoiceId: invoiceId,
        productId: value.productId,
        discount_price: value.discount_price,
        sell_price: value.sell_price,
        product_price: product.retail_price,
        tax: value.tax,
        createdBy: this.user,
      },
    });
    return {
      ...result,
      product,
    };
  }
}
