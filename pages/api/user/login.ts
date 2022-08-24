import prisma from "@clients/prisma";
import UserController from "@controllers/users";
import { StatusCodes } from "http-status-codes";
import {
  createHandlerWrapper,
  HandlerError,
  HandlerFunction,
} from "sources/utils/handlerWrapper";

const onPost: HandlerFunction<UserController> = async (
  req,
  res,
  controller
) => {
  if (!controller) throw new HandlerError("Controller not initilized");
  const { email, password } = req.body as { email: string; password: string };
  const response = await controller.login(email, password);
  console.log(response)
  res.status(StatusCodes.OK).json(response);
};

export default createHandlerWrapper<UserController>({
  onPost,
  controller: new UserController(prisma),
});
