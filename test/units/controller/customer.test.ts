import CustomerController, { CreateCustomer } from "@controllers/customers"
import { prismaMock } from '@test/mockPrisma'
import { faker } from '@faker-js/faker'
import { Customer } from "@prisma/client"

const createUser = (): CreateCustomer => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        gender: 'OTHERS',
        address: faker.address.direction(true),
        email: faker.internet.email(),
        personalId: faker.datatype.bigInt(10).toString(),
        phoneNumber: faker.phone.number(),
    }
}

describe("Testing CustomerCRUDController happy paths", () => {
    let controller: CustomerController

    beforeEach(() => {
        controller = new CustomerController(prismaMock)
    })

    test("should create a new customers", async () => {
        //assemble
        const customerPayload = createUser()

        prismaMock.customer.create.mockResolvedValue({
            id: faker.datatype.uuid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'user1',
            ...customerPayload,
        } as Customer)

        //action
        const response = await controller.create(customerPayload)

        //assert
        expect(response.id).not.toBeUndefined()
    })

    test("should create and validate user", async () => {
        //assemble
        const customerPayload = createUser()
        customerPayload.email = "test@test.com"
        
        prismaMock.customer.create.mockResolvedValue({
            id: faker.datatype.uuid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'user1',
            ...customerPayload,
        } as Customer)


        //action
        const response = await controller.create(customerPayload)

        //assert
        expect(response.id).not.toBeUndefined()
    })
})
