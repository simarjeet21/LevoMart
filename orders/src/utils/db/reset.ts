// import { prisma } from "../prisma/prisma";

// export const resetTestDB = async () => {
//   const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
//     SELECT table_name
//     FROM information_schema.tables
//     WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
//   `;

//   for (const { table_name } of tables) {
//     await prisma.$executeRawUnsafe(
//       `TRUNCATE TABLE "${table_name}" RESTART IDENTITY CASCADE;`
//     );
//   }
// };
// import { prisma } from "../prisma/prisma";

// export const resetTestDB = async () => {
//   const isSQLite = process.env.DATABASE_URL?.includes("sqlite");

//   if (isSQLite) {
//     const tables = await prisma.$queryRaw<
//       Array<{ name: string }>
//     >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`;

//     for (const { name } of tables) {
//       await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
//     }
//   } else {
//     const tables = await prisma.$queryRaw<
//       Array<{ table_name: string }>
//     >`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name NOT IN ('_prisma_migrations');`;

//     for (const { table_name } of tables) {
//       await prisma.$executeRawUnsafe(
//         `TRUNCATE TABLE "${table_name}" RESTART IDENTITY CASCADE;`
//       );
//     }
//   }
// // };
// import { prisma } from "../prisma/prisma";

// export const resetTestDB = async () => {
//   const isSQLite = process.env.DATABASE_URL?.includes("sqlite");

//   const tableNames = ["order_items", "orders", "products"]; // In correct deletion order due to foreign key

//   for (const table of tableNames) {
//     if (isSQLite) {
//       await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
//     } else {
//       await prisma.$executeRawUnsafe(
//         `DELETE FROM "${table}" RESTART IDENTITY CASCADE;`
//       );
//     }
//   }
// };
import { prisma } from "../prisma/prisma"; // adjust to your project path

export const resetTestDB = async () => {
  const tableNames = ["order_items", "orders", "products"]; // add your table names here

  for (const table of tableNames) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${table};`);
    // await prisma.$executeRawUnsafe(
    //   `DELETE FROM sqlite_sequence WHERE name='${table}';`
    // );
  }
};
