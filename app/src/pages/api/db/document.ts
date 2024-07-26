import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const documentData = req.body;

    console.log("Received document data:", documentData);
    try {
      console.log(documentData);
      console.log(JSON.parse(documentData).envelope.envelope.idEnvelope);

      const parseDocumentData = JSON.parse(documentData);
      const saveDocument = await prisma.document.create({
        data: {
          name: parseDocumentData.name,
          url: parseDocumentData.url,
          hash: parseDocumentData.hash,
          isSigned: parseDocumentData.isSigned,
          idEnvelope: parseDocumentData.envelope.envelope.idEnvelope,
        },
      });

      console.log("In document.ts");

      return res
        .status(201)
        .json({ message: "Document created", document: saveDocument });
    } catch (error) {
      console.error("Error creating document:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PATCH") {
    const { document } = req.body;
    console.log("Received document id and isSigned:", req.body);

    try {
      const documentData = await prisma.document.update({
        where: {
          idDocument: document.idDocument,
        },
        data: {
          ...document,
        },
      });

      return res
        .status(200)
        .json({ message: "Document updated", documentData });
    } catch (error) {
      console.error("Error updating document:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
