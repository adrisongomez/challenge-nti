import prisma from "@clients/prisma";
import ProductController from "@controllers/products";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  createHandlerWrapper,
  HandlerError,
  HandlerFunction,
} from "sources/utils/handlerWrapper";

const onGet: HandlerFunction<ProductController> = async (
  req,
  res,
  controller
) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const payload = req.body as Prisma.ProductWhereInput;
  const response = await controller.list(payload);
  res.status(StatusCodes.OK).json(response);
};

export default createHandlerWrapper<ProductController>({
  onGet,
  controller: new ProductController(prisma),
});
