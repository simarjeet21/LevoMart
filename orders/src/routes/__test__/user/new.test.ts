import request from "supertest";
import { app } from "../../../app";

import { CreateOrderDto } from "../../../types/dtos/create-order.dto";
import { prisma } from "../../../utils/prisma/prisma";
import { randomUUID } from "crypto";

// * [x] 201 on successful creation  done
// * [x] 401 unauthenticated done
// * [x] 403 wrong role (SELLER/ADMIN) not needed,any one can create an order
// * [x] 400 missing productId
// * [x] 400 invalid productId (bad UUID/cuid)
// * [x] 400 invalid quantity (missing/0/negative)
// * [x] 404 product doesn't exist done
// * [x] 400 quantity > stock not now
// * [x] stock is decreased on success
// * [x] duplicate order (if disallowed) allowed
it("returns 404 if the product does not exist", async () => {
  const token = global.signin("USER");
  const items: CreateOrderDto = {
    items: [
      {
        productId: randomUUID(),
        quantity: 1,
      },
    ],
  };
  await request(app)
    .post("/api/orders/user")
    .set("Authorization", token)
    .send(items)
    .expect(404);
});
// it("returns 400 if quantity > stock");
it("returns 400 validation error if productId and quantity are missing", async () => {
  const token = global.signin("USER");

  await request(app)
    .post("/api/orders/user")
    .set("Authorization", token)
    .send({}) // missing 'items'
    .expect(400);

  await request(app)
    .post("/api/orders/user")
    .set("Authorization", token)
    .send({ items: [{}] }) // missing fields inside item
    .expect(400);
});

it("returns 400 validation error for invalid UUID productId or invalid quantity", async () => {
  const token = global.signin("USER");

  await request(app)
    .post("/api/orders/user")
    .set("Authorization", token)
    .send({
      items: [
        {
          productId: "bad-id", // not a UUID/cuid
          quantity: -3,
        },
      ],
    })
    .expect(400);
});
// it("stocks are decreased on successful order creation")
// it("duplicate order")
it("returns 201 on successful order creation", async () => {
  const token = global.signin("USER");
  // create a product to order
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

  const res = await request(app)
    .post("/api/orders/user")
    .set("Authorization", token)
    .send(items);

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.orderItems[0].productId).toBe(product.id);
  expect(res.body.orderItems[0].quantity).toBe(2);
});

it("returns 401 if user is not authenticated", async () => {
  const items: CreateOrderDto = {
    items: [
      {
        productId: "prod_123",
        quantity: 2,
      },
    ],
  };

  await request(app).post("/api/orders/user").send(items).expect(401);
});
// Optional future test
// it("returns 400 if quantity > stock");
// it("decreases stock on successful order");
// it("allows duplicate orders");
