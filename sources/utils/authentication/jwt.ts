import { AuthenticationError } from "@controllers/users/utils";
import { User } from "@prisma/client";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

type TypeSecret = "access" | "refresh";
type TokenPayload = {
  id: string;
  email: string;
  firstName: string;
};

const getSecret = (type: TypeSecret) => {
  const accessSecret = process.env?.JWT_SECRET_ACCESS;
  const refreshSecret = process.env?.JWT_SECRET_REFRESH;
  if (!accessSecret || !refreshSecret)
    throw new AuthenticationError("JWT_SECRET must be setup");
  return type === "access" ? accessSecret : refreshSecret;
};

const generateToken = (type: TypeSecret, expiresIn: string) => (user: User) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    },
    getSecret(type),
    {
      expiresIn: expiresIn,
    }
  );

const verifyToken =
  (type: TypeSecret) =>
  (token: string): TokenPayload | undefined => {
    try {
      const payload = jwt.verify(token, getSecret(type));
      const { id, email, firstName } = payload as TokenPayload;
      return {
        id,
        email,
        firstName,
      };
    } catch (error) {
      console.error(error)
      if (error instanceof JsonWebTokenError) {
        return;
      }
      throw error
    }
  };

export const getAccessToken = generateToken("access", "5m");
export const getRefreshToken = generateToken("refresh", "30d");

export const verifyIfAccessToken = verifyToken("access");
export const verifyIfRefreshToken = verifyToken("refresh");
