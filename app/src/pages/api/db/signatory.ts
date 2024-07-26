import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { signatoryData } = req.body;
    console.log("Received signatory data:", signatoryData);

    try {
      const { firstName, lastName, email, hasSigned, idDocument } =
        signatoryData;

      if (!idDocument) {
        return res.status(400).json({ message: "idDocument is required" });
      }

      // Vérifier si le document existe
      const documentExists = await prisma.document.findUnique({
        where: { idDocument },
      });

      if (!documentExists) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Vérifier si le signataire existe déjà
      const existingSignatory = await prisma.signatory.findUnique({
        where: { email },
      });

      if (existingSignatory) {
        // Si le signataire existe, ajouter une entrée dans la table Sign
        const existingSign = await prisma.sign.findUnique({
          where: {
            idDocument_idSignatory: {
              idDocument,
              idSignatory: existingSignatory.idSignatory,
            },
          },
        });

        if (!existingSign) {
          await prisma.sign.create({
            data: {
              idDocument,
              idSignatory: existingSignatory.idSignatory,
            },
          });
        }

        return res.status(200).json({
          message: "Signatory already exists and associated with the document",
          signatory: existingSignatory,
        });
      } else {
        // Créer un nouveau signataire et l'associer au document
        const newSignatory = await prisma.signatory.create({
          data: {
            firstName,
            lastName,
            email,
            hasSigned,
            signs: {
              create: {
                document: {
                  connect: { idDocument },
                },
              },
            },
          },
        });

        return res.status(201).json({
          message: "Signatory created and associated with the document",
          signatory: newSignatory,
        });
      }
    } catch (error) {
      console.error("Error processing signatory:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PATCH") {
    const { idSignatory, hasSigned } = req.body;

    try {
      const updatedSignatory = await prisma.signatory.update({
        where: { idSignatory },
        data: { hasSigned },
      });

      return res.status(200).json({
        message: "Signatory updated",
        signatory: updatedSignatory,
      });
    } catch (error) {
      console.error("Error updating signatory:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "GET") {
    const { email, idDocument } = req.query;

    try {
      const signatory = await prisma.signatory.findUnique({
        where: { email: email as string },
        include: { signs: true },
      });

      if (!signatory) {
        return res.status(404).json({ message: "Signatory not found" });
      }

      const sign = signatory.signs.find(
        (sign) => sign.idDocument === idDocument
      );

      if (!sign) {
        return res
          .status(404)
          .json({ message: "Document not found for signatory" });
      }

      const document = await prisma.document.findUnique({
        where: { idDocument: sign.idDocument },
      });

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      return res.status(200).json({ message: "Document retrieved", document });
    } catch (error) {
      console.error("Error retrieving document:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "PATCH", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
