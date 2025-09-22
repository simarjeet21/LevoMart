import { body } from "express-validator";

export const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["CREATED", "PENDING", "COMPLETED", "CANCELLED", "AWAITING_PAYMENT"])
    .withMessage("Invalid status"),
];
