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
  const { refreshToken } = req.body;
  if (!controller) throw new HandlerError("Controller is not initialized");
  try {
    const response = await controller.refreshToken(refreshToken);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(StatusCodes.OK).json({ error: "Not valid accessToken" });
    }
    console.warn(error);
    throw error
  }
};

export default createHandlerWrapper<UserController>({
  onPost,
  controller: new UserController(prisma),
});
