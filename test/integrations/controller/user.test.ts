import prisma from "@clients/prisma"
import UserController from "@controllers/users"
import { CreateUser, UpdateUser } from "@controllers/users/utils"
import { faker } from "@faker-js/faker"
import { User } from "@prisma/client"
import { hash, verifyHash } from "sources/utils/authentication/password"

describe("UserController integration test happy path", () => {
    let controller: UserController
    let user: User
    beforeAll(() => {
        controller = new UserController(prisma)
    })
    beforeEach(async () => {
        user = await prisma.user.create({
            data: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: hash(faker.internet.password()),
                createdBy: 'system',
            }
        })
    })

    afterEach(async () => {
        await prisma.user.delete({
            where: {
                id: user.id
            }
        })
    })

    it('should find an user by id', async () => {
        const findedUser = await controller.findById(user.id)
        expect(findedUser.id).toBe(user.id)
        expect(findedUser.firstName).toBe(user.firstName)
        expect(findedUser.lastName).toBe(user.lastName)
        expect(findedUser.email).toBe(user.email)
    })

    it('should create an user', async () => {
        const payload: CreateUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(8),
        }

        const response = await controller.create(payload)

        expect(response.id).toBeTruthy()
        expect(response.firstName).toBe(payload.firstName)
        expect(response.lastName).toBe(payload.lastName)
        expect(response.email).toBe(payload.email)
        expect(response.createdBy).toBe("system")
        expect(verifyHash(payload.password, response.password)).toBeTruthy()

        await prisma.user.delete({
            where: {
                id: response.id
            }
        })
    })

    it('should delete an user', async () => {
        const response = await controller.delete(user.id)
        expect(response).toBeTruthy()
        const currentUser = await controller.client.user.findUnique({
            where: {
                id: user.id
            }
        })
        if (!currentUser) throw Error('This should fail')
        expect(currentUser.down).toBeTruthy()
    })

    it('should update an user', async () => {
        const firstName = faker.name.firstName()
        const payload: UpdateUser = {
            firstName: faker.name.firstName()
        }
        const response = await controller.update(user.id, payload)
        expect(response.id).toBe(user.id)
        expect(response.firstName).not.toBe(firstName)
    })

    it('should lists users', async () => {

        const response = await controller.list({
            firstName: {
                equals: user.firstName,
            }
        })

        expect(response).toHaveLength(1)
    })
})
