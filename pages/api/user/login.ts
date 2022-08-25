import prisma from "@clients/prisma";
import UserController from "@controllers/users";
import { AuthenticationError } from "@controllers/users/utils";
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
  try {
    if (!controller) throw new HandlerError("Controller not initilized");
    const { email, password } = req.body as { email: string; password: string };
    const response = await controller.login(email, password);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.warn(error);
    if (typeof error === typeof new AuthenticationError()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not valid credentials" });
    }
    throw error;
  }
};

export default createHandlerWrapper<UserController>({
  onPost,
  controller: new UserController(prisma),
});
