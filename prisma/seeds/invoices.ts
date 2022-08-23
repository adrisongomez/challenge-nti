import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { CreateInvoice } from "../../sources/controllers/invoices/utils";

const getInvoices = (customerId: string): CreateInvoice[] =>
  Array.from(new Array(2)).map<CreateInvoice>(() => {
    return {
      customerId,
      notes: faker.lorem.paragraph(),
      pay_type: "CASH",
      lineItems: [],
    };
  });

export const createInvoice = async (prisma: PrismaClient) => {
  const customer = await prisma.customer.findFirst();
  if (!customer) {
    console.warn("Not customer created, invoice creation skipped");
    return;
  }

  const products = await prisma.product.findMany({
    take: 2,
  });
  if (products.length === 0) {
    console.warn("Not products created, invoice creation skipped");
    return;
  }
  const invoices: CreateInvoice[] = getInvoices(customer.id);
  for await (const invoice of invoices) {
    const result = await prisma.invoice.create({
      data: {
        customerId: invoice.customerId,
        notes: invoice.notes,
        status: "OPEN",
        pay_type: invoice.pay_type,
        createdBy: "test@example.com",
      },
    });
    for await (const product of products) {
      await prisma.lineItem.create({
        data: {
          invoiceId: result.id,
          productId: product.id,
          product_price: product.retail_price,
          discount_price: faker.commerce.price(),
          tax: faker.commerce.price(),
          sell_price: faker.commerce.price(),
          createdBy: "test@example.com",
        },
      });
    }
  }
};
