import express, { Request, Response } from "express";

// import { Order } from "../models/order";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { prisma } from "../../utils/prisma/prisma";
import { OrderResponse } from "../../types/dtos/order-response.dto";

const router = express.Router();
//list orders for a user
router.get(
  "/api/orders/user",
  requireAuth,
  requireRole("USER"),
  async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.currentUser!.id },
      include: { orderItems: true },
    });

    res.send(orders as OrderResponse[]);
  }
);

export { router as indexOrderRouter };
