import { faker } from "@faker-js/faker";
import { Gender, PrismaClient } from "@prisma/client";
import { CreateCustomer } from "../../sources/controllers/customers/utils";
const customers: CreateCustomer[] = [
  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    address: faker.address.streetAddress(true),
    email: faker.internet.email(),
    gender: Gender.OTHERS,
    personalId: "12312312312",
    phoneNumber: faker.phone.number(),
  },
  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    address: faker.address.streetAddress(true),
    email: faker.internet.email(),
    gender: Gender.OTHERS,
    personalId: "12312312313",
    phoneNumber: faker.phone.number(),
  },
];

export const createCustomer = async (prisma: PrismaClient): Promise<void> => {
  for await (const customer of customers) {
    const customerRecord = await prisma.customer.findUnique({
      where: { personalId: customer.personalId },
    });
    if (customerRecord) continue;
    await prisma.customer.create({
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        email: customer.email,
        personalId: customer.personalId,
        phoneNumber: customer.phoneNumber,
        createdBy: "system",
      },
    });
  }
};
