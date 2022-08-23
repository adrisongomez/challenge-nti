import { createUser } from './seeds/users'
import { PrismaClient } from '@prisma/client'
import { createCustomer } from './seeds/customers'
import { createProduct } from './seeds/products'
import { createInvoice } from './seeds/invoices'

const client = new PrismaClient()

const main = async () => {
    console.log('creating users for seed')
    await createUser(client)
    console.log('creating customers for seed')
    await createCustomer(client)
    console.log('creating products for seed')
    await createProduct(client)
    console.log('creating invoices')
    await createInvoice(client)
}

main().catch((error) => {
    console.log(error)
    process.exit(1)
}).finally(() => {
    client.$disconnect()
})
