import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl;

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

  // 🔹 Se passou nas verificações, segue normalmente
  return NextResponse.next();
}

// Configuração para aplicar o middleware apenas nas rotas necessárias
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/consultas/:path*"],
};