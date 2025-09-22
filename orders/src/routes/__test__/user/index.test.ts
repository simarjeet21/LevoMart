import request from "supertest";
import { app } from "../../../app";

import { prisma } from "../../../utils/prisma/prisma";
import { CreateOrderDto } from "../../../types/dtos/create-order.dto";

// * [x] 200 for authenticated user
// * [x] 401 unauthenticated
// * [x] returns only that user’s orders done
import { randomUUID } from "crypto";

const buildProduct = async (id: string) => {
  return await prisma.product.create({
    data: {
      id,
      name: `Test Product ${id}`,
      price: 100,
      userId: `seller_${id}`,
      version: 0,
    },
  });
};

it("fetches orders for a particular user", async () => {
  // Create three products
  const productOne = await buildProduct(randomUUID());
  const productTwo = await buildProduct(randomUUID());
  const productThree = await buildProduct(randomUUID());

  const userOne = global.signin("USER");
  const userTwo = global.signin("USER");

  const items1: CreateOrderDto = {
    items: [{ productId: productOne.id, quantity: 1 }],
  };
  const items2: CreateOrderDto = {
    items: [{ productId: productTwo.id, quantity: 2 }],
  };
  const items3: CreateOrderDto = {
    items: [{ productId: productThree.id, quantity: 3 }],
  };

  // Create one order as User #1
  await request(app)
    .post("/api/orders/user")
    .set("Authorization", userOne)
    .send(items1)
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", userTwo)
    .send(items2)
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", userTwo)
    .send(items3)
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders/user")
    .set("Authorization", userTwo)
    .expect(200);

  // Assertions
  expect(response.body.length).toEqual(2);
  const orderIds = response.body.map((order: any) => order.id);
  expect(orderIds).toContain(orderOne.id);
  expect(orderIds).toContain(orderTwo.id);

  const productIds = response.body.flatMap((order: any) =>
    order.orderItems.map((item: any) => item.productId)
  );
  expect(productIds).toContain(productTwo.id);
  expect(productIds).toContain(productThree.id);
});
it("returns 401 if user is not authenticated", async () => {
  await request(app).get("/api/orders/user").send().expect(401);
});

it("200 for authenticated user fetches correct orders", async () => {
  // Setup
  const productA = await buildProduct(randomUUID());
  const productB = await buildProduct(randomUUID());

  const userA = global.signin("USER");
  const userB = global.signin("USER");

  const itemsA: CreateOrderDto = {
    items: [{ productId: productA.id, quantity: 1 }],
  };

  const itemsB: CreateOrderDto = {
    items: [{ productId: productB.id, quantity: 2 }],
  };

  // User A creates 1 order
  await request(app)
    .post("/api/orders/user")
    .set("Authorization", userA)
    .send(itemsA)
    .expect(201);

  // User B creates 1 order
  const { body: orderB } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", userB)
    .send(itemsB)
    .expect(201);

  // Fetch orders for User B
  const response = await request(app)
    .get("/api/orders/user")
    .set("Authorization", userB)
    .expect(200);

  // Validate
  expect(response.body.length).toBe(1);
  expect(response.body[0].id).toBe(orderB.id);
  expect(response.body[0].orderItems[0].productId).toBe(productB.id);
});
