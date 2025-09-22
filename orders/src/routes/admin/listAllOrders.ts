// routes/admin/listAllOrders.ts
import express from "express";

import { prisma } from "../../utils/prisma/prisma";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { OrderResponse } from "../../types/dtos/order-response.dto";

const router = express.Router();

router.get(
  "/api/orders/admin",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const orders = await prisma.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: "desc" },
    });

    res.send(orders as OrderResponse[]);
  }
);

export { router as listAllOrders };
