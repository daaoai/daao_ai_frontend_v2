import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { publicKey } = req.body;
    console.log("Public Key:", publicKey);

    // Validate input
    if (!publicKey) {
      return res.status(400).json({ error: "Public key is required" });
    }

    try {
      // Create a new waiting-list entry
      const waitingEntry = await prisma.waitingList.create({
        data: { publicKey},
      });

      return res.status(200).json(waitingEntry);
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Public key already exists" });
      }
      console.error("Error creating waiting entry:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    // Only allow POST requests
    return res
      .status(405)
      .json({ error: `Method ${req.method} not allowed` });
  }
}
