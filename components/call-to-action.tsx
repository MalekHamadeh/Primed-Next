"use client";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getThemeById, type ColorTheme } from "@/components/color-theme-picker";

export default function CallToAction() {
  const AUTH_STORAGE_KEY = "user_auth";

  function useColorTheme(): ColorTheme {
    const [theme, setTheme] = useState<ColorTheme>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("hero-color-theme") || "primed";
        return getThemeById(saved);
      }
      return getThemeById("primed");
    });
    useEffect(() => {
      const loadTheme = () => {
        const saved = localStorage.getItem("hero-color-theme") || "primed";
        setTheme(getThemeById(saved));
      };
      loadTheme();
      window.addEventListener("storage", loadTheme);
      window.addEventListener("theme-changed", loadTheme);
      return () => {
        window.removeEventListener("storage", loadTheme);
        window.removeEventListener("theme-changed", loadTheme);
      };
    }, []);
    return theme;
  }

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

  const theme = useColorTheme();

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
          <button
            className="rounded-md px-5 py-2.5 border font-medium tracking-wide transition-all duration-200"
            style={{
              borderColor: theme.accent,
              color: theme.accent,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.accent;
              e.currentTarget.style.color = theme.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = theme.accent;
            }}
          >
            {isAuthenticated ? "Check Your Treatment" : "Get Started"}
          </button>
        </Link>
        <Link
          href="/contact"
          scroll
        >
          <button
            className="rounded-md px-5 py-2.5 font-medium tracking-wide transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: theme.accent,
              color: theme.background,
            }}
          >
            Contact Us
          </button>
        </Link>
      </div>
    </div>
  );
}
