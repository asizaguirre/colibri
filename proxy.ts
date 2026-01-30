import { proxy } from "next/server";
import { getToken } from "next-auth/jwt";

export default proxy(async (req) => {
  const url = new URL(req.url);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protege /dashboard
  if (url.pathname.startsWith("/dashboard") && !token) {
    return Response.redirect(new URL("/login", req.url)); // redireciona para login
  }

  // Protege /rede
  if (url.pathname.startsWith("/rede") && !token) {
    return new Response("Não autorizado", { status: 401 });
  }

  // Se não cair em nenhuma regra, segue normalmente
  return;
});