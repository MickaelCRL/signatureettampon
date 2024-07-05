import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  try {
    console.log("Received email:", email);

    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { envelopes: true },
    });

    console.log("User data:", user);

    if (user?.idEnvelope) {
      return res.status(200).json({ message: "User already has an envelope" });
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
}
