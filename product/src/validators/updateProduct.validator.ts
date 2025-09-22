// src/validators/updateProduct.validator.ts
import { body } from "express-validator";

export const updateProductValidator = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),
  body("description").optional().isString(),
  body("category").optional().isString(),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("imageUrl").optional().isString(),
];
