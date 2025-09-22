// #### 🔹 `DELETE /api/seller/products/:id`

// * ✅ 200 on successful delete doen
// * ❌ 401 unauthenticated done
// * ❌ 403 if not seller done
// * ❌ 403 if not owner done
// * ❌ 404 if product not found done
// * ✅ Should ensure no active orders before deletion (optional)
import request from "supertest";
import { app } from "../../../app";
jest.mock("../../../events/productCreated", () => ({
  productCreated: jest.fn(), // will replace the actual Kafka-related function
}));
it("returns 204 and deletes product if seller owns it", async () => {
  const token = global.signin("SELLER");

  const res = await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "To Be Deleted",
      price: 50,
      stock: 5,
      category: "Books",
      description: "Delete this later",
    })
    .expect(201);

  await request(app)
    .delete(`/api/products/${res.body.id}`)
    .set("Authorization", token)
    .expect(204);
});

it("returns 401 if user is not authenticated", async () => {
  await request(app).delete("/api/products/someId").expect(401);
});
//currently sending 401
it("returns 403 if user is not a seller or admin", async () => {
  const token = global.signin("USER");

  await request(app)
    .delete("/api/products/someId")
    .set("Authorization", token)
    .expect(403);
});
//currently sending 401
it("returns 403 if seller tries to delete another seller's product", async () => {
  const seller1 = global.signin("SELLER");
  const seller2 = global.signin("SELLER");

  const res = await request(app)
    .post("/api/products")
    .set("Authorization", seller1)
    .send({
      name: "Owned by Seller1",
      price: 100,
      stock: 10,
    })
    .expect(201);

  await request(app)
    .delete(`/api/products/${res.body.id}`)
    .set("Authorization", seller2)
    .expect(403);
});
it("allows admin to delete any product", async () => {
  const seller = global.signin("SELLER");
  const admin = global.signin("ADMIN");

  const res = await request(app)
    .post("/api/products")
    .set("Authorization", seller)
    .send({
      name: "Admin Can Delete",
      price: 120,
      stock: 15,
    })
    .expect(201);

  await request(app)
    .delete(`/api/products/${res.body.id}`)
    .set("Authorization", admin)
    .expect(204);
});
it("returns 404 if product doesn't exist", async () => {
  const token = global.signin("SELLER");

  await request(app)
    .delete("/api/products/64eabf8e16d3202f11111111") // valid ObjectId format
    .set("Authorization", token)
    .expect(404);
});
// it("returns 400 for invalid ObjectId format", async () => {
//   const token = global.signin("SELLER");

//   await request(app)
//     .delete("/api/products/invalid-id")
//     .set("Authorization", token)
//     .expect(400);
// });
// it("returns 400 if product has active orders (if enforced)", async () => {
//   const token = global.signin("SELLER");

//   // Create product and simulate attaching it to an order (e.g., set orderId or related collection)

//   // Expect 400 or custom error response
// });
