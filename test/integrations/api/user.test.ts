/**
* @jest-environment node
* */
import prisma from "@clients/prisma";
import UserController from "@controllers/users";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import axios from "axios";
import { StatusCodes } from "http-status-codes";

axios.defaults.baseURL = "http://localhost:3000/";

describe("User Handlers", () => {
  let controller: UserController;
  let user: User;
  beforeAll(() => {
    controller = new UserController(prisma);
  });
  afterAll(() => {
    prisma.$disconnect();
  });
  beforeEach(async () => {
    user = await controller.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
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
      password: user.password,
    });
    expect(status).toBe(StatusCodes.OK)
    expect(data.accessToken).toBeDefined()
    expect(data.refreshToken).toBeDefined()
  });
  it.todo("should error on invalid email and password => POST /api/user/login");
  it.todo("should fresh an access_token => POST /api/user/token");
});
