import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔹 Se não estiver logado, redireciona para /login
  if (!token) {
    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/consultas")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 🔹 Proteção por role
  if (url.pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url.pathname.startsWith("/consultas") && token.role !== "PROFESSIONAL") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}