import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      console.log("Received email:", email);

      const user = await prisma.user.findUnique({
        where: { email: email },
        include: { envelopes: true },
      });

      console.log("User data:", user);

      if (user?.idEnvelope) {
        return res.status(200).json({
          message: "User already has an envelope",
          envelope: user.envelopes,
        });
      }

      const newEnvelope = await prisma.envelope.create({
        data: {
          name: "Default Envelope",
          hash: "some-hash-value",
          User: { connect: { idUser: user?.idUser } },
        },
      });

      console.log("New envelope created:", newEnvelope);

      await prisma.user.update({
        where: { idUser: user?.idUser },
        data: { idEnvelope: newEnvelope.idEnvelope },
      });

      return res
        .status(200)
        .json({ message: "Envelope created", envelope: newEnvelope });
    } catch (error) {
      console.error("Error creating envelope:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "GET") {
    const { email } = req.query;

    try {
      console.log("Received email for GET:", email);

      const user = await prisma.user.findUnique({
        where: { email: email as string },
        include: { envelopes: true },
      });

      console.log("User data:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const envelope = user.envelopes;

      if (!envelope) {
        return res
          .status(404)
          .json({ message: "Envelope not found for this user" });
      }

      return res.status(200).json({ envelope });
    } catch (error) {
      console.error("Error retrieving envelope:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};
