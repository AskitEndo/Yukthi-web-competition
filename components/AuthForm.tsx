// components/AuthForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiUrl = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear form
        setUsername("");
        setPassword("");

        if (isLogin) {
          // Use the login function from AuthContext
          await login(username, password);

          // Redirect logic
          const redirectPath =
            searchParams.get("redirect") || searchParams.get("next");
          if (redirectPath) {
            router.push(redirectPath);
          } else if (data.user.isAdmin) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        } else {
          // For registration success
          setIsLogin(true); // Switch to login view
          setError(
            "Registration successful! Please log in with your new account."
          );
        }
      } else {
        setError(
          data.message ||
            `An error occurred during ${isLogin ? "login" : "registration"}.`
        );
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
      setError(
        `An unexpected error occurred. Please check your connection and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            className={`mb-4 p-3 border rounded ${
              error.includes("successful")
                ? "bg-green-100 text-green-700 border-green-400"
                : "bg-red-100 text-red-700 border-red-400"
            }`}
          >
            {error}
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between mb-6">
          <button
            className={`w-full ${
              isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>
        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="ml-2 font-bold text-blue-500 hover:text-blue-800 focus:outline-none"
            disabled={isLoading}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
