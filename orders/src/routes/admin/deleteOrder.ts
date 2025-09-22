// routes/admin/deleteOrder.ts
import express, { Request, Response } from "express";

import { prisma } from "../../utils/prisma/prisma";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotFoundError } from "../../utils/errors/not-found-error";
//import { OrderStatus } from " ../../../prisma/generated/prod-client";
import { asyncHandler } from "../../utils/async-handler";
import { orderUpdated } from "../../events/orderUpdated";
import { OrderResponse } from "../../types/dtos/order-response.dto";
import { OrderStatus } from "../../utils/prisma/prisma";

const router = express.Router();

router.delete(
  "/api/orders/admin/:id",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req: Request, res: Response) => {
    //console.log("Deleting order with ID:", req.params.id);
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) throw new NotFoundError();

    if (order.status === OrderStatus.CANCELLED) {
      return res.status(400).send({ message: "Order already cancelled" });
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: OrderStatus.CANCELLED },
    });
    if (!cancelledOrder) throw new NotFoundError();
    // console.log("Order cancelled!!:", cancelledOrder);
    await orderUpdated(cancelledOrder as OrderResponse);

    res.status(200).send({ message: "Order cancelled", order: cancelledOrder });
  })
);

export { router as deleteOrder };
