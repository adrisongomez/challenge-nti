import { AuthenticationError } from "@controllers/users/utils";
import bcrypt from "bcrypt";

export const hash = (text: string): string => {
  const salt = process.env.SALT_ROUND;
  if (!salt) throw new AuthenticationError("HASH_SALT need to be setup");
  return bcrypt.hashSync(text, bcrypt.genSaltSync(parseInt(salt)));
};

export const verifyHash = (text: string, compareHash: string): boolean => {
    return bcrypt.compareSync(text, compareHash)
}
