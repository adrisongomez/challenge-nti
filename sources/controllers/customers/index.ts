import { Customer, Prisma } from "@prisma/client";
import { Controller, CRUDbase } from "@controllers/base";
import { ControllerError } from "@controllers/error";
import { createCustomer, CreateCustomer, UpdateCustomer } from "./utils";
import { removeUndefined } from "sources/utils/commons";


export default class CustomerController
    extends Controller
    implements
    CRUDbase<
    Customer,
    CreateCustomer,
    UpdateCustomer,
    Prisma.CustomerWhereInput
    >
{
    async findById(id: string): Promise<Customer> {
        if (!id) throw new ControllerError('Id not provide');
        const response = await this.client.customer.findUnique({
            where: {
                id: id,
            },
        });
        if (!response) {
            throw new ControllerError();
        }
        return response;
    }

    async create(payload: CreateCustomer): Promise<Customer> {
        createCustomer.validate(payload)
        return this.client.customer.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                address: payload.address,
                phoneNumber: payload.phoneNumber,
                personalId: payload.personalId,
                gender: payload.gender,
                email: payload.email,
                createdBy: this.user,
            },
        });
    }

    async update(id: string, payload: UpdateCustomer): Promise<Customer> {
        return this.client.customer.update({
            where: {
                id: id,
            },
            data: removeUndefined(payload),
        });
    }

    async delete(id: string): Promise<boolean> {
        const value = await this.client.customer.update({
            where: {
                id,
            },
            data: {
                down: true,
                downBy: this.user,
                downAt: new Date(),
            },
        });
        return !!value.down;
    }

    async list(filter: Prisma.CustomerWhereInput = {}): Promise<Customer[]> {
        return this.client.customer.findMany({
            where: {
                down: {
                    equals: null,
                },
                ...filter,
            },
        });
    }
}
