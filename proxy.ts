import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: Request) {
  const url = new URL(req.url);
  // getToken requer 'req' como NextRequest ou objeto compatível.
  // Em proxy.ts (Next.js 16), 'req' é Request padrão.
  // O cast ou adaptação pode ser necessário dependendo da versão exata do next-auth.
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });

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