import request from "supertest";
import { app } from "../../../app";

import { OrderStatus, prisma } from "../../../utils/prisma/prisma";
import { CreateOrderDto } from "../../../types/dtos/create-order.dto";
//import { OrderStatus } from "../../../../prisma/generated/test-client";
import { randomUUID } from "crypto";

// * [x] 200 on success done
// * [x] 401 unauthenticated done
// * [x] 403 if user doesn’t own order
// * [x] 404 if order not found
// * [x] stock is restored (optional)

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const token = global.signin("USER");
  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: "Test Product",
      price: 100,
      userId: "seller_123",
    },
  });

  const items: CreateOrderDto = {
    items: [
      {
        productId: product.id,
        quantity: 2,
      },
    ],
  };

  const { body: order } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", token)
    .send(items)
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/user/${order.id}`)
    .set("Authorization", token)
    .send();

  // expectation to make sure the thing is cancelled
  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
  });

  expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
});
it("returns 401 if user is not authenticated", async () => {
  await request(app)
    .delete(`/api/orders/user/${randomUUID()}`)
    .send()
    .expect(401);
});

it("returns 404 if order not found", async () => {
  const token = global.signin("USER");
  const fakeOrderId = randomUUID();

  await request(app)
    .delete(`/api/orders/user/${fakeOrderId}`)
    .set("Authorization", token)
    .send()
    .expect(404);
});

it("returns 403 if user tries to cancel another user's order", async () => {
  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: "Test Product",
      price: 200,
      userId: randomUUID(),
      version: 0,
    },
  });

  const userOne = global.signin("USER");
  const userTwo = global.signin("USER");

  const items: CreateOrderDto = {
    items: [{ productId: product.id, quantity: 1 }],
  };

  const { body: order } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", userOne)
    .send(items)
    .expect(201);

  await request(app)
    .delete(`/api/orders/user/${order.id}`)
    .set("Authorization", userTwo)
    .send()
    .expect(403);
});
