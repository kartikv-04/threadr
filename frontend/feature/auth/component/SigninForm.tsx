"use client";

import { useState } from "react";
import Link from "next/link"; // Changed from useRouter
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "../auth.hook";
import { useRouter } from "next/navigation";

interface SigninFormData {
  email: string;
  password: string;
}

// RENAME: Changed from SignupForm to SigninForm
export default function SigninForm() {
  const { mutate, isPending, isError, error } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState<SigninFormData>({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Signin data:", form);
    mutate(form, {
            onSuccess: () => {
                // This runs ONLY if the login succeeds
                console.log("Login successful, redirecting...");
                router.push("/"); 
            },
            onError: (err) => {
                console.log("Login failed", err);
            }
        });
    
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 text-2xl font-semibold tracking-tight">
            <span className="text-white">thread</span>
            <span className="text-indigo-400">r</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="text-sm text-neutral-400">Join the Conversation</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="xyz@mail.com"
                value={form.email}
                onChange={handleChange}
                disabled={isPending}
                required // Added required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* Optional: Add Forgot Password link here later */}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                disabled={isPending}
                required // Added required
              />
            </div>

            {/* ERROR HANDLING FIX: */}
            {isError && (
              <p className="text-sm text-red-400 mt-2">
                {(error as any)?.response?.data?.message ||
                  "Something went wrong! Please try again"}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              {isPending ? "Signing in..." : "Sign in →"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-neutral-400">
            New to Threadr?
            <Link
              href="/signup"
              className="ml-1 font-semibold text-white hover:text-indigo-400"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}