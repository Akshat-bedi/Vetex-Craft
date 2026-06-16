import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { UserRole } from "@/types/auth";

const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPERADMIN"];

export function isAdminRole(role: UserRole | string | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role as UserRole);
}

export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      const jwt = token as JWT;
      if (user) {
        jwt.id = user.id!;
        jwt.role = user.role;
      }
      return jwt;
    },
    async session({ session, token }) {
      const jwt = token as JWT;
      if (session.user) {
        session.user.id = jwt.id;
        session.user.role = jwt.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      if (!nextUrl.pathname.startsWith("/admin")) {
        return true;
      }

      const isLoggedIn = !!auth?.user;
      const hasAdminRole = isAdminRole(auth?.user?.role);

      return isLoggedIn && hasAdminRole;
    },
  },
} satisfies NextAuthConfig;
