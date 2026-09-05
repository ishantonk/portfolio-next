import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();

  const isLoggedIn = !!session?.user;
  const pathname = request.nextUrl.pathname;

  console.log("Protected route:", pathname);
  console.log("Logged in:", isLoggedIn);
  
  // User is NOT logged in → protect page
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
