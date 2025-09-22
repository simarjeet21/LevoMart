import express from "express";

// Admin routes
import { adminDeleteProductRouter } from "./admin/deleteAnyProduct";
import { listAllProductsRouter } from "./admin/listAllProducts";
//import { moderateProductRouter } from "./admin/moderateProduct";

// Seller routes
import { createProductRouter } from "./seller/createProduct";
import { deleteProductRouter } from "./seller/deleteProduct";
import { listSellerProductsRouter } from "./seller/listSellerProducts";
import { updateProductRouter } from "./seller/updateProduct";

// User routes
import { listProductsRouter } from "./user/listProducts";
import { showProductRouter } from "./user/showProduct";

const router = express.Router();

// Admin
router.use(adminDeleteProductRouter);
router.use(listAllProductsRouter);
//router.use(moderateProductRouter);

// Seller
router.use(createProductRouter);
router.use(deleteProductRouter);
router.use(listSellerProductsRouter);
router.use(updateProductRouter);

// User
router.use(listProductsRouter);
router.use(showProductRouter);

/**
 * @swagger
 * tags:
 *   - name: Admin Products
 *     description: Admin management of all products
 *   - name: Seller Products
 *     description: Seller product operations
 *   - name: Public Products
 *     description: Products available for users to browse
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List all products (Public)
 *     tags: [Public Products]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get product by ID (Public)
 *     tags: [Public Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/seller/products:
 *   post:
 *     summary: Create a new product (Seller)
 *     tags: [Seller Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created
 */

/**
 * @swagger
 * /api/seller/products/{productId}:
 *   delete:
 *     summary: Delete a product (Seller)
 *     tags: [Seller Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *
 *   patch:
 *     summary: Update a product (Seller)
 *     tags: [Seller Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/seller/products:
 *   get:
 *     summary: List seller's products
 *     tags: [Seller Products]
 *     responses:
 *       200:
 *         description: Seller's product list
 */

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: List all products (Admin)
 *     tags: [Admin Products]
 *     responses:
 *       200:
 *         description: All products in system
 */

/**
 * @swagger
 * /api/admin/products/{productId}:
 *   delete:
 *     summary: Admin deletes any product
 *     tags: [Admin Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product deleted by admin
 */
export { router as productRoutes };
