import { createUser } from './seeds/users'
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

const main = async () => {
    console.log('creating users for seed')
    await createUser(client)
}

main().catch((error) => {
    console.log(error)
    process.exit(1)
}).finally(() => {
    client.$disconnect()
})
