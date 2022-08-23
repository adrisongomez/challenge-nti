import InvoiceController from "@controllers/invoices";
import prisma from "@clients/prisma";
import {
  CreateInvoice,
  CreateLineItem,
  FullInvoice,
  UpdateLineItem,
} from "@controllers/invoices/utils";
import { faker } from "@faker-js/faker";
import { Customer, Product } from "@prisma/client";

describe("InvoiceController integration happy path", () => {
  let controller: InvoiceController;
  let products: Product[];
  let fullInvoice: FullInvoice;
  let customer: Customer;
  beforeAll(async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("User must be created");
    controller = new InvoiceController(prisma, user.email);
  });
  afterAll(() => {
    controller.client.$disconnect();
  });
  beforeEach(async () => {
    const customerResponse = await prisma.customer.findFirst();
    if (!customerResponse) throw new Error("Customer must be created");
    customer = customerResponse;
    products = await prisma.product.findMany();

    const invoicePayload: CreateInvoice = {
      customerId: customer.id,
      pay_type: "CASH",
      notes: faker.lorem.paragraph(1),
      lineItems: [
        {
          productId: products[0].id,
          sell_price: faker.commerce.price(),
          tax: faker.commerce.price(),
          discount_price: faker.commerce.price(),
        },
      ],
    };
    fullInvoice = await controller.create(invoicePayload);
  });
  afterEach(async () => {
    await prisma.invoice.delete({
      where: { id: fullInvoice.id },
      include: { lineItems: true },
    });
  });
  it("should findById an invoice", async () => {
    const invoice = await controller.findById(fullInvoice.id);
    expect(invoice.id).toBeDefined();
    expect(invoice.customer).toBeDefined();
    expect(invoice.lineItems).toHaveLength(1);
    expect(invoice.lineItems[0].product).toBeDefined();
  });
  it("should create an invoice", async () => {
    const invoicePayload: CreateInvoice = {
      customerId: customer.id,
      pay_type: "CASH",
      notes: faker.lorem.paragraph(1),
      lineItems: [
        {
          productId: products[0].id,
          sell_price: faker.commerce.price(),
          tax: faker.commerce.price(),
          discount_price: faker.commerce.price(),
        },
      ],
    };
    const invoice = await controller.create(invoicePayload);
    expect(invoice.id).toBeDefined();
    expect(invoice.customer).toBeDefined();
    expect(invoice.lineItems).toHaveLength(1);
    expect(invoice.lineItems[0].product).toBeDefined();

    await prisma.invoice.delete({
      where: {
        id: invoice.id,
      },
      include: {
        lineItems: true,
      },
    });
  });

  it("should add a lineItem to an invoice", async () => {
    const lineItemPayload: CreateLineItem = {
      productId: products[1].id,
      discount_price: faker.commerce.price(),
      tax: faker.commerce.price(),
      sell_price: faker.commerce.price(),
    };

    const updateInvoice = await controller.update(fullInvoice.id, {
      addLineItem: [lineItemPayload],
    });

    expect(updateInvoice.lineItems).toHaveLength(2);
    expect(updateInvoice.lineItems[1].productId).toBe(
      lineItemPayload.productId
    );
    expect(updateInvoice.lineItems[1].discount_price).toBe(
      lineItemPayload.discount_price
    );
    expect(updateInvoice.lineItems[1].sell_price).toBe(
      lineItemPayload.sell_price
    );
  });

  it("should update a lineItem in a invoice", async () => {
    const lineItemPayload: UpdateLineItem = {
      id: fullInvoice.lineItems[0].id,
      sell_price: faker.commerce.price(),
    };

    const updateInvoice = await controller.update(fullInvoice.id, {
      updateLineItem: [lineItemPayload],
    });

    expect(updateInvoice.lineItems).toHaveLength(1);
    expect(updateInvoice.lineItems[0].discount_price).toBe(
      fullInvoice.lineItems[0].discount_price
    );
    expect(updateInvoice.lineItems[0].sell_price).toBe(
      lineItemPayload.sell_price
    );
  });

  it("should remove a lineItem in a invoice", async () => {
    const lineItemToDelete: string = fullInvoice.lineItems[0].id;

    const updateInvoice = await controller.update(fullInvoice.id, {
      removeLineItem: [lineItemToDelete],
    });

    expect(updateInvoice.lineItems).toHaveLength(0);
  });

  it("should delete an invoice", async () => {
    const response = await controller.delete(fullInvoice.id);
    expect(response).toBe(true);
  });
  it("should list invoices", async () => {
    const invoices = await controller.list();
    expect(invoices).toHaveLength(3);
  });
});
