// app/api/auth/login/route.ts
import "server-only"; // Ensures this code runs only on the server
import { findUserByUsername } from "@/lib/data-utils"; // Adjust path if needed
import { NextResponse } from "next/server";
import { SignJWT } from "jose"; // Using jose for JWT: npm install jose
import { cookies } from "next/headers"; // Import cookies

// Define secret key (store securely in environment variables in real app)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-me"
); // CHANGE THIS and use env var
const COOKIE_NAME = "session";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    const user = await findUserByUsername(username);

    // !! VERY INSECURE - Comparing plaintext passwords !!
    // In a real app, use password hashing (e.g., bcrypt)
    if (user && user.password === password) {
      // Create JWT Payload
      const payload = {
        userId: user.id,
        username: user.username,
        isAdmin: user.isAdmin || false,
      };

      // Create JWT
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h") // Set session duration (e.g., 1 hour)
        .sign(JWT_SECRET);

      // Set cookie - Add await here
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true, // Crucial: prevents client-side JS access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        path: "/",
        maxAge: 60 * 60, // 1 hour in seconds, matches JWT expiration
        sameSite: "lax", // Good default for CSRF protection
      });

      // Login successful
      // Don't send the password back to the client!
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ success: true, user: userWithoutPassword });
    } else {
      // Login failed
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
