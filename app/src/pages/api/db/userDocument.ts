// pages/api/db/userDocument.ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "Email is required and must be a string" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
        include: {
          envelopes: {
            include: {
              documents: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const documents = user.envelopes?.documents || [];

      res.status(200).json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
