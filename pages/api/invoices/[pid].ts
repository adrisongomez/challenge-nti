import prisma from "@clients/prisma";
import InvoiceController from "@controllers/invoices";
import { UpdateInvoice } from "@controllers/invoices/utils";
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

const onDelete: InvoiceHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const id = req.query.pid as string;
  const result = await controller.delete(id);
  res.status(StatusCodes.OK).json(result);
};

const onPut: InvoiceHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const id = req.query.pid as string;
  const payload = req.body as UpdateInvoice;
  const result = await controller.update(id, payload);
  res.status(StatusCodes.OK).json(result);
};

const controller = new InvoiceController(prisma);

export default createHandlerWrapper({
  onGet,
  onDelete,
  onPut,
  controller,
});
