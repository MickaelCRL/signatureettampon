// lib/prismaExtensions.ts
import { Prisma } from "@prisma/client";
import prisma from "./prisma";

const updateSignatoryExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "update document isSigned to true when all signatory have signed",
    query: {
      signatory: {
        async update({ args, query }) {
          const result = await query(args);

          const signatoryId = args.where.idSignatory;

          const signs = await prisma.sign.findMany({
            where: { idSignatory: signatoryId },
            include: { document: true },
          });

          for (const sign of signs) {
            const documentId = sign.idDocument;
            const signatories = await prisma.sign.findMany({
              where: { idDocument: documentId },
              include: { signatory: true },
            });

            const allSigned = signatories.every(
              (sign) => sign.signatory.hasSigned
            );

            if (allSigned) {
              await prisma.document.update({
                where: { idDocument: documentId },
                data: { isSigned: true },
              });
            }
          }

          return result;
        },
      },
    },
  });
});

export default updateSignatoryExtension;
