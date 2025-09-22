import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import jwt from "jsonwebtoken";

import { prisma } from "../utils/prisma/prisma";
import { resetTestDB } from "../utils/db/reset";

declare global {
  var signin: (role?: string) => string;
}

// beforeEach(async () => {
//   jest.clearAllMocks();

//   const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
//     SELECT table_name
//     FROM information_schema.tables
//     WHERE table_schema = 'public'
//       AND table_type = 'BASE TABLE'
//       AND table_name NOT IN ('_prisma_migrations');
//   `;

//   for (const { table_name } of tables) {
//     await prisma.$executeRawUnsafe(
//       `TRUNCATE TABLE "${table_name}" RESTART IDENTITY CASCADE;`
//     );
//   }
// });
beforeEach(async () => {
  jest.clearAllMocks();
  await resetTestDB();
});

afterAll(async () => {
  await prisma.$disconnect();
});

global.signin = (role = "ADMIN") => {
  const payload = {
    id: crypto.randomUUID(), // you can use faker or uuid
    email: process.env.TEST_EMAIL,
    role,
  };
  // const base64Key = process.env.JWT_KEY!;
  // const secret = Buffer.from(base64Key, "base64");
  // console.log("JWT secret:", secret);
  const token = jwt.sign(payload, "NewSecretKeyForJWTSigningPurposes12345678");

  //const token = jwt.sign(payload, process.env.JWT_KEY!);
  return `Bearer ${token}`;
};
