import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({ where: { id } });
    res.json(user);
  } else if (req.method === "PUT") {
    const { email, name } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { email, name },
    });
    res.json(user);
  } else if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Usuário excluído" });
  } else {
    res.status(405).end();
  }
}