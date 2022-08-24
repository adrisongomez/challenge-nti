import prisma from "@clients/prisma";
import InvoiceController from "@controllers/invoices";
import { CreateInvoice } from "@controllers/invoices/utils";
import { StatusCodes } from "http-status-codes";
import {
  createHandlerWrapper,
  HandlerError,
  HandlerFunction,
} from "sources/utils/handlerWrapper";

type InvoiceHandler = HandlerFunction<InvoiceController>;

const onPost: InvoiceHandler = async (req, res, controller) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const payload = req.body as CreateInvoice;
  const invoice = await controller.create(payload);
  res.status(StatusCodes.CREATED).json(invoice);
};

const controller = new InvoiceController(prisma);

export default createHandlerWrapper({
  onPost,
  controller,
});
