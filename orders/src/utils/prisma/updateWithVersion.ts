// normal schema
//import { prisma, testClient, type PrismaClientType } from "./prisma";
import { prisma, type PrismaClientType } from "./prisma";
//import { testClient } from "./prisma";

// import {  } from "./prisma";
//import { PrismaClient } from tes; // normal schema
//let PrismaClient= testClient.PrismaClient

// Method 1: Using the client instance type
type PrismaTable = {
  [K in keyof PrismaClientType]: PrismaClientType[K] extends { updateMany: any }
    ? K
    : never;
}[keyof PrismaClientType];

// export async function updateWithVersion<
//   T extends PrismaTable,
//   K extends keyof PrismaClient[T]
// >(
//   prisma: PrismaClient,
//   table: T,
//   id: string,
//   currentVersion: number,
//   updateData: Record<string, any>
// ): Promise<boolean> {
//   const result = await (prisma[table] as any).updateMany({
//     where: {
//       id,
//       version: currentVersion,
//     },
//     data: {
//       ...updateData,
//       version: { increment: 1 },
//     },
//   });
//   return result.count === 1;
// }
export async function updateWithVersion<T extends PrismaTable>(
  prismaClient: PrismaClientType,
  table: T,
  id: string,
  currentVersion: number,
  updateData: Record<string, any>
): Promise<boolean> {
  const result = await (prismaClient[table] as any).updateMany({
    where: {
      id,
      version: currentVersion,
    },
    data: {
      ...updateData,
      version: { increment: 1 },
    },
  });
  return result.count === 1;
}
