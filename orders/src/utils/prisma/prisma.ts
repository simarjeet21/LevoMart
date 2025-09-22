// //import { PrismaClient } from "../../../prisma/generated/test-client"; // normal schema
// import testClient from "../../../prisma/generated/test-client";
// // production.ts
// // import { PrismaClient } from "../generated/prod-client";
// //import { PrismaClient } from "../../../prisma/generated/test-client";

// // test.ts
// // prisma.ts
// //let PrismaClient: any;
// // let prisma: any;
// // let Prisma: any;
// let OrderStatus: any;
// // let prisma: any;

// // if (process.env.NODE_ENV === "test") {
// //   const { PrismaClient } = require("../../../prisma/generated/test-client");
// //   prisma = new PrismaClient();
// // } else {
// //   const { PrismaClient } = require("../../../prisma/generated/prod-client");
// //   prisma = new PrismaClient();
// // }

// // export { prisma };

// // const prismaPromise = getPrismaClient();

// // export { prismaPromise as prisma };
// //xport const prisma: PrismaClient = await getPrismaClient();
// const PrismaClient = testClient.PrismaClient;
// OrderStatus = testClient.OrderStatus;
// const prisma = new testClient.PrismaClient();

// export { prisma, testClient, OrderStatus };

// // const testClient = require("../../../prisma/generated/test-client");
// // PrismaClient = testClient.PrismaClient;
// // Prisma = testClient.Prisma;
// //OrderStatus = testClient.OrderStatus;

// // prisma = new PrismaClient();

// // export { prisma, Prisma, OrderStatus };
// prisma.ts - Fixed version
// import testClient from "../../../prisma/generated/test-client";

// // Export the types and client properly
// export const PrismaClient = testClient.PrismaClient;
// export const OrderStatus = testClient.OrderStatus;
// export const prisma = new testClient.PrismaClient();

// // Export the entire testClient for type access
// export { testClient };

// // Export the type of the client instance for better typing
// export type PrismaClientType = typeof prisma;
// import {
//   PrismaClient,
//   OrderStatus,
// } from "../../../prisma/generated/test-client";
// const prisma = new PrismaClient();

// export { PrismaClient, OrderStatus, prisma };
// export type PrismaClientType = typeof prisma;
//import type { PrismaClient as PrismaClientType } from "../../../prisma/generated/test-client";

import type { PrismaClient as TestPrismaClientType } from "../../../prisma/generated/test-client";
import type { PrismaClient as ProdPrismaClientType } from "../../../prisma/generated/prod-client";
type UnifiedPrismaClient = ProdPrismaClientType;
import * as testClient from "../../../prisma/generated/test-client";
import * as prodClient from "../../../prisma/generated/prod-client";
//import prodClient from "../../../prisma/generated/";
// Determine which client to use based on environment
const isTestEnvironment =
  process.env.NODE_ENV === "test" ||
  process.env.NODE_ENV === "testing" ||
  process.env.DATABASE_TYPE === "test";
//const isTestEnvironment = true;
// console.log(
//   "Using environmenthwecruherioshrgioniodynvsuibhgveuisghruivhnfgiuvhiufhbiufgyiobvioyfb8ilvfhgiuvbyguiyibhibhviby:",
//   process.env.NODE_ENV
// );
// let PrismaClient:
//   | typeof testClient.PrismaClient
//   | typeof prodClient.PrismaClient;
//let PrismaClient: typeof UnifiedPrismaClient;
let prisma: UnifiedPrismaClient;
let OrderStatus: any;

// const safeRequire = (path: string, clientType: string) => {
//   try {
//     return require(path);
//   } catch (error) {
//     console.error(`Failed to load ${clientType} client from ${path}:`, error);
//     throw new Error(
//       `${clientType} client not found. Make sure to generate the ${clientType} client first.`
//     );
//   }
// };
if (isTestEnvironment) {
  // Load test client (SQLite)
  //   const testClient = safeRequire(
  //     "../../../prisma/generated/test-client",
  //     "test"
  //   );

  // PrismaClient = testClient.PrismaClient;
  OrderStatus = testClient.OrderStatus;
  prisma = new testClient.PrismaClient() as UnifiedPrismaClient;
  console.log("✓ Using SQLite test client");
} else {
  // Load production client (PostgreSQL)
  //   const prodClient = safeRequire(
  //     "../../../prisma/generated/prod-client",
  //     "production"
  //   );
  //PrismaClient = prodClient.PrismaClient;
  OrderStatus = prodClient.OrderStatus;
  prisma = new prodClient.PrismaClient() as UnifiedPrismaClient;
  console.log("✓ Using PostgreSQL production client");
}
// if (!PrismaClient) {
//   throw new Error(
//     `PrismaClient not found for environment: ${process.env.NODE_ENV}`
//   );
// }
// Create the client instance with environment-specific configuration
// prisma = new PrismaClient({
//   // Logging configuration
//   log: isTestEnvironment
//     ? ["error"] // Minimal logging for tests
//     : ["query", "info", "warn", "error"], // Full logging for production

//   // Error formatting
//   errorFormat: isTestEnvironment ? "minimal" : "pretty",

//   // Connection settings (adjust based on your needs)
//   datasources: {
//     db: {
//       url: isTestEnvironment
//         ? process.env.TEST_DATABASE_URL
//         : process.env.DATABASE_URL,
//     },
//   },
// });
// prisma = new testClient.PrismaClient();
// Graceful shutdown handling
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
// Export everything
export { OrderStatus, prisma };

// Export the type of the client instance for better typing
// export type PrismaClientType = typeof prisma;
//export type PrismaClientType = ProdPrismaClientType;
export type { UnifiedPrismaClient as PrismaClientType };
//export type { PrismaClientType };
