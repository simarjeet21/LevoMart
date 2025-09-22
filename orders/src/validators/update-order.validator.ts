import { body } from "express-validator";

export const updateOrderValidator = [
  body("status")
    .optional()
    .isIn(["CREATED", "PENDING", "AWAITING_PAYMENT", "COMPLETED", "CANCELLED"])
    .withMessage("Invalid order status"),
  body("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("expiresAt must be a valid ISO date"),
];
