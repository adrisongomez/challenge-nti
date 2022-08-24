/**
 * @jest-environment node
 */
import prisma from "@clients/prisma";
import InvoiceController from "@controllers/invoices";
import { FullInvoice } from "@controllers/invoices/utils";
import { faker } from "@faker-js/faker";
import { Customer, Product } from "@prisma/client";
import httpClient from "@test/httpClient";
import { AxiosResponse } from "axios";
import { StatusCodes } from "http-status-codes";

describe("Invoice API integration test", () => {
  let controller: InvoiceController;
  let invoice: FullInvoice;
  let customer: Customer;
  let products: Product[];
  beforeAll(async () => {
    const result = await prisma.customer.findFirst();
    products = await prisma.product.findMany({ take: 3 });
    if (!result) throw new Error("Customer must exists");
    customer = result;
    if (products.length === 0) throw new Error("Product must exists");
    controller = new InvoiceController(prisma, "test@example.com");
  });

  beforeEach(async () => {
    invoice = await controller.create({
      customerId: customer.id,
      notes: faker.lorem.paragraph(),
      pay_type: "DEBT",
      lineItems: products.map((product) => ({
        productId: product.id,
        discount_price: faker.commerce.price(),
        sell_price: faker.commerce.price(),
        tax: faker.commerce.price(),
      })),
    });
  });
  afterEach(async () => {
    await prisma.invoice.delete({ where: { id: invoice.id } });
  });

  it("should get an invoice => GET /api/invoice/:id ", async () => {
    const { data, status } = await httpClient.get<
      {},
      AxiosResponse<FullInvoice>
    >(`/invoices/${invoice.id}`);
    expect(status).toBe(StatusCodes.OK);
    expect(data.id).toBe(invoice.id);
  });
});
