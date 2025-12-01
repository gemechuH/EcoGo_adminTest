"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import logo from "@/assets/ecogo-logo.png";
import Link from "next/link";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { Loader2 } from "lucide-react"; // Imported Loader icon

const ECO_GREEN = "#1CA547";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("admin");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Login failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Full-screen background with a subtle, light color
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <style jsx global>{`
        /* Define the EcoGo brand color globally for better consistency */
        :root {
          --eco-green: ${ECO_GREEN};
        }
      `}</style>

      {/* 2. Constrained container for the card */}
      <div className="w-full max-w-[500px] space-y-4">
        {/* Logo and Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Image
              src={logo}
              alt="EcoGo Logo"
              width={80}
              height={80}
              // Rounded corners for a modern badge look
              className="rounded-2xl shadow-md"
            />
          </div>
          <div className="space-y-1">
            {/* Title: Using the brand color for emphasis */}
            <h1 className="text-3xl font-extrabold text-gray-800">
              Admin Dashboard
            </h1>
            {/* Subtitle: Using a muted text color */}
            <p className="text-sm text-gray-600">Drive Clean. Go Green.</p>
          </div>
        </div>

        {/* Login Card: Clean white, subtle shadow, rounded corners */}
        <Card className="shadow-2xl border border-gray-100 rounded-xl">
          <CardHeader className="pt-6">
            <CardTitle className="text-center font-bold text-2xl text-gray-800">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@ecogo.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  // Clean white input with border
                  className="bg-white border-gray-300 focus:border-[--eco-green] focus:ring-[--eco-green]"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  {/* Forgot Password Link: Using brand color */}
                  <button
                    type="button"
                    className="text-sm font-medium hover:underline transition-colors"
                    style={{ color: "var(--eco-green)" }}
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white border-gray-300 focus:border-[--eco-green] focus:ring-[--eco-green]"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Sign in as
                </Label>
                <div className="flex gap-2 ">
                  <Button
                    type="button"
                    disabled={loading}
                    // Conditional styling for role buttons
                    className="flex-1 transition-colors duration-200"
                    style={
                      role === "admin"
                        ? {
                            backgroundColor: "var(--eco-green)",
                            color: "white",
                            borderColor: "var(--eco-green)",
                          }
                        : {
                            backgroundColor: "white",
                            color: "gray",
                            borderColor: "var(--eco-green)",
                          }
                    }
                    variant={role === "admin" ? "default" : "outline"}
                    onClick={() => setRole("admin")}
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    disabled={loading}
                    className="flex-1 transition-colors duration-200"
                    style={
                      role === "operator"
                        ? {
                            backgroundColor: "var(--eco-green)",
                            color: "white",
                            borderColor: "var(--eco-green)",
                          }
                        : {
                            backgroundColor: "white",
                            color: "gray",
                            borderColor: "var(--eco-green)",
                          }
                    }
                    variant={role === "operator" ? "default" : "outline"}
                    onClick={() => setRole("operator")}
                  >
                    Operator
                  </Button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 rounded text-[--eco-green] border-gray-300 focus:ring-[--eco-green]"
                  style={{ accentColor: "var(--eco-green)" }} // Native checkbox color control
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              {/* Submit Button: Solid brand green */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-25 text-lg py-4 cursor-pointer hover:brightness-110 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--eco-green)",
                    color: "white",
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>SignIn...</span>
                      
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>

            {/* Footer Links and Copyright */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Need help? Contact{" "}
                <Link
                  href="mailto: support@ecogoclub.com"
                  className="font-medium hover:underline transition-colors"
                  style={{ color: "var(--eco-green)" }}
                >
                  support@ecogoclub.com
                </Link>
              </p>
              <p className="text-xs text-gray-400">
                &copy; 2025 EcoGo Management. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
