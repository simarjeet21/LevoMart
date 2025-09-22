// * ✅ 200 returns all products
// * ❌ 401 unauthenticated
// * ❌ 403 non-admin

import { app } from "../../../app";
import { Product } from "../../../models/product";
import request from "supertest";

// * ✅ Filters inactive/flagged/blocked products if implemented
it("returns 200 and all products for admin", async () => {
  await Product.create([
    {
      name: "Product One",
      price: 100,
      userId: "user_1",
    },
    {
      name: "Product Two",
      price: 200,
      userId: "user_2",
    },
  ]);

  const res = await request(app)
    .get("/api/products/admin")
    .set("Authorization", global.signin("ADMIN"))
    .expect(200);

  expect(res.body.length).toBe(2);
  expect(res.body[0].name).toBe("Product One");
  expect(res.body[1].name).toBe("Product Two");
});

it("returns 401 if user is not authenticated", async () => {
  await request(app).get("/api/products/admin").expect(401);
});
// currently sending 401 not authorized
it("returns 403 if user is not an admin", async () => {
  await request(app)
    .get("/api/products/admin")
    .set("Authorization", global.signin("USER"))
    .expect(403);
});
// const products = await Product.find({ isBlocked: false }); // or `active: true`
// it("filters out blocked/inactive products if implemented", async () => {
//   await Product.create([
//     {
//       name: "Visible Product",
//       price: 100,
//       userId: "user_1",
//       isBlocked: false,
//     },
//     {
//       name: "Blocked Product",
//       price: 200,
//       userId: "user_2",
//       isBlocked: true,
//     },
//   ]);

//   const res = await request(app)
//     .get("/api/products/admin")
//     .set("Authorization", global.signin("ADMIN"))
//     .expect(200);

//   expect(res.body.length).toBe(1);
//   expect(res.body[0].name).toBe("Visible Product");
// });
