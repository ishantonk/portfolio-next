import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};

// Authenticated user trying to access /login
// if (isLoggedIn && pathname === "/login") {
//   return NextResponse.redirect(new URL("/dashboard", request.url));
// }

// // Unauthenticated user trying to access /dashboard
// if (!isLoggedIn && pathname.startsWith("/dashboard")) {
//   return NextResponse.redirect(new URL("/login", request.url));
// }
