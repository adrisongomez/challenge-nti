import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { CreateProduct } from "../../sources/controllers/products/utils";

const products = Array.from(new Array(10)).map<CreateProduct>(() => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    cost_price: faker.commerce.price(),
    retail_price: faker.commerce.price(),
  };
});

export const createProduct = async (prisma: PrismaClient) => {
  for await (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        createdBy: "system",
      },
    });
  }
};
