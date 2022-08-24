import prisma from "@clients/prisma";
import {Prisma} from '@prisma/client'
import CustomerController from "@controllers/customers";
import { CreateCustomer } from "@controllers/customers/utils";
import { StatusCodes } from "http-status-codes";
import {
  createHandlerWrapper,
  HandlerError,
  HandlerFunction,
  HttpMethod,
} from "sources/utils/handlerWrapper";

type CustomerHandler = HandlerFunction<CustomerController>;

const onPost: CustomerHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const payload = req.body as CreateCustomer;
  const customer = await controller.create(payload);
  res.status(StatusCodes.CREATED).json(customer);
};

const onGet: CustomerHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
    const filters = req.body as Prisma.CustomerWhereInput
    const response = await controller.list(filters)
    res.status(StatusCodes.OK).json(response)
}

export default createHandlerWrapper<CustomerController>({
  onGet,
  onPost,
  controller: new CustomerController(prisma),
  secure: [HttpMethod.POST]
});
