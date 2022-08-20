import { Customer, Gender } from '@prisma/client';
import { Controller, CRUDbase } from '@controllers/base'

export type CreateCustomer = {
    firstName: string,
    lastName: string,
    // this could be validate
    email: string,
    address: string,
    gender: Gender,
    // this  could be validate
    phoneNumber: string,
    // this could be validate
    personalId: string,

}

export default class CustomerCRUDController extends Controller implements CRUDbase<Customer, CreateCustomer> {

    async findById(id: string): Promise<Customer> {
        throw new Error('Method not implemented.');
    }

    async create(payload: CreateCustomer): Promise<Customer> {
        return this.client.customer.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                address: payload.address,
                phoneNumber: payload.phoneNumber,
                personalId: payload.personalId,
                gender: payload.gender,
                email: payload.email,
                createdBy: 'test@test.com',
            }
        })
    }

    async update(id: string, payload: {}): Promise<Customer> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async find(filters: any): Promise<Customer[]> {
        throw new Error('Method not implemented.');
    }
}
