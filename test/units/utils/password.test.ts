import { faker } from "@faker-js/faker";
import { hash, verifyHash } from "sources/utils/authentication/password";

describe("Password Utility unit test", () => {
  it("should hash a password", async () => {
    const password = faker.internet.password();
    const hashPassword = await hash(password);
    expect(hashPassword).toBeDefined();

    const verify = await verifyHash(password, hashPassword);
    expect(verify).toBeTruthy();
  });
});
