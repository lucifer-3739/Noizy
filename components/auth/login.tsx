"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🧩 Avoid SSR mismatches — render only after mounting
  if (!mounted) return null;

  const isDark = theme === "dark";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log("Login attempted with:", { email, password });
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`[v0] Social login with: ${provider}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card
        className="max-w-md relative z-10 border-transparent overflow-hidden w-full"
        style={{
          background: isDark
            ? "rgba(25, 25, 35, 0.35)"
            : "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(40px) saturate(200%)",
          border: isDark
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: isDark
            ? "0 32px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 32px 80px rgba(0, 0, 0, 0.2), inset 0 3px 0 rgba(255,255,255,0.6)",
        }}
      >
        {/* ✨ Liquid shimmer layer */}
        <div className="absolute inset-0 animate-[liquid_6s_infinite_linear] bg-[linear-gradient(120deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.05)_40%,transparent_100%)] opacity-60 pointer-events-none" />

        <CardHeader className="text-center space-y-2 relative z-10">
          <CardTitle className="text-3xl font-bold font-sans text-card-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-card-foreground/70 font-sans">
            Sign in to your account to Enjoy Noizly 👋
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* 🔐 Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-card-foreground font-sans"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border-white/30 bg-white/10 placeholder:text-card-foreground/50 text-card-foreground py-3 focus:ring-2 ${
                  isDark ? "focus:ring-blue-400" : "focus:ring-blue-600"
                } transition-all duration-200`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-card-foreground font-sans"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border-white/30 bg-white/10 placeholder:text-card-foreground/50 text-card-foreground py-3 focus:ring-2 ${
                  isDark ? "focus:ring-blue-400" : "focus:ring-blue-600"
                } transition-all duration-200`}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full font-sans font-bold py-5 transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: isDark ? "##7C3AED" : "##7C3AED",
                color: "white",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* 🌈 Divider */}
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-card-foreground/60 font-sans">
              Or continue with
            </span>
          </div>

          {/* ☁️ Social Login Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("Google")}
              className="w-full glass-effect border-white/30 text-card-foreground hover:bg-white/20 font-sans transition-all duration-300 hover:scale-[1.02]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
                  c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12
                  c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                  C34.046,6.053,29.268,4,24,4
                  C12.955,4,4,12.955,4,24
                  c0,11.045,8.955,20,20,20
                  c11.045,0,20-8.955,20-20
                  C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819
                  C14.655,15.108,18.961,12,24,12
                  c3.059,0,5.842,1.154,7.961,3.039
                  l5.657-5.657C34.046,6.053,29.268,4,24,4
                  C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192
                  l-6.19-5.238C29.211,35.091,26.715,36,24,36
                  c-5.202,0-9.619-3.317-11.283-7.946
                  l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303
                  c-0.792,2.237-2.231,4.166-4.087,5.571
                  c0.001-0.001,0.002-0.001,0.003-0.002
                  l6.19,5.238C36.971,39.205,44,34,44,24
                  C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span className="ml-2">Continue with Google</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSocialLogin("Apple")}
              className="w-full glass-effect border-white/30 text-card-foreground hover:bg-white/20 font-sans transition-all duration-300 hover:scale-[1.02]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 30 30"
                className="text-gray-800 dark:text-gray-100"
              >
                <path
                  fill="currentColor"
                  d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305
                  c0.138,4.109,3.695,5.55,3.756,5.55
                  c-0.061,0.077-0.537,1.963-1.947,3.94
                  C23.204,26.283,21.962,28,20.076,28
                  c-1.794,0-2.438-1.135-4.508-1.135
                  c-2.223,0-2.852,1.135-4.554,1.135
                  c-1.886,0-3.22-1.809-4.4-3.496
                  c-1.533-2.208-2.836-5.673-2.882-9
                  c-0.031-1.763,0.307-3.496,1.165-4.968
                  c1.211-2.055,3.373-3.45,5.734-3.496
                  c1.809-0.061,3.419,1.242,4.523,1.242
                  c1.058,0,3.036-1.242,5.274-1.242
                  C21.394,7.041,23.97,7.332,25.565,9.785z
                  M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247
                  c1.058-1.242,2.729-2.085,4.17-2.085
                  c0.092,1.61-0.491,3.189-1.533,4.339
                  C18.098,5.937,16.488,6.872,15.001,6.688z"
                />
              </svg>
              <span className="ml-2">Continue with Apple</span>
            </Button>
          </div>

          {/* 🔗 Footer Links */}
          <div className="text-center flex flex-col space-y-2 mt-4">
            <a
              href="#"
              className="text-sm text-card-foreground/70 hover:text-card-foreground font-sans transition-colors"
            >
              Forgot your password?
            </a>
            <a
              href="/sign-up"
              className="text-sm text-card-foreground/70 hover:text-card-foreground font-sans transition-colors"
            >
              Don’t have an account? Create one
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
