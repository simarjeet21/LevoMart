// * [x] 200 on successful status update done
// * [x] 401 unauthenticated
// * [x] 403 if not SELLER
// * [x] 403 if seller doesn’t own the product
// * [x] 400 invalid status or body
// * [x] 404 if order not found
import request from "supertest";
import { prisma } from "../../../utils/prisma/prisma";
import { app } from "../../../app";
import { CreateOrderDto } from "../../../types/dtos/create-order.dto";
import { randomUUID } from "crypto";
jest.mock("../../../events/orderUpdated", () => ({
  orderUpdated: jest.fn(), // will replace the actual Kafka-related function
}));

const buildOrder = async (userId: string) => {
  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: "Test Product",
      price: 100,
      userId,
      version: 0,
    },
  });

  const user = global.signin("USER");
  const items: CreateOrderDto = {
    items: [
      {
        productId: product.id,
        quantity: 2,
      },
    ],
  };

  const res = await request(app)
    .post("/api/orders/user")
    .set("Authorization", user)
    .send(items)
    .expect(201);
  console.log(res.body);

  return { order: res.body, userId, product };
};
it("200 on successful status update", async () => {
  const sellerToken = global.signin("SELLER");
  const sellerId = JSON.parse(
    Buffer.from(sellerToken.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const { order } = await buildOrder(sellerId);

  const res = await request(app)
    .patch(`/api/orders/seller/${order.id}/status`)
    .set("Authorization", sellerToken)
    .send({ status: "COMPLETED" })
    .expect(200);

  expect(res.body.status).toBe("COMPLETED");
});
it("401 unauthenticated", async () => {
  await request(app)
    .patch("/api/orders/seller/some-id/status")
    .send({ status: "COMPLETED" })
    .expect(401);
});

it("403 if not SELLER", async () => {
  const token = global.signin("USER");

  await request(app)
    .patch("/api/orders/seller/some-id/status")
    .set("Authorization", token)
    .send({ status: "COMPLETED" })
    .expect(403);
});

it("403 if seller doesn’t own the product", async () => {
  const { order } = await buildOrder(randomUUID());

  const fakeSeller = global.signin("SELLER");

  await request(app)
    .patch(`/api/orders/seller/${order.id}/status`)
    .set("Authorization", fakeSeller)
    .send({ status: "COMPLETED" })
    .expect(403);
});

it("400 for invalid status or missing body", async () => {
  const sellerToken = global.signin("SELLER");
  const userId = JSON.parse(
    Buffer.from(sellerToken.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const { order } = await buildOrder(userId);

  // Missing body
  await request(app)
    .patch(`/api/orders/seller/${order.id}/status`)
    .set("Authorization", sellerToken)
    .send({})
    .expect(400);

  // Invalid status
  await request(app)
    .patch(`/api/orders/seller/${order.id}/status`)
    .set("Authorization", sellerToken)
    .send({ status: "INVALID_STATUS" })
    .expect(400);
});

it("404 if order not found", async () => {
  const sellerToken = global.signin("SELLER");

  await request(app)
    .patch("/api/orders/seller/non-existing-id/status")
    .set("Authorization", sellerToken)
    .send({ status: "COMPLETED" })
    .expect(404);
});
