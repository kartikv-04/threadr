"use client";

import { useState } from "react";
import Link from "next/link"; // Use Link for navigation
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "../auth.hook";
import { useRouter } from "next/navigation";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const { mutate, isPending, isError, error } = useSignup();
  const router = useRouter();
  
  // Local state for validation errors (like password mismatch)
  const [validationError, setValidationError] = useState<string | null>(null);

  const [form, setForm] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (validationError) setValidationError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // 1. Client-side validation
    if (form.password !== form.confirmPassword) {
        setValidationError("Passwords do not match.");
        return;
    }

    // 2. Prepare data (exclude confirmPassword if backend doesn't want it)
    const { confirmPassword, ...submitData } = form;

    // 3. Call signup hook
    console.log("Signup data:", submitData);
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
      {/* Subtle background glow */}
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

          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-neutral-400">
            Join the Conversation
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                disabled={isPending}
                required
              />
            </div>

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
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Label className="text-sm text-neutral-400 leading-snug">
                I agree to the{" "}
                <span className="text-indigo-400 hover:underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-indigo-400 hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </Label>
            </div>

            {/* Error Handling Block */}
            {validationError && (
                 <p className="text-sm text-red-400 mt-2">{validationError}</p>
            )}

            {isError && (
              <p className="text-sm text-red-400 mt-2">
                {(error as any)?.response?.data?.message || "Something went wrong! Please try again"}
              </p>
            )}

            <Button
              type="submit"
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Create Account →"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-neutral-400">
            Already have an account?
            <Link 
                href="/login" 
                className="ml-1 font-semibold text-white hover:text-indigo-400"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}