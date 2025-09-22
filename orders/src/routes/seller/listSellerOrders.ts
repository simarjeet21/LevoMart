import express, { Request, Response } from "express";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { prisma } from "../../utils/prisma/prisma";
import { OrderResponse } from "../../types/dtos/order-response.dto";

const router = express.Router();
router.get(
  "/api/orders/seller",
  requireAuth,
  requireRole("SELLER"),
  async (req: Request, res: Response) => {
    const sellerId = req.currentUser!.id;
    const orders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            sellerId: sellerId,
          },
        },
      },
      include: { orderItems: true },
    });

    res.send(orders as OrderResponse[]);
  }
);
export { router as listSellerOrdersRouter };
