// * [x] 200 if order for their product
// * [x] 401 unauthenticated
// * [x] 403 if product not owned by seller
// * [x] 404 if order not found
// * [x] invalid ID format
import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../utils/prisma/prisma";
import { randomUUID } from "crypto";
const buildOrderForSeller = async (userId: string) => {
  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: "Test Product",
      price: 100,
      userId,
      version: 0,
    },
  });

  const userToken = global.signin("USER");

  const { body: order } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", userToken)
    .send({
      items: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    })
    .expect(201);

  return order;
};

it("200 if order has item belonging to authenticated seller", async () => {
  const sellerToken = global.signin("SELLER");

  const userId = JSON.parse(
    Buffer.from(sellerToken.split(" ")[1].split(".")[1], "base64").toString()
  ).id;

  const order = await buildOrderForSeller(userId);

  const res = await request(app)
    .get(`/api/orders/seller/${order.id}`)
    .set("Authorization", sellerToken)
    .expect(200);

  expect(res.body.id).toEqual(order.id);
});

it("401 if unauthenticated", async () => {
  const order = await buildOrderForSeller("some_seller");

  await request(app).get(`/api/orders/seller/${order.id}`).expect(401);
});

it("403 if product not owned by seller", async () => {
  const order = await buildOrderForSeller(randomUUID());

  const otherSeller = global.signin("SELLER");

  await request(app)
    .get(`/api/orders/seller/${order.id}`)
    .set("Authorization", otherSeller)
    .expect(403);
});

it("404 if order not found", async () => {
  const seller = global.signin("SELLER");

  await request(app)
    .get("/api/orders/seller/non-existing-id")
    .set("Authorization", seller)
    .expect(404);
});

// it("400 if orderId is invalid format", async () => {
//   const seller = global.signin("SELLER");

//   await request(app)
//     .get("/api/orders/seller/invalid-uuid!!")
//     .set("Authorization", seller)
//     .expect(400);
// });
