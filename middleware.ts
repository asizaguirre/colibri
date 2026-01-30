import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redireciona não autenticados para a página de Login
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/agendamentos/:path*"],
};