import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: { 
              googleId: account.providerAccountId,
              image: user.image 
            },
            create: {
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              image: user.image,
              role: "PATIENT",
            },
          });
          return true;
        } catch (error) {
          console.error("Erro ao salvar usuário:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redireciona para o dashboard após login
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/",
  },
};