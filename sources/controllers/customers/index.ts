import { Customer, Gender, Prisma } from "@prisma/client";
import { Controller, CRUDbase } from "@controllers/base";
import { ControllerError } from "@controllers/error";

export type CreateCustomer = {
  firstName: string;
  lastName: string;
  // this could be validate
  email: string;
  address: string;
  gender: Gender;
  // this  could be validate
  phoneNumber: string;
  // this could be validate
  personalId: string;
};

export type UpdateCustomer = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  gender?: Gender;
  phoneNumber?: string;
  personalId?: string;
};

export default class CustomerCRUDController
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
    if (!id) throw new ControllerError();
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
    return this.client.customer.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        address: payload.address,
        phoneNumber: payload.phoneNumber,
        personalId: payload.personalId,
        gender: payload.gender,
        email: payload.email,
        createdBy: "test@test.com",
      },
    });
  }

  async update(id: string, payload: UpdateCustomer): Promise<Customer> {
    return this.client.customer.update({
      where: {
        id: id,
      },
      data: Object.entries(payload)
        .filter(([_, value]) => !!value)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    });
  }

  async delete(id: string): Promise<boolean> {
    const value = await this.client.customer.update({
      where: {
        id,
      },
      data: {
        down: true,
        downBy: "user2",
        downAt: new Date(),
      },
    });
    return !!value.down;
  }

  async list(filter: Prisma.CustomerWhereInput): Promise<Customer[]> {
    return this.client.customer.findMany({
      where: {
        down: {
          not: true,
          ...filter,
        },
      },
    });
  }
}
