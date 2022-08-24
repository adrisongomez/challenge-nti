import { faker } from "@faker-js/faker"
import { hash, verifyHash } from "sources/utils/authentication/password";

describe('Password Utility unit test', () => {
    it("should hash a password", ()=>{
        const password = faker.internet.password();
        const hashPassword = hash(password)
        expect(hashPassword).toBeDefined()

        const verify = verifyHash(password, hashPassword)
        expect(verify).toBeTruthy()
    })
})
