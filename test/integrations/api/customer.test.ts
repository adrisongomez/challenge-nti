/**
 * @jest-environment node
 */

import prisma from "@clients/prisma";
import CustomerController from "@controllers/customers";
import { CreateCustomer, UpdateCustomer } from "@controllers/customers/utils";
import { faker } from "@faker-js/faker";
import { Customer } from "@prisma/client";
import httpClient from "@test/httpClient";
import { StatusCodes } from "http-status-codes";
import { getAccessToken } from "sources/utils/authentication/jwt";

const createCustomer = (): CreateCustomer => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    gender: "OTHERS",
    address: faker.address.streetAddress(true),
    email: faker.internet.email(),
    personalId: "11223344556678",
    phoneNumber: faker.phone.number(),
  };
};
describe("Customer CRUD handler happy path", () => {
  let controller: CustomerController;
  let customer: Customer;
  beforeAll(async () => {
    controller = new CustomerController(prisma, "test@example.com");
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("Users must exist");
    const accessToken = `Bearer ${getAccessToken(user)}`;
    const header = {
      authorization: accessToken,
    };
    httpClient.defaults.headers.post = header;
    httpClient.defaults.headers.put = header;
    httpClient.defaults.headers.delete = header;
  });

  afterAll(() => {
    prisma.$disconnect();
  });

  beforeEach(async () => {
    customer = await controller.create(createCustomer());
  });

  afterEach(async () => {
    await prisma.customer.delete({ where: { id: customer.id } });
  });

  it("should get a customer => GET /api/customers/:id", async () => {
    const { data, status } = await httpClient.get(
      `/api/customers/${customer.id}`
    );
    expect(status).toBe(StatusCodes.OK);
    expect(data.id).toBe(customer.id);
  });
  it("should create a customer => POST /api/customers", async () => {
    const payload = {
      ...createCustomer(),
      personalId: "111111111111",
    };
    const { data, status } = await httpClient.post("/api/customers", payload);
    expect(status).toBe(StatusCodes.CREATED);
    expect(data.firstName).toBe(payload.firstName);

    await prisma.customer.delete({ where: { id: data.id } });
  });
  it("should update a customer => PUT /api/customers/:id", async () => {
    const payload: UpdateCustomer = {
      email: faker.internet.email(),
      firstName: undefined,
    };

    const { data, status } = await httpClient.put(
      `/api/customers/${customer.id}`,
      payload
    );
    expect(status).toBe(StatusCodes.OK);
    expect(data.email).toBe(payload.email);
    expect(data.firstName).not.toBeUndefined();
  });
  it("should delete a customer => DELETE /api/customers/:id", async () => {
    const { data, status } = await httpClient.delete(
      `/api/customers/${customer.id}`
    );
    expect(status).toBe(StatusCodes.OK);
    expect(data).toBeTruthy();
  });
  it("should lists customers => GET /api/cusotmers", async () => {
    const { data, status } = await httpClient.get<any, any, any>(
      "/api/customers",
      {
        data: {
          personalId: {
            equals: customer.personalId,
          },
        },
      }
    );
    expect(status).toBe(StatusCodes.OK);
    expect(data).toHaveLength(1);
  });
});
