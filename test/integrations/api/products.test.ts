/**
* @jest-environment node
* */
import prisma from "@clients/prisma";
import ProductController from "@controllers/products";
import { CreateProduct } from "@controllers/products/utils";
import { faker } from "@faker-js/faker";
import { Prisma, Product } from "@prisma/client";
import httpClient from "@test/httpClient";
import { StatusCodes } from "http-status-codes";

const createProduct = (): CreateProduct => ({
  title: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  cost_price: faker.commerce.price(),
  retail_price: faker.commerce.price(),
});
describe("Product Handler Integration Test", () => {
  let controller: ProductController;
  let product: Product;
  beforeAll(() => {
    controller = new ProductController(prisma);
  });

  afterAll(() => {
    prisma.$disconnect();
  });

  beforeEach(async () => {
    product = await controller.create(createProduct());
  });
  afterEach(async () => {
    await prisma.product.delete({
      where: {
        id: product.id,
      },
    });
  });
  it("should list products => GET /api/products", async () => {
    const payload: Prisma.ProductWhereInput = {
      title: {
        equals: product.title,
      },
      description: {
        equals: product.description,
      },
    };

    const { data, status } = await httpClient.get("/api/products", {
      data: payload,
    });
    expect(status).toBe(StatusCodes.OK)
    expect(data).toHaveLength(1);
  });
});
