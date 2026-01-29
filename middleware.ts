import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redireciona não autenticados para a Home
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/agendamentos/:path*"],
};