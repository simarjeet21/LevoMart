import express, { Request, Response } from "express";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { NotAuthorizedError } from "../../utils/errors/not-authorized-error";
import { prisma } from "../../utils/prisma/prisma";
//import { Order, OrderStatus } from "../../../prisma/generated/prod-client";
import { asyncHandler } from "../../utils/async-handler";
import { OrderResponse } from "../../types/dtos/order-response.dto";
import { ForbiddenRequestError } from "../../utils/errors/forbidden-request-error";
import { orderUpdated } from "../../events/orderUpdated";
import { OrderStatus } from "../../utils/prisma/prisma";

// import { Order, OrderStatus } from '../models/order';
// import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
// import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  "/api/orders/user/:orderId",
  requireAuth,
  requireRole("USER"),
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new ForbiddenRequestError();
    }
    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      return res.status(400).send({ message: "Cannot cancel this order" });
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
      },
    });

    await orderUpdated(updatedOrder as OrderResponse);

    await orderUpdated(updatedOrder as OrderResponse);

    res.status(204).send(updatedOrder as OrderResponse);
  })
);

export { router as deleteOrderRouter };
