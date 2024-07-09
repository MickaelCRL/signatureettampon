import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
};
