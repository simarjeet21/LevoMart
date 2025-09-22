import express, { Request, Response } from "express";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotAuthorizedError } from "../../utils/errors/not-authorized-error";
import { Product } from "../../models/product";
import { ForbiddenRequestError } from "../../utils/errors/forbidden-request-error";
const router = express.Router();

router.get(
  "/api/products/seller/:userId",
  requireAuth,
  requireRole("ADMIN", "SELLER"),
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    //console.log(userId);
    //console.log("hi fromproduct service list seller products  product");

    // Only allow the seller to view their own products unless they're admin
    if (req.currentUser!.id !== userId && req.currentUser!.role !== "ADMIN") {
      throw new ForbiddenRequestError();
    }

    const products = await Product.find({ userId });
    //console.log(products);

    res.status(200).send(products);
  }
);
export { router as listSellerProductsRouter };
