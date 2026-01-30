import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, name } = req.body;
    const user = await prisma.user.create({ data: { email, name } });
    res.redirect("/users");
  } else if (req.method === "GET") {
    const users = await prisma.user.findMany();
    res.json(users);
  } else {
    res.status(405).end();
  }
}