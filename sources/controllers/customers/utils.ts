import { Gender } from "@prisma/client";
import { object, string } from "yup"

export type CreateCustomer = {
    firstName: string;
    lastName: string;
    // this could be validate
    email: string;
    address: string;
    gender: Gender;
    // this  could be validate
    phoneNumber: string;
    // this could be validate
    personalId: string;
};

export type UpdateCustomer = {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    gender?: Gender;
    phoneNumber?: string;
    personalId?: string;
};

export const createCustomer = object({
    firstName: string().required(),
    lastName: string().required(),
    email: string().email(),
    gender: string().oneOf([Gender.MALE, Gender.FEMALE, Gender.OTHERS]),
    phoneNumber: string().required(),
    personalId: string().matches(/[0-9]{11}/g, 'Personal Id must be a 11 Digit number without \'-\' ')
})
