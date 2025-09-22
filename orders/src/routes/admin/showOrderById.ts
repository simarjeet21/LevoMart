// routes/admin/showOrderById.ts
import express from "express";

import { prisma } from "../../utils/prisma/prisma";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { OrderResponse } from "../../types/dtos/order-response.dto";

const router = express.Router();

router.get(
  "/api/orders/admin/:id",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { orderItems: true },
    });

    if (!order) throw new NotFoundError();

    res.send(order as OrderResponse);
  }
);

export { router as showOrderById };
