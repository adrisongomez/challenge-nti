import prisma from "@clients/prisma"
import CustomerCRUDController from "@controllers/customers";
import { Gender } from '@prisma/client'
import { CreateCustomer, UpdateCustomer } from "@controllers/customers/utils";
import { faker } from "@faker-js/faker";
import { Customer } from "@prisma/client";

const createCustomer = (): CreateCustomer => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        gender: "OTHERS",
        address: faker.address.direction(true),
        email: faker.internet.email(),
        personalId: "12345678901",
        phoneNumber: faker.phone.number(),
    };
};
describe("Customer Controller handler", () => {
    let customer: Customer
    let controller: CustomerCRUDController

    beforeAll(() => {
        controller = new CustomerCRUDController(prisma)
    })

    afterAll(() => {
        prisma.$disconnect()
    })


    beforeEach(async () => {
        customer = await prisma.customer.create({
            data: {
                ...createCustomer(),
                createdBy: 'test@example.com'
            }
        })
    })
    afterEach(async () => {
        if (!customer) return
        await prisma.customer.delete({
            where: {
                id: customer.id
            }
        })
    })

    it("should findById", async () => {
        const response = await controller.findById(customer.id)
        expect(response.id).toBe(customer.id)
        expect(response.firstName).toBe(customer.firstName)
    })

    it("should create a customer", async () => {
        const payload: CreateCustomer = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            address: faker.address.secondaryAddress(),
            gender: Gender.OTHERS,
            personalId: '12345678091',
            phoneNumber: faker.phone.number(),
        }

        const response = await controller.create(payload)

        expect(response.id).toBeTruthy()
        expect(response.firstName).toBe(payload.firstName)
        expect(response.lastName).toBe(payload.lastName)
        expect(response.email).toBe(payload.email)

        await prisma.customer.delete({
            where: {
                email: response.email,
            }
        })
    })

    it("should update a customer", async () => {
        const payload: UpdateCustomer = {
            personalId: '12345678091'
        }

        const response = await controller.update(customer.id, payload)

        expect(response.id).toBe(customer.id)
        expect(response.firstName).toBe(customer.firstName)
        expect(response.personalId).toBe(payload.personalId)
    })

    it("should delete a customer", async () => {
        const response = await controller.delete(customer.id)
        expect(response).toBeTruthy()

        const deletedCustomer = await prisma.customer.findUnique({ where: { id: customer.id } })
        if (!deletedCustomer) throw new Error('This should not throw')
        expect(deletedCustomer.down).toBeTruthy()
    })

    it("should lists users", async () => {
        const response = await controller.list({
            firstName: {
                equals: customer.firstName,
            }
        })

        expect(response).toHaveLength(1)
    })
})
