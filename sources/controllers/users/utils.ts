import { object, string } from "yup";

export type CreateUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type UpdateUser = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export const userSchema = object({
    firstName: string().required(),
    lastName: string().required(),
    email: string().email().required(),
    password: string().min(8).required(),
})
