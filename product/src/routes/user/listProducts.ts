import express, { Request, Response } from "express";
import { NotFoundError } from "../../utils/errors/not-found-error";
import { Product } from "../../models/product";

const router = express.Router();

router.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    //console.log(`Fetched ${products.length} products`);
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new NotFoundError();
  }
});

export { router as listProductsRouter };
