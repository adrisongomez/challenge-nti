import { prismaMock } from "@test/mockPrisma";
import ProductController from "@controllers/products";
import { CreateProduct, UpdateProduct } from "@controllers/products/utils";
import { faker } from "@faker-js/faker";
import { Product } from "@prisma/client";

const createProduct = (): CreateProduct => ({
  title: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  cost_price: faker.commerce.price(),
  retail_price: faker.commerce.price(),
});

describe("ProductController units happy path", () => {
  let controller: ProductController;
  beforeAll(() => {
    controller = new ProductController(prismaMock);
  });
  it("should findById a product", async () => {
    const product = {
      id: faker.datatype.uuid(),
      ...createProduct(),
      createdAt: new Date(),
    };
    prismaMock.product.findUnique.mockResolvedValue(
      product as unknown as Product
    );

    const response = await controller.findById(product.id);

    expect(prismaMock.product.findUnique).toBeCalled();
    expect(response.id).toBe(product.id);
  });

  it("should create a product", async () => {
    const id = faker.datatype.uuid();
    const payload = createProduct();
    prismaMock.product.create.mockResolvedValue({
      id,
      ...payload,
    } as unknown as Product);

    const response = await controller.create(payload);

    expect(prismaMock.product.create).toBeCalled();
    expect(response.id).toBe(id);
    expect(response.title).toBe(payload.title);
  });

  it("should update a product", async () => {
    const id = faker.datatype.uuid();
    const payload: UpdateProduct = {
      title: faker.commerce.product(),
    };
    prismaMock.product.update.mockResolvedValue({
      id,
      ...createProduct(),
      ...payload,
    } as unknown as Product);

    const response = await controller.update(id, payload);

    expect(prismaMock.product.update).toBeCalled();
    expect(response.id).toBe(id);
    expect(response.title).toBe(payload.title);
  });

  it("should delete a product", async () => {
    const id = faker.datatype.uuid();
    prismaMock.product.update.mockResolvedValue({
      id,
      ...createProduct(),
      down: true,
    } as unknown as Product);

    const response = await controller.delete(id);

    expect(prismaMock.product.update).toBeCalled();
    expect(response).toBeTruthy();
  });

  it("should list products", async () => {
    const result: Product[] = [
      { id: 1, ...createProduct() } as Product,
      { id: 2, ...createProduct() } as Product,
    ];

    prismaMock.product.findMany.mockResolvedValue(result)

    const response = await controller.list({})

    expect(prismaMock.product.findMany).toBeCalled()
    expect(response).toHaveLength(2)
  });
});
