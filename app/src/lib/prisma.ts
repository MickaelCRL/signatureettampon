import { PrismaClient } from "@prisma/client";
import updateSignatoryExtension from "./prismaExtensions";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(updateSignatoryExtension);
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export default prisma;
