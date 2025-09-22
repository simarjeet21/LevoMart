// import express, { Request, Response } from "express";
// import { requireAuth, requireRole } from "../../middlewares/require-auth";
// import { body } from "express-validator";
// import { validateRequest } from "../../middlewares/validate-request";
// import { Product } from "../../models/product";
// import { NotFoundError } from "../../utils/errors/not-found-error";

// const router = express.Router();

// // PATCH /api/admin/products/:id/moderate
// router.patch(
//   "/api/admin/products/:id/moderate",
//   requireAuth,
//   requireRole("ADMIN"),
//   [
//     body("status")
//       .isIn(["active", "blocked"])
//       .withMessage("Status must be 'active' or 'blocked'"),
//   ],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       throw new NotFoundError();
//     }

//     product.set({ status: req.body.status });
//     await product.save();

//     res.status(200).send(product);
//   }
// );

// export { router as moderateProductRouter };
