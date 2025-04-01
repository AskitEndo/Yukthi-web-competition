// app/api/auth/register/route.ts
import "server-only";
import { getUsers, saveUsers, findUserByUsername } from "@/lib/data-utils";
import { User } from "@/lib/types";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // Need to install uuid: npm install uuid @types/uuid

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    // Basic validation (add more robust checks in a real app)
    if (password.length < 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 4 characters long.",
        },
        { status: 400 }
      );
    }
    if (username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Username must be at least 3 characters long.",
        },
        { status: 400 }
      );
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username already exists." },
        { status: 409 }
      ); // 409 Conflict
    }

    const users = await getUsers();
    const newUser: User = {
      id: uuidv4(), // Generate a unique ID
      username: username,
      password: password, // Storing plaintext - INSECURE
      isAdmin: false, // New users are not admins
    };

    users.push(newUser);
    const saved = await saveUsers(users);

    if (saved) {
      // Don't send password back
      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json(
        { success: true, user: userWithoutPassword },
        { status: 201 }
      ); // 201 Created
    } else {
      throw new Error("Failed to save user data.");
    }
  } catch (error) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
