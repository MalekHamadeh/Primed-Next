"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    try {
      localStorage.setItem(
        "user_auth",
        JSON.stringify({
          isAuthenticated: true,
          loggedInAt: new Date().toISOString(),
        })
      );
      router.push("/patient/treatment-plans");
    } catch {
      // no-op
    }
  };

  return (
    <div>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Login
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Sign in to continue your personalised treatment journey.
        </p>
        <div className="max-w-md bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Email
            </label>
            <input
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground"
              placeholder="Your password"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
