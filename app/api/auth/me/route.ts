// app/api/auth/me/route.ts
import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { findUserById } from "@/lib/data-utils";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-me"
);
const COOKIE_NAME = "session";

export async function GET() {
  const tokenCookie = cookies().get(COOKIE_NAME);

  if (!tokenCookie) {
    return NextResponse.json(
      { user: null, message: "No session token found." },
      { status: 401 }
    );
  }

  try {
    // Verify and decode the JWT
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);

    // Re-fetch user from database to ensure data is fresh
    // This prevents using stale data if user details change during the session
    const user = await findUserById(payload.userId as string);

    if (!user) {
      // User existed in token but not in database anymore - log them out
      cookies().delete(COOKIE_NAME);
      return NextResponse.json(
        { user: null, message: "User not found." },
        { status: 401 }
      );
    }

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Auth 'me' API error:", error);
    // Clear potentially invalid cookie
    cookies().delete(COOKIE_NAME);
    return NextResponse.json(
      { user: null, message: "Invalid session token." },
      { status: 401 }
    );
  }
}
