"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "user_auth";

export default function PatientPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const auth = localStorage.getItem(AUTH_STORAGE_KEY);
      const isAuthed = auth
        ? JSON.parse(auth)?.isAuthenticated === true
        : false;
      if (!isAuthed) {
        router.replace("/login");
      } else {
        setIsReady(true);
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!isReady) {
    return null;
  }

  return (
    <div>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Welcome to your dashboard
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          You are signed in. From here you can manage your treatments and
          account.
        </p>
      </main>
    </div>
  );
}
