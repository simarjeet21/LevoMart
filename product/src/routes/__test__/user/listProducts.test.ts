// #### 🔹 `GET /api/products`

import { app } from "../../../app";
import { Product } from "../../../models/product";

import request from "supertest";

// * ✅ 200 with public product list
// * ✅ Filters out blocked/inactive items
// * ✅ Includes pagination or sorting (if implemented)

it("returns 200 with all products", async () => {
  await Product.create([
    {
      name: "iPhone",
      price: 999,
      userId: "user1",
      category: "Electronics",
    },
    {
      name: "Laptop",
      price: 1500,
      userId: "user2",
      category: "Computers",
    },
  ]);

  const res = await request(app).get("/api/products").expect(200);

  expect(res.body.length).toBe(2);
  // expect(res.body[0].name).toBe("iPhone");
  // expect(res.body[1].name).toBe("Laptop");
});

it("returns an empty list when no products exist", async () => {
  const res = await request(app).get("/api/products").expect(200);

  expect(res.body).toEqual([]);
});
// it("supports pagination if implemented", async () => {
//   for (let i = 0; i < 25; i++) {
//     await Product.create({
//       name: `Product ${i}`,
//       price: 10 + i,
//       userId: `user${i}`,
//     });
//   }

//   const res = await request(app).get("/api/products?limit=10&page=2").expect(200);

//   expect(res.body.length).toBe(10);
//   expect(res.body[0].name).toBe("Product 10");
// });
it("returns products with id, name, price, category, etc.", async () => {
  const product = await Product.create({
    name: "Test Product",
    price: 123,
    userId: "user123",
    category: "Books",
    description: "Great book",
    stock: 5,
  });

  const res = await request(app).get("/api/products").expect(200);

  expect(res.body[0]).toMatchObject({
    id: product.id,
    name: "Test Product",
    price: 123,
    category: "Books",
    description: "Great book",
    stock: 5,
  });
});
