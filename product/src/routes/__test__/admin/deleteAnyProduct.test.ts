// * ✅ 200 if product exists done
// * ❌ 401 unauthenticated
// * ❌ 403 non-admin
// * ❌ 404 if product doesn’t exist
// * ❌ Invalid ID format
// * ✅ Soft delete or flag product if applicable
import request from "supertest";
import mongoose from "mongoose";
import { Product } from "../../../models/product";
import { app } from "../../../app";
it("deletes product and returns 204", async () => {
  const product = await Product.create({
    name: "Delete Me",
    price: 99,
    userId: "admin-id",
  });

  await request(app)
    .delete(`/api/products/admin/${product.id}`)
    .set("Authorization", global.signin("ADMIN"))
    .expect(204);

  const found = await Product.findById(product.id);
  expect(found).toBeNull();
});

it("returns 401 if user is not authenticated", async () => {
  await request(app).delete("/api/products/admin/random-id").expect(401);
});
// sending not authorized eror now
it("returns 403 if user is not an admin", async () => {
  const product = await Product.create({
    name: "Product",
    price: 100,
    userId: "admin-id",
  });

  await request(app)
    .delete(`/api/products/admin/${product.id}`)
    .set("Authorization", global.signin("USER"))
    .expect(403);
});

it("returns 404 if product does not exist", async () => {
  const nonExistentId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/products/admin/${nonExistentId}`)
    .set("Authorization", global.signin("ADMIN"))
    .expect(404);
});

it("returns 400 if ID is invalid", async () => {
  await request(app)
    .delete("/api/products/admin/invalid-id-format")
    .set("Authorization", global.signin("ADMIN"))
    .expect(400); // You must validate ID format using express-validator or handle CastError
});

// if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//   throw new BadRequestError("Invalid product ID format");
// }
// product.isDeleted = true;
// await product.save();
// it("marks product as deleted instead of removing it", async () => {
//   const product = await Product.create({
//     name: "Soft Delete",
//     price: 150,
//     userId: "admin-id",
//     isDeleted: false,
//   });

//   await request(app)
//     .delete(`/api/products/admin/${product.id}`)
//     .set("Authorization", global.signin("ADMIN"))
//     .expect(204);

//   const updated = await Product.findById(product.id);
//   expect(updated!.isDeleted).toBe(true);
// });
