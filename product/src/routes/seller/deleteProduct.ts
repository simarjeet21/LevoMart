import express, { Request, Response } from "express";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { NotAuthorizedError } from "../../utils/errors/not-authorized-error";
import { Product } from "../../models/product";
import { ForbiddenRequestError } from "../../utils/errors/forbidden-request-error";

const router = express.Router();

// DELETE /api/products/:id
router.delete(
  "/api/products/:id",
  requireAuth,
  requireRole("SELLER", "ADMIN"),
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    // Only the seller who created it or an admin can delete
    if (
      product.userId !== req.currentUser!.id &&
      req.currentUser!.role !== "ADMIN"
    ) {
      throw new ForbiddenRequestError();
    }

    await product.deleteOne();
    //send prioduct deleted event

    res.status(204).send("producted deleted succesfully"); // 204 No Content
  }
);

export { router as deleteProductRouter };
