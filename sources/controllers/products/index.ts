import { CRUDbase, Controller } from "@controllers/base";
import { ControllerError } from "@controllers/error";
import { Prisma, Product } from "@prisma/client";
import { removeUndefined } from "sources/utils/commons";
import { CreateProduct, productSchema } from "./utils";

export default class ProductController
  extends Controller
  implements CRUDbase<Product, CreateProduct, Prisma.ProductWhereInput>
{
  async findById(id: string): Promise<Product> {
    if (!id) throw new ControllerError("Id no provider");
    const response = await this.client.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!response) throw new ControllerError("Record not found");
    return response;
  }
  create(payload: CreateProduct): Promise<Product> {
    productSchema.validate(payload);
    return this.client.product.create({
      data: {
        title: payload.title,
        description: payload.description,
        retail_price: payload.retail_price,
        cost_price: payload.cost_price,
        createdBy: this.user,
      },
    });
  }
  async update(id: string, payload: {}): Promise<Product> {
    return this.client.product.update({
      where: {
        id: parseInt(id),
      },
      data: removeUndefined(payload),
    });
  }
  async delete(id: string): Promise<boolean> {
    const response = await this.client.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        down: true,
        downAt: new Date(),
        downBy: this.user,
      },
    });
    return !!response.down
  }
  async list(filter: Prisma.ProductWhereInput = {}): Promise<Product[]> {
    return this.client.product.findMany({
        where: {
            down: {
                equals: null,
            },
            ...filter
        }
    })
  }
}
