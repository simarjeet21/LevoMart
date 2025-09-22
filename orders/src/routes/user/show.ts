import express, { Request, Response } from "express";

import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { NotAuthorizedError } from "../../utils/errors/not-authorized-error";
import { prisma } from "../../utils/prisma/prisma";
import { OrderResponse } from "../../types/dtos/order-response.dto";

const router = express.Router();

router.get(
  "/api/orders/user/:orderId",
  requireAuth,
  requireRole("USER"),
  async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order as OrderResponse);
  }
);

export { router as showOrderRouter };
