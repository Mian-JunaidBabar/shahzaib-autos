"use client";

import { useTheme } from "@/context/theme-context";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded shadow-md border border-border w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-input rounded w-full py-2 px-3 bg-background text-foreground"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-input rounded w-full py-2 px-3 bg-background text-foreground"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-2 rounded-md bg-muted text-foreground hover:bg-accent"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
