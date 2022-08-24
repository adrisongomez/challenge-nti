/**
 * @jest-environment node
 * */
import prisma from "@clients/prisma";
import UserController from "@controllers/users";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { getRefreshToken } from "sources/utils/authentication/jwt";

axios.defaults.baseURL = "http://localhost:3000/";

jest.setTimeout(10000);

describe("User Handlers", () => {
  let controller: UserController;
  let user: User;
  beforeAll(() => {
    controller = new UserController(prisma);
  });
  let password: string;
  afterAll(async () => {
    await prisma.$disconnect();
  });
  beforeEach(async () => {
    password = faker.internet.password();
    user = await controller.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: password,
    });
  });
  afterEach(async () => {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });

  it("should login an user email and password, return access_token and refresh_token => POST /api/user/login", async () => {
    const { data, status } = await axios.post("/api/user/login", {
      email: user.email,
      password,
    });
    expect(status).toBe(StatusCodes.OK);
    expect(data.accessToken).toBeDefined();
    expect(data.refreshToken).toBeDefined();
  });

  it("should error on invalid email and password => POST /api/user/login", async () => {
    try {
      await axios.post("/api/user/login", {
        email: user.email,
        password: `password123`,
      });
      expect(0).toBe(1);
    } catch (error: any) {
      expect(error.response.status).toBe(StatusCodes.FORBIDDEN);
      expect(error.response.data.error).toBe("Not valid credentials");
    }
  });

  it("should refresh an access_token => POST /api/user/token", async () => {
    const refreshToken = getRefreshToken({
            id: user.id,
            email: user.email,
            firstName: user.firstName
        } as User);
    const { data, status } = await axios.post("/api/user/token", {
      refreshToken,
    });
    expect(status).toBe(StatusCodes.OK);
    expect(data.accessToken).toBeDefined();
  });
});
