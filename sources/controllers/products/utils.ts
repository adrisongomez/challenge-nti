import { number, object, string } from "yup";

export type CreateProduct = {
  title: string
  description: string
  cost_price: string
  retail_price: string
};

export type UpdateProduct = {
  title?: string
  description?: string
  cost_price?: string
  retail_price?: string
}

export const productSchema = object({
    title: string().required(),
    description: string(),
    cost_price: number().min(0).required(),
    retail_price: number().min(0).required(),
})
