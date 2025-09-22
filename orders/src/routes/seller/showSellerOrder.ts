import express from "express";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { NotAuthorizedError } from "../../utils/errors/not-authorized-error";
import { prisma } from "../../utils/prisma/prisma";
import { OrderResponse } from "../../types/dtos/order-response.dto";
import { ForbiddenRequestError } from "../../utils/errors/forbidden-request-error";

const router = express.Router();

router.get(
  "/api/orders/seller/:orderId",
  requireAuth,
  requireRole("SELLER"),
  async (req, res) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { orderItems: true },
    });
    if (!order) {
      throw new NotFoundError();
    }

    const sellerOwnsAnyOrderItem = order.orderItems.some(
      (item) => item.sellerId === req.currentUser!.id
    );

    if (!sellerOwnsAnyOrderItem) {
      throw new ForbiddenRequestError();
    }
    res.send(order as OrderResponse);
  }
);

export { router as showSellerOrderRouter };
