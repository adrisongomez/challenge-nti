import { AuthenticationError } from "@controllers/users/utils";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const generateToken =
  (type: "access" | "refresh", expiresIn: string) => (user: User) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
      type === "access"
        ? process.env?.JWT_SECRET_ACCESS as string
        : process.env?.JWT_SECRET_REFRESH as string,
      {
        expiresIn: expiresIn,
      }
    );
  };

export const getAccessToken = generateToken("access", "5m");
export const getRefreshToken = generateToken("refresh", "30d");
