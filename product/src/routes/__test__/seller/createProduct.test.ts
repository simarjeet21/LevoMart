// #### 🔹 `POST /api/seller/products`

// * ✅ 201 on successful creation done
// * ❌ 401 unauthenticated done
// * ❌ 403 if not sellerb done
// * ❌ 400 if required fields are missing (title, price, stock)
// * ❌ 400 for invalid price or stock (negative)
// * ❌ 400 for duplicate titles (if restricted)
// * ✅ Sanitization (e.g., no script tags)
import request from "supertest";
import { app } from "../../../app";

jest.mock("../../../events/productCreated", () => ({
  productCreated: jest.fn(), // will replace the actual Kafka-related function
}));

it("creates a product and returns 201", async () => {
  const token = global.signin("SELLER");

  const response = await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "New Product",
      price: 100,
      stock: 10,
      category: "Electronics",
      description: "Great device",
    })
    .expect(201);

  expect(response.body.name).toEqual("New Product");
  expect(response.body.price).toEqual(100);
  expect(response.body.stock).toEqual(10);
});

it("returns 401 if user is not authenticated", async () => {
  await request(app)
    .post("/api/products")
    .send({
      name: "Unauthorized",
      price: 50,
      stock: 5,
    })
    .expect(401);
});
//currently sending 401
it("returns 403 if user is not a seller or admin", async () => {
  const token = global.signin("USER");

  await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "Restricted Product",
      price: 200,
      stock: 5,
    })
    .expect(403);
});

it("returns 400 if name is missing", async () => {
  const token = global.signin("SELLER");

  await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      price: 100,
      stock: 10,
    })
    .expect(400);
});

it("returns 400 if price is missing", async () => {
  const token = global.signin("SELLER");

  await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "No Price",
      stock: 10,
    })
    .expect(400);
});
it("returns 400 if price or stock is negative", async () => {
  const token = global.signin("SELLER");

  await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "Negative Price",
      price: -50,
      stock: 5,
    })
    .expect(400);

  await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "Negative Stock",
      price: 100,
      stock: -10,
    })
    .expect(400);
});
it("returns 400 if product name already exists", async () => {
  const token = global.signin("SELLER");
  console.log(token);

  await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "Duplicate Product",
      price: 100,
      stock: 10,
    })
    .expect(201);

  await request(app)
    .post("/api/products")
    .set("Authorization", token)
    .send({
      name: "Duplicate Product",
      price: 200,
      stock: 5,
    })
    .expect(400); // Only if you have a unique constraint
});
// it("sanitizes HTML/script in product description", async () => {
//   const token = global.signin("SELLER");

//   const res = await request(app)
//     .post("/api/products")
//     .set("Authorization", token)
//     .send({
//       name: "Sanitized Product",
//       price: 50,
//       stock: 2,
//       description: "<script>alert('XSS')</script>",
//     })
//     .expect(201);

//   expect(res.body.description).not.toContain("<script>");
// });
