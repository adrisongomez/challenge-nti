import prisma from "@clients/prisma";
import ProductController from "@controllers/products";
import { CreateProduct } from "@controllers/products/utils";
import { faker } from "@faker-js/faker";
import { Product } from "@prisma/client";

describe("ProductContoller integration happy path", () => {
  let controller: ProductController;
  let product: Product;
  beforeAll(() => {
    controller = new ProductController(prisma);
  });
  afterAll(() => {
    prisma.$disconnect();
  });
  beforeEach(async () => {
    product = await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        cost_price: faker.commerce.price(),
        retail_price: faker.commerce.price(),
        createdBy: "test@example.com",
      },
    });
  });
  afterEach(async () => {
    await prisma.product.delete({
      where: {
        id: product.id,
      },
    });
  });

  it("should findById a product", async () => {
    const response = await controller.findById(product.id.toString());
    expect(response.id).toBe(product.id);
    expect(response.cost_price).toBe(product.cost_price);
  });

  it("should create a product", async () => {
    const payload: CreateProduct = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      cost_price: faker.commerce.price(),
      retail_price: faker.commerce.price(),
    };

    const response = await controller.create(payload);

    expect(response.title).toBe(payload.title);
    expect(response.cost_price).toBe(payload.cost_price);

    await prisma.product.delete({
      where: {
        id: response.id,
      },
    });
  });

  it("should list products", async () => {
    const response = await controller.list({
      title: {
        contains: product.title,
      },
    });
    expect(response).toHaveLength(1)
  });
});
