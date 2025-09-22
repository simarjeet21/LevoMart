// * ✅ 200 with product details done
// * ❌ 404 if product doesn’t exist or blocked
// * ❌ Invalid ID format

import mongoose from "mongoose";
import { app } from "../../../app";
import { Product } from "../../../models/product";
import request from "supertest";

// * ✅ Only returns if product is active
it("returns 200 and product details when product exists", async () => {
  const product = await Product.create({
    name: "Test Product",
    price: 100,
    userId: "user_123",
  });

  const res = await request(app).get(`/api/products/${product.id}`).expect(200);

  expect(res.body.id).toEqual(product.id);
  expect(res.body.name).toEqual("Test Product");
});

// it("returns 404 if product does not exist", async () => {
//   const fakeId = new mongoose.Types.ObjectId().toHexString();
//   await request(app).get(`/api/products/${fakeId}`).expect(404);
// });

// it("returns 400 for invalid MongoDB ID", async () => {
//   await request(app).get("/api/products/invalid-id").expect(400);
// });
// it("returns 404 for blocked or inactive product", async () => {
//   const product = await Product.create({
//     name: "Blocked Product",
//     price: 100,
//     userId: "user_123",
//     isBlocked: true, // Add this in your model schema if required
//   });

//   const res = await request(app).get(`/api/products/${product.id}`).expect(404);
// });
// const product = await Product.findOne({
//   _id: req.params.id,
//   isBlocked: false, // optional based on schema
// });
