// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-me"
); // Use the same secret
const COOKIE_NAME = "session";

// Define protected routes
const adminPaths = ["/admin"];
const protectedPaths = ["/events/[eventId]/book"]; // Add more user-protected routes here if needed

async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload; // Contains { userId, username, isAdmin }
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get(COOKIE_NAME);
  const token = tokenCookie?.value;

  let userPayload = null;
  if (token) {
    userPayload = await verifyToken(token);
  }

  const isAccessingAdmin = adminPaths.some((path) => pathname.startsWith(path));
  const isAccessingProtected = protectedPaths.some((pathPattern) => {
    // Basic matching for dynamic routes - refine if needed
    if (pathPattern.includes("[") && pathPattern.includes("]")) {
      const basePattern = pathPattern.split("/[")[0]; // e.g., /events
      return pathname.startsWith(basePattern);
    }
    return pathname.startsWith(pathPattern);
  });

  // --- Admin Route Protection ---
  if (isAccessingAdmin) {
    if (!userPayload || !userPayload.isAdmin) {
      console.log(`Redirecting: Unauthorized access attempt to ${pathname}`);
      // Redirect non-admins trying to access /admin to login or home
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("message", "Admin access required"); // Optional message
      return NextResponse.redirect(url);
    }
    // If admin, allow request
    return NextResponse.next();
  }

  // --- General Protected Route Protection (e.g., booking) ---
  if (isAccessingProtected) {
    if (!userPayload) {
      console.log(`Redirecting: Unauthorized access attempt to ${pathname}`);
      // Redirect logged-out users trying to access protected routes to login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname); // Remember where they wanted to go
      url.searchParams.set("message", "Please log in to continue");
      return NextResponse.redirect(url);
    }
    // If logged in (admin or regular user), allow request
    return NextResponse.next();
  }

  // Allow access to public routes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images) - Added this
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    // Explicitly include specific protected paths if needed for clarity
    "/admin/:path*",
    "/events/:eventId/book",
  ],
};
