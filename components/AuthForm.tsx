// components/AuthForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogIn,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  KeyRound,
  User,
  Zap,
  ArrowRight,
} from "lucide-react";

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
          await login(data.user);

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
    <div className="max-w-md mx-auto mt-10">
      {/* Comic book style card with thick border */}
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative">
        {/* Comic style header strip */}
        <div className="bg-yellow-400 py-3 px-6 border-b-4 border-black relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
              backgroundSize: "6px 6px",
            }}
          ></div>
          <div className="relative flex items-center justify-center">
            <h2 className="text-2xl font-extrabold text-black uppercase tracking-wider flex items-center font-boldonse">
              {isLogin ? (
                <>
                  <LogIn className="mr-2 h-6 w-6" strokeWidth={3} />
                  HERO LOGIN
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-6 w-6" strokeWidth={3} />
                  JOIN THE LEAGUE
                </>
              )}
            </h2>
            <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 border-[3px] border-black rounded-full"></div>
          </div>
        </div>

        {/* Form content */}
        <div className="p-6 relative">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: "10px 10px",
            }}
          ></div>

          {/* Error/Success Message */}
          {error && (
            <div className="mb-6 relative">
              <div
                className={`${
                  error.includes("successful")
                    ? "bg-green-100 border-green-400"
                    : "bg-red-100 border-red-400"
                } border-[3px] border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)]`}
              >
                <div className="flex items-center">
                  {error.includes("successful") ? (
                    <CheckCircle
                      className="h-5 w-5 text-green-600 mr-2"
                      strokeWidth={3}
                    />
                  ) : (
                    <AlertTriangle
                      className="h-5 w-5 text-red-600 mr-2"
                      strokeWidth={3}
                    />
                  )}
                  <p
                    className={`${
                      error.includes("successful")
                        ? "text-green-700"
                        : "text-red-700"
                    } font-bold font-space`}
                  >
                    {error}
                  </p>
                </div>
              </div>
              <div
                className={`absolute -top-2 -right-2 h-4 w-4 ${
                  error.includes("successful") ? "bg-green-500" : "bg-red-500"
                } border-2 border-black rounded-full`}
              ></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Username Input */}
            <div className="relative group">
              <label
                htmlFor="username"
                className="block text-sm font-bold text-black mb-1 uppercase flex items-center font-boldonse"
              >
                <User className="h-4 w-4 mr-1 inline-block" strokeWidth={3} />
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your superhero name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-black mb-1 uppercase flex items-center font-boldonse"
              >
                <KeyRound
                  className="h-4 w-4 mr-1 inline-block"
                  strokeWidth={3}
                />
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Super secret code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white border-[3px] border-black rounded-lg focus:outline-none text-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all font-space"
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 border-2 border-black rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 relative group">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 border-[3px] border-black rounded-lg font-extrabold text-white uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0)] transform transition-all hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : isLogin
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-green-600 hover:bg-green-500"
                } focus:outline-none font-boldonse`}
              >
                <div className="flex items-center justify-center">
                  <Zap className="h-5 w-5 mr-2" strokeWidth={3} />
                  {isLoading
                    ? "PROCESSING..."
                    : isLogin
                    ? "SIGN IN!"
                    : "CREATE ACCOUNT!"}
                </div>
              </button>
              <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
            </div>
          </form>

          {/* Switch between Login/Register - IMPROVED WITH COMIC STYLING */}
          <div className="relative mt-8 py-3 border-t-2 border-dashed border-black">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 border-2 border-black px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-black uppercase font-boldonse">
                OR
              </span>
            </div>

            <div className="text-center mt-2">
              <p className="text-sm text-black mb-3 font-space">
                {isLogin
                  ? "Don't have an account yet?"
                  : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                disabled={isLoading}
                className="relative inline-block group"
              >
                <div
                  className={`bg-${
                    isLogin ? "green" : "blue"
                  }-400 border-[2px] border-black rounded-lg py-2 px-4 text-center font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0)] transform transition-all group-hover:translate-y-[-2px] group-hover:shadow-[2px_4px_0px_0px_rgba(0,0,0)] font-boldonse`}
                >
                  <span className="flex items-center justify-center">
                    {isLogin ? (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" strokeWidth={3} />
                        Register Now
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-1" strokeWidth={3} />
                        Back to Login
                      </>
                    )}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-500 border-[1px] border-black rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
