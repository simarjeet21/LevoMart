import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { Product, ProductAttributes } from "../../models/product";
import { CreateProductValidator } from "../../validators/createProduct.validator";
import { BadRequestError } from "../../utils/errors/bad-request-error";
import { productCreated } from "../../events/productCreated";

const router = express.Router();

router.post(
  "/api/products",
  requireAuth,
  requireRole("ADMIN", "SELLER"),
  CreateProductValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      price,
      description = "",
      category = "",
      stock = 0,
      imageUrl = "",
    } = req.body as ProductAttributes;

    // const userId = req.currentUser?.id ?? "";
    // implement this
    const existingProduct = await Product.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existingProduct) {
      throw new BadRequestError("Product name already exists");
    }

    const product = Product.build({
      name,
      price,
      userId: req.currentUser!.id,
      description: description ?? "",
      category: category ?? "",
      stock: stock ?? 0,
      imageUrl: imageUrl ?? "",
    });

    await product.save();

    await productCreated(product);
    console.log("Product createad");

    res.status(201).send(product);
  }
);

export { router as createProductRouter };
