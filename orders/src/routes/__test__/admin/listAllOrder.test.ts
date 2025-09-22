// #### ✅ `GET /api/orders/admin`

// * [x] 200 with all orders
// * [x] 401 unauthenticated
// * [x] 403 if not ADMIN
import request from "supertest";
import { app } from "../../../app";
import { OrderStatus, prisma } from "../../../utils/prisma/prisma";

// Utility to create a test order
const createOrder = async (userId: string, productId: string) => {
  return prisma.order.create({
    data: {
      userId,
      status: OrderStatus.CREATED,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      orderItems: {
        create: [
          {
            productId,
            productName: "Test Product",
            productPrice: 99,
            sellerId: "seller_123",
            quantity: 1,
            totalPrice: 99,
          },
        ],
      },
    },
  });
};

it("returns 200 and lists all orders for admin", async () => {
  const adminToken = global.signin("ADMIN");

  const product = await prisma.product.create({
    data: {
      id: "prod_abc",
      name: "Test Product",
      price: 99,
      userId: "seller_123",
      version: 0,
    },
  });

  await createOrder("user1", product.id);
  await createOrder("user2", product.id);

  const res = await request(app)
    .get("/api/orders/admin")
    .set("Authorization", adminToken)
    .expect(200);

  expect(res.body.length).toBeGreaterThanOrEqual(2);
  expect(res.body[0]).toHaveProperty("orderItems");
});

it("returns 401 if user is not authenticated", async () => {
  await request(app).get("/api/orders/admin").expect(401);
});

it("returns 403 if user is not admin", async () => {
  const userToken = global.signin("USER");

  await request(app)
    .get("/api/orders/admin")
    .set("Authorization", userToken)
    .expect(403);
});
