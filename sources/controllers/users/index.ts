import { Controller, CRUDbase } from "@controllers/base";
import { ControllerError } from "@controllers/error";
import { Prisma, User } from "@prisma/client";
import { removeUndefined } from "sources/utils/commons";
import {
  AuthenticationError,
  CreateUser,
  LoginResponse,
  UpdateUser,
  userSchema,
} from "./utils";
import {
  getAccessToken,
  getRefreshToken,
} from "sources/utils/authentication/jwt";
import { hash, verifyHash } from "sources/utils/authentication/password";

export default class UserController
  extends Controller
  implements CRUDbase<User, CreateUser, UpdateUser, Prisma.UserWhereInput>
{
  async findById(id: string): Promise<User> {
    if (!id) throw new ControllerError("Id not provide");
    const response = await this.client.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!response) throw new ControllerError();
    return response;
  }

  async create(payload: CreateUser): Promise<User> {
    userSchema.validate(payload);
    return this.client.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hash(payload.password),
        createdBy: this.user,
      },
    });
  }

  async update(id: string, payload: UpdateUser): Promise<User> {
    if (!id) throw new ControllerError("Id not provide");
    return this.client.user.update({
      where: {
        id,
      },
      data: removeUndefined(payload),
    });
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.client.user.update({
      where: {
        id,
      },
      data: {
        down: true,
        downBy: this.user,
        downAt: new Date(),
      },
    });
    return !!response.down;
  }

  async list(filter: Prisma.UserWhereInput = {}) {
    return this.client.user.findMany({
      where: {
        down: {
          equals: null,
        },
        ...filter,
      },
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.findByEmail(email);
    const isValid = verifyHash(password, user.password);
    console.log(isValid);
    // if (!isValid) {
    //   throw new AuthenticationError("User not authorized");
    // }
    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.client.user.findFirst({
      where: {
        email: {
          contains: email,
        },
      },
    });
    if (!user) throw new ControllerError("User not find with email: " + email);
    return user;
  }
}
