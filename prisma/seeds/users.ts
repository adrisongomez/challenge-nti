import { CreateUser } from "../../sources/controllers/users/utils";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { hash } from "../../sources/utils/authentication/password";

const users: CreateUser[] = [
  {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: "test@example.com",
    password: "12345678",
  },
];

export const createUser = async (prisma: PrismaClient): Promise<void> => {
  for await (const user of users) {
    const userRecord = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (userRecord) continue;
    const  hashPassword = await hash(user.password)
    await prisma.user.create({
      data: {
        ...user,
        password: hashPassword,
        createdBy: "system",
      },
    });
  }
};
