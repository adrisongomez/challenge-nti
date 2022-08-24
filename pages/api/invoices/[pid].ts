import prisma from "@clients/prisma";
import InvoiceController from "@controllers/invoices";
import { StatusCodes } from "http-status-codes";
import {
  createHandlerWrapper,
  HandlerError,
  HandlerFunction,
} from "sources/utils/handlerWrapper";

type InvoiceHandler = HandlerFunction<InvoiceController>;

const onGet: InvoiceHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const id = req.query.pid as string;
  const invoice = await controller.findById(id);
  res.status(StatusCodes.OK).json(invoice);
};

const onPost: InvoiceHandler = async (req, res, controller) => {};

const controller = new InvoiceController(prisma);

export default createHandlerWrapper({
  onGet,
  onPost,
  controller,
});
