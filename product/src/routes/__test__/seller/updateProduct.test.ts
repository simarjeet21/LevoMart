// #### 🔹 `PATCH /api/seller/products/:id`

import mongoose from "mongoose";
import { app } from "../../../app";
import { Product } from "../../../models/product";
import request from "supertest";
jest.mock("../../../events/productCreated", () => ({
  productCreated: jest.fn(), // will replace the actual Kafka-related function
}));
// * ✅ 200 on successful update done
// * ❌ 401 unauthenticated
// * ❌ 403 if not seller
// * ❌ 403 if seller does not own product
// * ❌ 400 for invalid body (price, stock, etc.)
// * ❌ 404 if product not found
// * ✅ Partial update works (e.g., only price)
it("returns 200 and updates product if seller owns it", async () => {
  const seller = global.signin("SELLER");
  const userId = JSON.parse(
    Buffer.from(seller.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const product = await Product.create({
    name: "Original",
    price: 50,
    userId,
    stock: 10,
  });

  const res = await request(app)
    .put(`/api/products/${product.id}`)
    .set("Authorization", seller)
    .send({ price: 100 })
    .expect(200);

  expect(res.body.price).toBe(100);
});

it("allows admin to update any product", async () => {
  const seller = global.signin("SELLER");
  const admin = global.signin("ADMIN");

  const sellerId = JSON.parse(
    Buffer.from(seller.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const product = await Product.create({
    name: "Admin Updatable",
    price: 70,
    userId: sellerId,
  });

  const res = await request(app)
    .put(`/api/products/${product.id}`)
    .set("Authorization", admin)
    .send({ price: 150 })
    .expect(200);

  expect(res.body.price).toBe(150);
});

it("returns 401 if not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .send({ name: "New" })
    .expect(401);
});
//currently sending 401
it("returns 403 if seller tries to update someone else's product", async () => {
  const seller1 = global.signin("SELLER");
  const seller2 = global.signin("SELLER");

  const seller1Id = JSON.parse(
    Buffer.from(seller1.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const product = await Product.create({
    name: "Unauthorized Update",
    price: 120,
    userId: seller1Id,
  });

  await request(app)
    .put(`/api/products/${product.id}`)
    .set("Authorization", seller2)
    .send({ price: 999 })
    .expect(403);
});

it("returns 404 if product not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .set("Authorization", global.signin("SELLER"))
    .send({ price: 99 })
    .expect(404);
});

it("returns 400 for invalid price or stock", async () => {
  const seller = global.signin("SELLER");
  const userId = JSON.parse(
    Buffer.from(seller.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const product = await Product.create({
    name: "Invalid Update",
    price: 100,
    stock: 10,
    userId,
  });

  await request(app)
    .put(`/api/products/${product.id}`)
    .set("Authorization", seller)
    .send({ price: -50 }) // invalid
    .expect(400);
});

it("updates only provided fields (partial update)", async () => {
  const seller = global.signin("SELLER");
  const userId = JSON.parse(
    Buffer.from(seller.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const product = await Product.create({
    name: "Partial Update",
    price: 100,
    stock: 5,
    userId,
  });

  const res = await request(app)
    .put(`/api/products/${product.id}`)
    .set("Authorization", seller)
    .send({ stock: 20 }) // only stock
    .expect(200);

  expect(res.body.stock).toBe(20);
  expect(res.body.price).toBe(100);
});
