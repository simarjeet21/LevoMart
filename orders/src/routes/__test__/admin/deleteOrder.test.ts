// #### ✅ `DELETE /api/orders/admin/:id`

// * [x] 200 on success
// * [x] 401 unauthenticated
// * [x] 403 if not ADMIN
// * [x] 404 if order not found
import request from "supertest";
import { app } from "../../../app";
import { OrderStatus, prisma } from "../../../utils/prisma/prisma";

import { randomUUID } from "crypto";
jest.mock("../../../events/orderUpdated", () => ({
  orderUpdated: jest.fn(), // will replace the actual Kafka-related function
}));

// Helper function to create an order
// const createOrder = async () => {
//   const product = await prisma.product.create({
//     data: {
//       id: "prod_123",
//       name: "Test Product",
//       price: 100,
//       userId: "seller_123",
//       version: 0,
//     },
//   });

//   const order = await prisma.order.create({
//     data: {
//       userId: "user_123",
//       status: OrderStatus.CREATED,
//       expiresAt: new Date(Date.now() + 15 * 60 * 1000),
//       orderItems: {
//         create: [
//           {
//             productId: product.id,
//             productName: product.name,
//             productPrice: product.price,
//             sellerId: product.userId,
//             quantity: 1,
//             totalPrice: 100,
//           },
//         ],
//       },
//     },
//   });

//   return order;
// };
const createOrder = async () => {
  const productId = randomUUID();
  const sellerId = randomUUID();
  const product = await prisma.product.create({
    data: {
      id: productId,
      name: "Test Product",
      price: 100,
      userId: sellerId,
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

it("returns 200 on successful cancellation", async () => {
  const adminToken = global.signin("ADMIN");
  const order = await createOrder();
  // console.log("Order created:", order);

  const res = await request(app)
    .delete(`/api/orders/admin/${order.id}`)
    .set("Authorization", adminToken)
    .expect(200);

  expect(res.body.message).toBe("Order cancelled");
  expect(res.body.order.status).toBe("CANCELLED");

  const updated = await prisma.order.findUnique({
    where: { id: order.id },
  });
  expect(updated!.status).toBe(OrderStatus.CANCELLED);
});

it("returns 401 if unauthenticated", async () => {
  const order = await createOrder();

  await request(app).delete(`/api/orders/admin/${order.id}`).expect(401);
});

it("returns 403 if not ADMIN", async () => {
  const userToken = global.signin("USER");
  const order = await createOrder();

  await request(app)
    .delete(`/api/orders/admin/${order.id}`)
    .set("Authorization", userToken)
    .expect(403);
});

it("returns 404 if order not found", async () => {
  const adminToken = global.signin("ADMIN");

  await request(app)
    .delete(`/api/orders/admin/nonexistent-id`)
    .set("Authorization", adminToken)
    .expect(404);
});

//   it("returns 400 if order already cancelled", async () => {
//     const adminToken = global.signin("ADMIN");
//     const order = await createOrder();

//     await prisma.order.update({
//       where: { id: order.id },
//       data: { status: OrderStatus.CANCELLED },
//     });

//     const res = await request(app)
//       .delete(`/api/orders/admin/${order.id}`)
//       .set("Authorization", adminToken)
//       .expect(400);

//     expect(res.body.message).toBe("Order already cancelled");
//   });
