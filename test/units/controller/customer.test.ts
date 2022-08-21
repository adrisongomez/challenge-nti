import CustomerController, { CreateCustomer } from "@controllers/customers";
import { prismaMock } from "@test/mockPrisma";
import { faker } from "@faker-js/faker";
import { Customer } from "@prisma/client";

const createUser = (): CreateCustomer => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    gender: "OTHERS",
    address: faker.address.direction(true),
    email: faker.internet.email(),
    personalId: faker.datatype.bigInt(10).toString(),
    phoneNumber: faker.phone.number(),
  };
};

describe("Testing CustomerCRUDController happy paths", () => {
  let controller: CustomerController;

  beforeEach(() => {
    controller = new CustomerController(prismaMock);
  });

  test("should create a new customers", async () => {
    //assemble
    const customerPayload = createUser();

    prismaMock.customer.create.mockResolvedValue({
      id: faker.datatype.uuid(),
      createdAt: new Date(),
      createdBy: "user1",
      updatedAt: new Date(),
      ...customerPayload,
    } as Customer);

    //action
    const response = await controller.create(customerPayload);

    //assert
    expect(response.id).not.toBeUndefined();
  });

  test("should find an user by id", async () => {
    // assemble
    const id = faker.datatype.uuid();

    prismaMock.customer.findUnique.mockResolvedValue({
      id: faker.datatype.uuid(),
      createdAt: new Date(),
      createdBy: "user1",
      updatedAt: new Date(),
      ...createUser(),
      down: false,
      downAt: null,
      downBy: null,
    });

    // action
    const response = await controller.findById(id);

    // assert
    expect(response).not.toBeUndefined();
  });

  test("should update an user by id", async () => {
    // assmeble
    const id = faker.datatype.uuid();
    const mockResponse: Customer = {
      id,
      createdAt: new Date(),
      createdBy: "user1",
      updatedAt: new Date(),
      ...createUser(),
      down: false,
      downAt: null,
      downBy: null,
    };
    const payload = {
      firstName: faker.name.firstName(),
    };
    prismaMock.customer.update.mockResolvedValue({
      ...mockResponse,
      firstName: payload.firstName,
    });

    // action
    const response = await controller.update(id, payload);

    // assert
    expect(response.id).not.toBeUndefined();
    expect(response.firstName).toBe(payload.firstName);
    expect(prismaMock.customer.update).toBeCalled();
  });

  test("should delete record", async () => {
    // assemble
    const id = faker.datatype.uuid();
    const mockResponse: Customer = {
      id,
      createdAt: new Date(),
      createdBy: "user1",
      updatedAt: new Date(),
      ...createUser(),
      down: true,
      downAt: new Date(),
      downBy: "user1",
    };

    prismaMock.customer.update.mockResolvedValue(mockResponse);

    const response = await controller.delete(id);

    expect(response).toBeTruthy();
  });

  test("should list record", async () => {
    const mockResponse: Customer[] = [
      {
        id: faker.datatype.uuid(),
        createdAt: new Date(),
        createdBy: "user1",
        updatedAt: new Date(),
        ...createUser(),
        down: true,
        downAt: new Date(),
        downBy: "user1",
      },
    ];

    prismaMock.customer.findMany.mockResolvedValue(mockResponse);

    const response = await controller.list();
    expect(response).toHaveLength(1);
  });
});
