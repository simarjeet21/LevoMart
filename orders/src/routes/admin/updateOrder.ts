// routes/admin/updateOrder.ts
import express, { Request, Response } from "express";
import { body } from "express-validator";

import { prisma } from "../../utils/prisma/prisma";
//import { OrderStatus } from "../../../prisma/generated/prod-client";
import { validateRequest } from "../../middlewares/validate-request";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { updateOrderValidator } from "../../validators/update-order.validator";
import { UpdateOrderRequest } from "../../types/dtos/update-order-request.dto";
import { OrderResponse } from "../../types/dtos/order-response.dto";
import { orderUpdated } from "../../events/orderUpdated";
import { OrderStatus } from "../../utils/prisma/prisma";

const router = express.Router();

router.patch(
  "/api/orders/admin/:id",
  requireAuth,
  requireRole("ADMIN"),
  updateOrderValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) throw new NotFoundError();

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: status,
        //expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });
    if (!updated) throw new NotFoundError();
    await orderUpdated(updated as OrderResponse);

    res.send(updated as OrderResponse);
  }
);

export { router as updateOrder };
