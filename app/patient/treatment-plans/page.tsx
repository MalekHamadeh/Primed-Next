"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "user_auth";

export default function TreatmentPlansPage() {
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

  if (!isReady) return null;

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Your Treatment Plans
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          View and manage your active and recommended treatment plans.
        </p>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground">No active plans yet.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
