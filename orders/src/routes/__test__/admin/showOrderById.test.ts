// #### ✅ `GET /api/orders/admin/:id`

// * [x] 200 with specific order
// * [x] 401 unauthenticated
// * [x] 403 if not ADMIN
// * [x] 404 if order not found
import request from "supertest";
import { app } from "../../../app";
import { OrderStatus, prisma } from "../../../utils/prisma/prisma";

const buildOrder = async () => {
  const product = await prisma.product.create({
    data: {
      id: "prod_test_1",
      name: "Admin Test Product",
      price: 100,
      userId: "seller_001",
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: "test_user",
      status: OrderStatus.CREATED,
      expiresAt: new Date(Date.now() + 60 * 1000),
      orderItems: {
        create: [
          {
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            sellerId: product.userId,
            quantity: 1,
            totalPrice: 100,
          },
        ],
      },
    },
    include: { orderItems: true },
  });

  return order;
};

it("returns 200 with specific order if admin", async () => {
  const adminToken = global.signin("ADMIN");
  const order = await buildOrder();

  const res = await request(app)
    .get(`/api/orders/admin/${order.id}`)
    .set("Authorization", adminToken)
    .expect(200);

  expect(res.body.id).toEqual(order.id);
  expect(res.body.orderItems.length).toBeGreaterThan(0);
});

it("returns 401 if not authenticated", async () => {
  await request(app).get("/api/orders/admin/randomid").expect(401);
});

it("returns 403 if user is not admin", async () => {
  const token = global.signin("USER");
  await request(app)
    .get("/api/orders/admin/someid")
    .set("Authorization", token)
    .expect(403);
});

it("returns 404 if order not found", async () => {
  const adminToken = global.signin("ADMIN");
  await request(app)
    .get("/api/orders/admin/nonexistent-id")
    .set("Authorization", adminToken)
    .expect(404);
});
