import express, { Request, Response } from "express";
import { Product } from "../../models/product";
import { NotFoundError } from "../../utils/errors/not-found-error";

const router = express.Router();

router.get("/api/products/:id", async (req: Request, res: Response) => {
  //const Product = await Product.findById(req.params.id);

  console.log(req.params);
  const { id } = req.params;
  id.toString();
  console.log(id);
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    res.send(product);
  } catch (error) {
    console.log(error);
  }
});

export { router as showProductRouter };
