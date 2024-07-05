import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ message: "Email is required and should be a string" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else if (req.method === "POST") {
    try {
      const userData = JSON.parse(req.body);
      const saveUser = await prisma.user.create({
        data: userData,
      });
      return res.status(201).json(saveUser);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }
};
