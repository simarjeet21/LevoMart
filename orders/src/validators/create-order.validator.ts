// validators/order/create-order.validator.ts
import { body } from "express-validator";

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Each item must have a valid productId"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Each item must have a quantity of at least 1"),
];
