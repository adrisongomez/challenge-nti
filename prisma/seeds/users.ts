import { CreateUser } from "../../sources/controllers/users/utils";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import hash from 'object-hash'

const users: CreateUser[] = [{
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: 'example@example.com',
    password: hash('12345678', {algorithm: 'sha1'}),
}]


export const createUser = async (prisma: PrismaClient): Promise<void> => {
    for await (const user of users) {
        await prisma.user.create({
            data: {
                ...user,
                createdBy: 'system'
            }
        })
    }
}
