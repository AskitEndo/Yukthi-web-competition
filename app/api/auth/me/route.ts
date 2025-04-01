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
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);

  if (!tokenCookie) {
    return NextResponse.json(
      { user: null, message: "No session token found." },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
    const user = await findUserById(payload.userId as string);

    if (!user) {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json(
        { user: null, message: "User not found." },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Auth 'me' API error:", error);
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json(
      { user: null, message: "Invalid session token." },
      { status: 401 }
    );
  }
}
