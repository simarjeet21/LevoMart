// src/utils/prisma/prismaTestUtils.ts
import { PrismaClient } from "../../generated/test-prisma-client";

export const prismaTest = new PrismaClient(); // used directly in test seeding
export { PrismaClient }; // used in mock factory
