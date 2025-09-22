import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../utils/prisma/prisma";
import { CreateOrderDto } from "../../../types/dtos/create-order.dto";
import { randomUUID } from "crypto";

// * [x] 200 if user owns order done
// * [x] 401 unauthenticated done
// * [x] 403 if accessing other user’s order
// * [x] 404 if order doesn’t exist

it("fetches the order", async () => {
  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: "Test Product",
      price: 100,
      userId: randomUUID(),
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

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", user)
    .send(items)
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/user/${order.id}`)
    .set("Authorization", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("401 unauthenticated", async () => {
  const fakeOrderId = randomUUID();
  await request(app).get(`/api/orders/user/${fakeOrderId}`).send().expect(401);
});

it("404 if order doesnt exist", async () => {
  const fakeOrderId = randomUUID();
  await request(app)
    .get(`/api/orders/user/${fakeOrderId}`)
    .set("Authorization", global.signin("USER"))
    .send()
    .expect(404);
});

it("returns an error if one user tries to fetch another users order", async () => {
  // Create a ticket

  const userOneToken = global.signin("USER");
  const userTwoToken = global.signin("USER");
  // create a product to order
  const product = await prisma.product.create({
    data: {
      id: randomUUID(),
      name: "Test Product",
      price: 100,
      userId: randomUUID(),
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

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders/user")
    .set("Authorization", userOneToken)
    .send(items)
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/user/${order.id}`)
    .set("Authorization", userTwoToken)
    .send()
    .expect(401);
});
