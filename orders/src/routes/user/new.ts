import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { BadRequestError } from "../../utils/errors/bad-request-error";
import { prisma } from "../../utils/prisma/prisma";

import { asyncHandler } from "../../utils/async-handler";
import { createOrderValidator } from "../../validators/create-order.validator";
import { CreateOrderDto } from "../../types/dtos/create-order.dto";
import { OrderResponse } from "../../types/dtos/order-response.dto";
import { orderCreated } from "../../events/orderCreated.";
import { OrderStatus } from "../../types/orderStatus";
//import { OrderStatus } from "../../../prisma/generated/prod-client";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [User Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *
 *   get:
 *     summary: List current user's orders
 *     tags: [User Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 */
router.post(
  "/api/orders/user",
  requireAuth,
  requireRole("USER"),
  createOrderValidator,
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { items }: CreateOrderDto = req.body;
    // console.log("items", items);
    //console.log("[Order] Incoming items:", JSON.stringify(items));

    // 1. Pull product details in **parallel** for speed & log fails
    const products = await Promise.all(
      items.map(async (it) => {
        const product = await prisma.product.findUnique({
          where: { id: it.productId },
        });
        if (!product) {
          // console.log(`[Order] Product not foundd ${it.productId}`);
          throw new NotFoundError();
        }
        return { product, quantity: it.quantity };
      })
    );
    const expiration = new Date(Date.now() + EXPIRATION_WINDOW_SECONDS * 1000);

    // Calculate an expiration date for this order
    // const expiration = new Date();
    // expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const orderItems = products.map(({ product, quantity }) => ({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      sellerId: product.userId,
      quantity,
      totalPrice: product.price * quantity,
    }));

    //const orderItems = [];

    // for (const item of items) {
    //   const { productId, quantity } = item;

    //   // Option 1: Replace this with REST call to Product Service in real microservice setup
    //   const product = await prisma.product.findUnique({
    //     where: { id: productId },
    //   });
    //   if (!product) {
    //     throw new NotFoundError();
    //   }

    //   orderItems.push({
    //     productId: product.id,
    //     productName: product.name,
    //     productPrice: product.price,
    //     sellerId: product.userId,
    //     quantity,
    //     totalPrice: quantity * product.price,
    //   });
    // }

    const order = await prisma.order.create({
      data: {
        userId: req.currentUser!.id,
        status: OrderStatus.CREATED || undefined, // Assuming OrderStatus.Created is equivalent to "Created"
        expiresAt: expiration,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true, // Include order items in the response
        // product: true, // If you want to include product details, uncomment this line
      },
    });
    // console.log("[Order] Created:", order.id);
    // Publish event (optional here)
    // new OrderCreatedPublisher(natsWrapper.client).publish({...})
    try {
      await orderCreated(order as OrderResponse);
      console.log("[Order] Event published");
    } catch (e) {
      console.error("[Order] Event publish failed:", e);
      // Decide: swallow vs. rethrow.  Usually you still return 201.
    }

    res.status(201).send(order as OrderResponse);
  })
);

export { router as newOrderRouter };
