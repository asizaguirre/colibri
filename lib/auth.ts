import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
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
              role: Role.PATIENT,
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
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};