import InvoiceController from "@controllers/invoices";
import {
  CreateInvoice,
  CreateLineItem,
  UpdateInvoice,
  UpdateLineItem,
} from "@controllers/invoices/utils";
import { faker } from "@faker-js/faker";
import { Customer, Invoice, LineItem, Prisma, Product } from "@prisma/client";
import { prismaMock } from "@test/mockPrisma";

describe("InvoiceController unit happy path", () => {
  let controller: InvoiceController;
  beforeAll(() => {
    controller = new InvoiceController(prismaMock);
  });
  it("should create an invoice and its line item", async () => {
    const lineItemPayload: CreateLineItem = {
      productId: 1,
      discount_price: "20.00",
      sell_price: "50.00",
      tax: "40.00",
    };

    const payload: CreateInvoice = {
      customerId: "this-is-the-first-customer",
      notes: "This is a note or description for invoice",
      pay_type: "CASH",
      lineItems: [lineItemPayload],
    };

    prismaMock.invoice.create.mockResolvedValue({
      id: "invoiceId",
      pay_type: payload.pay_type,
      customerId: payload.customerId,
      status: "OPEN",
      notes: payload.notes,
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    });
    prismaMock.lineItem.create.mockResolvedValue({
      id: faker.datatype.uuid(),
      productId: lineItemPayload.productId,
      product_price: faker.commerce.price(),
      sell_price: lineItemPayload.sell_price,
      tax: lineItemPayload.tax,
      discount_price: lineItemPayload.discount_price,
      invoiceId: "invoiceId",
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    });
    prismaMock.product.findUnique.mockResolvedValue({
      id: lineItemPayload.productId,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      cost_price: faker.commerce.price(),
      retail_price: faker.commerce.price(),
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    });
    prismaMock.customer.findUnique.mockResolvedValue({} as Customer);

    const response = await controller.create(payload);

    expect(response.id).toBe("invoiceId");
    expect(response.customer).toBeDefined();
    expect(response.lineItems).toHaveLength(1);
    expect(response.lineItems[0].product).toBeDefined();
    expect(response.lineItems[0].product.title).toBeDefined();
  });

  it("should find an invoice from id", async () => {
    const invoiceId = faker.datatype.uuid();
    prismaMock.invoice.findFirst.mockResolvedValue({
      id: invoiceId,
      customerId: faker.datatype.uuid(),
      notes: "This is a note",
      status: "CLOSE",
      pay_type: "CASH",
      customer: {} as Customer,
      lineItems: [
        {
          productId: 1,
          product: {} as Product,
          product_price: faker.commerce.price(),
          sell_price: faker.commerce.price(),
          tax: faker.commerce.price(),
          discount_price: faker.commerce.price(),
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          down: null,
          downAt: new Date(),
          downBy: null,
        },
      ],
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    } as Invoice);
    prismaMock.product.findUnique.mockResolvedValue({} as Product);

    const response = await controller.findById(invoiceId);

    expect(response.id).toBe(invoiceId);
    expect(response.customer).toBeDefined();
    expect(response.lineItems).toHaveLength(1);
    expect(response.lineItems[0].product).toBeDefined();
  });

  it("should add a lineItem to an invoice", async () => {
    const invoiceId = faker.datatype.uuid();
    const lineItemPayload: CreateLineItem = {
      productId: 1,
      sell_price: "200.00",
      tax: "0.00",
      discount_price: "20.00",
    };
    const payload: UpdateInvoice = {
      addLineItem: [lineItemPayload],
    };
    prismaMock.invoice.findFirst.mockResolvedValue({
      id: invoiceId,
      customerId: faker.datatype.uuid(),
      notes: "This is a note",
      status: "CLOSE",
      pay_type: "CASH",
      customer: {} as Customer,
      lineItems: [
        {
          productId: 1,
          product: {} as Product,
          product_price: faker.commerce.price(),
          sell_price: faker.commerce.price(),
          tax: faker.commerce.price(),
          discount_price: faker.commerce.price(),
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          down: null,
          downAt: new Date(),
          downBy: null,
        },
      ],
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    } as Invoice);
    prismaMock.product.findUnique.mockResolvedValue({
      id: 1,
      product_price: faker.commerce.price(),
    } as unknown as Product);
    prismaMock.lineItem.create.mockResolvedValue({
      id: invoiceId,
      ...lineItemPayload,
    } as LineItem);
    const response = await controller.update(invoiceId, payload);
    expect(response.id).toBe(invoiceId);
    expect(response.lineItems).toHaveLength(1);
    expect(response.customer).toBeDefined();
  });
  it("should update a lineItem to an invoice", async () => {
    const invoiceId = faker.datatype.uuid();
    const lineItemPayload: UpdateLineItem = {
      id: faker.datatype.uuid(),
      sell_price: faker.commerce.price(),
    };

    prismaMock.product.findUnique.mockResolvedValue({
      id: 1,
      product_price: faker.commerce.price(),
    } as unknown as Product);
    prismaMock.lineItem.update.mockResolvedValue({
      ...lineItemPayload,
    } as LineItem);
    prismaMock.invoice.findFirst.mockResolvedValue({
      id: invoiceId,
      customerId: faker.datatype.uuid(),
      notes: "This is a note",
      status: "CLOSE",
      pay_type: "CASH",
      customer: {} as Customer,
      lineItems: [
        {
          productId: 1,
          product: {} as Product,
          product_price: faker.commerce.price(),
          sell_price: lineItemPayload.sell_price,
          tax: faker.commerce.price(),
          discount_price: faker.commerce.price(),
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          down: null,
          downAt: new Date(),
          downBy: null,
        },
      ],
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    } as Invoice);
    const response = await controller.update(invoiceId, {
      updateLineItem: [lineItemPayload],
    });
    expect(prismaMock.lineItem.update).toBeCalled();
    expect(prismaMock.product.findUnique).toBeCalled();
    expect(response.id).toBe(invoiceId);
    expect(response.lineItems).toHaveLength(1);
    expect(response.lineItems[0].sell_price).toBe(lineItemPayload.sell_price);
  });

  it("should delete a lineItem from an invoice", async () => {
    const removeLineItems: string[] = [faker.datatype.uuid()];
    const invoiceId = faker.datatype.uuid();
    prismaMock.product.findUnique.mockResolvedValue({
      id: 1,
      product_price: faker.commerce.price(),
    } as unknown as Product);
    prismaMock.lineItem.delete.mockResolvedValue({} as LineItem);
    prismaMock.invoice.findFirst.mockResolvedValue({
      id: invoiceId,
      customerId: faker.datatype.uuid(),
      notes: "This is a note",
      status: "CLOSE",
      pay_type: "CASH",
      customer: {} as Customer,
      lineItems: [],
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    } as Invoice);
    const response = await controller.update(invoiceId, {
      removeLineItem: removeLineItems,
    });
    expect(prismaMock.lineItem.delete).toBeCalled();
    expect(response.id).toBe(invoiceId);
    expect(response.lineItems).toHaveLength(0);
  });

  it("should delete an invoice", async () => {
    const invoiceId = faker.datatype.uuid();
    prismaMock.invoice.update.mockResolvedValue({
      lineItems: [{ id: faker.datatype.uuid() } as LineItem],
      down: true,
      downAt: new Date(),
      downBy: "system",
    } as Invoice & { lineItems: LineItem[] });
    prismaMock.lineItem.update.mockResolvedValue({} as LineItem);

    const response = await controller.delete(invoiceId);
    expect(prismaMock.invoice.update).toBeCalled();
    expect(response).toBe(true);
  });

  it("should lists invoices", async () => {
    const filters: Prisma.InvoiceWhereInput = {
      AND: [
        {
          createdAt: {
            gte: new Date(),
          },
        },
        {
          createdAt: {
            lte: new Date(),
          },
        },
      ],
    };
    prismaMock.invoice.findMany.mockResolvedValue([
      { id: faker.datatype.uuid() } as Invoice,
      { id: faker.datatype.uuid() } as Invoice,
    ]);
    prismaMock.invoice.findFirst.mockResolvedValue({
      id: faker.datatype.uuid(),
      customerId: faker.datatype.uuid(),
      notes: "This is a note",
      status: "CLOSE",
      pay_type: "CASH",
      customer: {} as Customer,
      lineItems: [
        {
          productId: 1,
          product: {} as Product,
          product_price: faker.commerce.price(),
          sell_price: faker.commerce.price(),
          tax: faker.commerce.price(),
          discount_price: faker.commerce.price(),
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          down: null,
          downAt: new Date(),
          downBy: null,
        },
      ],
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      down: null,
      downAt: new Date(),
      downBy: null,
    } as Invoice);
    prismaMock.product.findUnique.mockResolvedValue({} as Product);

    const response = await controller.list(filters);

    expect(response).toHaveLength(2);
  });
});
