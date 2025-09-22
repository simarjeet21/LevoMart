import express from "express";

// User routes
import { newOrderRouter } from "./user/new";
import { showOrderRouter } from "./user/show";
import { deleteOrderRouter } from "./user/delete";
import { indexOrderRouter } from "./user/index";

// Seller routes
import { listSellerOrdersRouter } from "./seller/listSellerOrders";
import { showSellerOrderRouter } from "./seller/showSellerOrder";
import { updateOrderStatusRouter } from "./seller/updateOrderStatus";

// Admin routes
import { listAllOrders } from "./admin/listAllOrders";
import { showOrderById } from "./admin/showOrderById";
import { updateOrder } from "./admin/updateOrder";
import { deleteOrder } from "./admin/deleteOrder";

const router = express.Router();

// Mount user routes
router.use(newOrderRouter);
router.use(showOrderRouter);
router.use(deleteOrderRouter);
router.use(indexOrderRouter);

// Mount seller routes
router.use(listSellerOrdersRouter);
router.use(showSellerOrderRouter);
router.use(updateOrderStatusRouter);

// Mount admin routes
router.use(listAllOrders);
router.use(showOrderById);
router.use(updateOrder);
router.use(deleteOrder);

/**
 * @swagger
 * tags:
 *   - name: User Orders
 *     description: Endpoints for users to manage their own orders
 *   - name: Seller Orders
 *     description: Endpoints for sellers to manage orders of their products
 *   - name: Admin Orders
 *     description: Endpoints for admin to manage all orders
 */

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

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get a specific order by ID (User)
 *     tags: [User Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *
 *   delete:
 *     summary: Delete a specific order by ID (User)
 *     tags: [User Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/seller/orders:
 *   get:
 *     summary: List all orders for seller's products
 *     tags: [Seller Orders]
 *     responses:
 *       200:
 *         description: List of seller orders
 */

/**
 * @swagger
 * /api/seller/orders/{orderId}:
 *   get:
 *     summary: Get specific order by ID (Seller)
 *     tags: [Seller Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Seller order details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/seller/orders/{orderId}/status:
 *   patch:
 *     summary: Update order status (Seller)
 *     tags: [Seller Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: List all orders (Admin)
 *     tags: [Admin Orders]
 *     responses:
 *       200:
 *         description: All orders list
 */

/**
 * @swagger
 * /api/admin/orders/{orderId}:
 *   get:
 *     summary: Get order by ID (Admin)
 *     tags: [Admin Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Not found
 *
 *   delete:
 *     summary: Delete order by ID (Admin)
 *     tags: [Admin Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Order deleted
 */

/**
 * @swagger
 * /api/admin/orders/{orderId}:
 *   patch:
 *     summary: Update an order (Admin)
 *     tags: [Admin Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated
 */

export { router as orderRoutes };
