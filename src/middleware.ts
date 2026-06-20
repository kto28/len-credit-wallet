import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/api/auth/login", "/api/auth/session"];

export function middleware(request: NextRequest) {
  // Skip when no API mode configured (mock mode)
  if (process.env.NEXT_PUBLIC_API_MODE !== "mysql") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow public paths and API routes
  if (PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check session cookie
  const session = request.cookies.get("session")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
