import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  providers: [],

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      if (pathname.startsWith("/dashboard")) {
        return isLoggedIn;
      }

      if (pathname === "/login" && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = String(token.role ?? "CUSTOMER");
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
