/**
 * @jest-environment node
 */
import prisma from "@clients/prisma";
import InvoiceController from "@controllers/invoices";
import {
  CreateInvoice,
  FullInvoice,
  UpdateInvoice,
} from "@controllers/invoices/utils";
import { faker } from "@faker-js/faker";
import { Customer, Product } from "@prisma/client";
import httpClient from "@test/httpClient";
import { AxiosResponse } from "axios";
import { StatusCodes } from "http-status-codes";
import { getAccessToken } from "sources/utils/authentication/jwt";

describe("Invoice API integration test", () => {
  let controller: InvoiceController;
  let invoice: FullInvoice;
  let customer: Customer;
  let products: Product[];
  let accessToken: string;
  beforeAll(async () => {
    const result = await prisma.customer.findFirst();
    products = await prisma.product.findMany({ take: 3 });
    if (!result) throw new Error("Customer must exists");
    customer = result;
    if (products.length === 0) throw new Error("Product must exists");
    controller = new InvoiceController(prisma, "test@example.com");
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("User must exists");
    accessToken = `Bearer ${getAccessToken(user)}`;
  });
  afterAll(async () => {
    prisma.$disconnect();
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
    >(`/api/invoices/${invoice.id}`);
    expect(status).toBe(StatusCodes.OK);
    expect(data.id).toBe(invoice.id);
    expect(data.customer).toBeDefined();
    expect(data.lineItems).toBeDefined();
    expect(data.lineItems).toHaveLength(3);
  });

  it("should create an invoice => POST /api/invoice", async () => {
    const payload: CreateInvoice = {
      customerId: customer.id,
      notes: faker.lorem.paragraph(),
      pay_type: "DEBT",
      lineItems: products.map((product) => ({
        productId: product.id,
        discount_price: faker.commerce.price(),
        sell_price: faker.commerce.price(),
        tax: faker.commerce.price(),
      })),
    };
    const { data, status } = await httpClient.post<
      any,
      AxiosResponse<FullInvoice>,
      CreateInvoice
    >("/api/invoices", payload, {
      headers: {
        authorization: accessToken,
      },
    });
    expect(status).toBe(StatusCodes.CREATED);
    expect(data.id).toBeDefined();
    expect(data.customer).toBeDefined();
    expect(data.lineItems).toBeDefined();

    await prisma.invoice.delete({ where: { id: data.id } });
  });

  it("should delete an invoice => DELETE /api/invoice/:id", async () => {
    const { data, status } = await httpClient.delete(
      `/api/invoices/${invoice.id}`,
      {
        headers: {
          authorization: accessToken,
        },
      }
    );
    expect(status).toBe(StatusCodes.OK);
    expect(data).toBeTruthy();
  });

  it("should update an invoice => PUT /api/invoice/:id", async () => {
    const payload: UpdateInvoice = {
      addLineItem: products.map((product) => ({
        productId: product.id,
        tax: faker.commerce.price(),
        sell_price: faker.commerce.price(),
        discount_price: faker.commerce.price(),
      })),
    };
    const { data, status } = await httpClient.put<
      any,
      AxiosResponse<FullInvoice>,
      UpdateInvoice
    >(`/api/invoices/${invoice.id}`, payload, {
      headers: {
        authorization: accessToken,
      },
    });
    expect(status).toBe(StatusCodes.OK);
    expect(data.id).toBe(invoice.id);
    expect(data.lineItems).not.toHaveLength(invoice.lineItems.length);
    expect(data.lineItems).toHaveLength(
      invoice.lineItems.length + products.length
    );
  });
});
