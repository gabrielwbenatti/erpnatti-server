import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({});
const db = prismaClient;

export default db;
