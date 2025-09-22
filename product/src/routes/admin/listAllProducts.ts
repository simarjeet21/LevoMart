import express, { Request, Response } from "express";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { Product } from "../../models/product";

const router = express.Router();

// GET /api/admin/products
router.get(
  "/api/products/admin",
  requireAuth,
  requireRole("ADMIN"),
  async (req: Request, res: Response) => {
    const products = await Product.find({});
    res.status(200).send(products);
  }
);

export { router as listAllProductsRouter };
