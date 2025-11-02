"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";

export default function CallToAction() {
  const AUTH_STORAGE_KEY = "user_auth";

  function getAuthSnapshot() {
    if (typeof window === "undefined") return false;
    try {
      const authState = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authState) return false;
      const parsed = JSON.parse(authState);
      return parsed?.isAuthenticated === true;
    } catch {
      return false;
    }
  }

  function subscribeToAuth(callback: () => void) {
    const handler = () => callback();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }
    return () => {};
  }

  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    () => false
  );

  const primaryHref = isAuthenticated
    ? "/patient/treatment-plans"
    : "/our-treatments";

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl md:text-[35px] font-bold mb-2">
        Ready to Take the Next Step?
      </h2>
      <p className="text-base md:text-lg text-primary-darker/90 mb-8 max-w-[560px] mx-auto">
        Take the test, book your free consultation, and we’ll take care of the
        rest.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href={primaryHref}
          scroll
        >
          <button className="rounded-[4px] px-6 py-2 border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-colors">
            {isAuthenticated ? "Check Your Treatment" : "Get Started"}
          </button>
        </Link>
        <Link
          href="/contact"
          scroll
        >
          <button className="rounded-[4px] px-6 py-2 bg-primary-dark text-white hover:opacity-80">
            Contact Us
          </button>
        </Link>
      </div>
    </div>
  );
}
