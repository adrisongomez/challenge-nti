import prisma from "@clients/prisma";
import CustomerController from "@controllers/customers";
import { UpdateCustomer } from "@controllers/customers/utils";
import { StatusCodes } from "http-status-codes";
import {
  createHandlerWrapper,
  HandlerError,
  HandlerFunction,
} from "sources/utils/handlerWrapper";

type CustomerHandler = HandlerFunction<CustomerController>;

const onGet: CustomerHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const id = req.query.id as string;
  const customer = await controller.findById(id);
  res.status(StatusCodes.OK).json(customer);
};

const onPut: CustomerHandler = async (req, res, controller ) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const id = req.query.id as string;
  const payload = req.body as UpdateCustomer;
  const customer = await controller.update(id, payload)
  res.status(StatusCodes.OK).json(customer)
}

const onDelete: CustomerHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const id = req.query.id as string;
  const response = await controller.delete(id)
  res.status(StatusCodes.OK).json(response)
}

export default createHandlerWrapper<CustomerController>({
  onGet,
  onPut,
  onDelete,
  controller: new CustomerController(prisma),
});
