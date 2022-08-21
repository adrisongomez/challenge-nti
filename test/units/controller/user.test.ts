import UserController from '@controllers/users'
import { prismaMock } from '@test/mockPrisma'
import { faker } from '@faker-js/faker'
import { CreateUser } from '@controllers/users/utils'
import { User } from '@prisma/client'

const createUser = (): CreateUser => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(10),
})

describe('UserController unit test happy path', () => {
    let controller: UserController;

    beforeEach(() => {
        controller = new UserController(prismaMock)
    })

    it('should find an user', async () => {
        const id = faker.datatype.uuid()
        const user = {
            id,
            ...createUser()
        }

        prismaMock.user.findUnique.mockResolvedValue(user as User)

        const response = await controller.findById(id)

        expect(response.id).toBe(id)
        expect(response.firstName).toBe(user.firstName)
    })

    it('should create an user', async () => {
        const payload = createUser()
        prismaMock.user.create.mockResolvedValue({
            id: faker.datatype.uuid(),
            ...payload
        } as User)

        const response = await controller.create(payload)

        expect(response.id).not.toBeUndefined()
        expect(response.firstName).toBe(payload.firstName)
        expect(response.lastName).toBe(payload.lastName)
    })

    it('should update an user', async () => {
        const id = faker.datatype.uuid()
        const user = createUser()
        prismaMock.user.update.mockResolvedValue({ id, ...user } as User)

        const response = await controller.update(id, user)

        expect(response.id).toBe(id)
        expect(response.firstName).toStrictEqual(user.firstName)
    })

    it('should delete an user', async () => {
        const id = faker.datatype.uuid();
        prismaMock.user.update.mockResolvedValue({ ...createUser(), down: true } as User)
        const response = await controller.delete(id)
        expect(response).toBeTruthy()
    })

    it('should list users', async () => {
        const filters = {}
        prismaMock.user.findMany.mockResolvedValue([createUser() as User, createUser() as User])
        const response = await controller.list(filters)
        expect(response).toHaveLength(2)
    })
})
