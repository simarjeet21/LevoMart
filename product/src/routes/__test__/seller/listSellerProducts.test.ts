// #### 🔹 `GET /api/seller/products`

import { app } from "../../../app";
import { Product } from "../../../models/product";
import request from "supertest";
jest.mock("../../../events/productCreated", () => ({
  productCreated: jest.fn(), // will replace the actual Kafka-related function
}));

// * ✅ 200 with list of seller's products done
// * ❌ 401 unauthenticated done
// * ❌ 403 if not seller done
it("returns 200 with seller's products", async () => {
  const sellerToken = global.signin("SELLER");
  const userId = JSON.parse(
    Buffer.from(sellerToken.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  // Create products with this seller
  await Product.create({ name: "Item 1", price: 100, userId });
  await Product.create({ name: "Item 2", price: 200, userId });

  const res = await request(app)
    .get(`/api/products/seller/${userId}`)
    .set("Authorization", sellerToken)
    .expect(200);

  expect(res.body.length).toBe(2);
});

it("allows admin to fetch seller's products", async () => {
  const sellerToken = global.signin("SELLER");
  const adminToken = global.signin("ADMIN");

  const sellerId = JSON.parse(
    Buffer.from(sellerToken.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  await Product.create({ name: "Admin Visible", price: 50, userId: sellerId });

  const res = await request(app)
    .get(`/api/products/seller/${sellerId}`)
    .set("Authorization", adminToken)
    .expect(200);

  expect(res.body.length).toBe(1);
});

it("returns 401 if user is not authenticated", async () => {
  await request(app).get("/api/products/seller/some-user-id").expect(401);
});
//currently sending 401
it("returns 403 if seller tries to fetch another seller's products", async () => {
  const seller1 = global.signin("SELLER");
  const seller2 = global.signin("SELLER");

  const seller1Id = JSON.parse(
    Buffer.from(seller1.split(" ")[1].split(".")[1], "base64").toString()
  ).id;
  const seller2Id = JSON.parse(
    Buffer.from(seller2.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  await Product.create({
    name: "Should Not See",
    price: 99,
    userId: seller1Id,
  });

  await request(app)
    .get(`/api/products/seller/${seller1Id}`)
    .set("Authorization", seller2)
    .expect(403);
});
it("returns 200 with empty array if seller has no products", async () => {
  const seller = global.signin("SELLER");
  const sellerId = JSON.parse(
    Buffer.from(seller.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const res = await request(app)
    .get(`/api/products/seller/${sellerId}`)
    .set("Authorization", seller)
    .expect(200);

  expect(res.body).toEqual([]);
});
