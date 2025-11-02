"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

type StoredAuth = {
  isAuthenticated: boolean;
  userName?: string;
  panelLink?: string;
};

type Treatment = { id: string; name: string };

const AUTH_STORAGE_KEY = "user_auth";
const DEFAULT_AUTH: StoredAuth = Object.freeze({ isAuthenticated: false });

function useAuthState() {
  function getSnapshot() {
    if (typeof window === "undefined") return DEFAULT_AUTH;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return DEFAULT_AUTH;
      const parsed = JSON.parse(raw) as StoredAuth;
      return parsed ?? DEFAULT_AUTH;
    } catch {
      return DEFAULT_AUTH;
    }
  }
  function getServerSnapshot() {
    return DEFAULT_AUTH;
  }
  function subscribe(callback: () => void) {
    const handler = () => callback();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }
    return () => {};
  }
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function Footer() {
  const auth = useAuthState();
  const isAuthenticated = auth.isAuthenticated === true;
  const panelLink = auth.panelLink || "/patient/treatment-plans";

  const treatments = useMemo<Treatment[]>(
    () => [
      { id: "1", name: "Weight Management" },
      { id: "2", name: "Hair Loss" },
      { id: "3", name: "Skin Health" },
      { id: "4", name: "Hormone Optimization" },
      { id: "5", name: "Performance" },
      { id: "6", name: "Sleep Support" },
      { id: "7", name: "Energy & Vitality" },
      { id: "8", name: "Stress & Mood" },
    ],
    []
  );

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PRIMED</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@primedclinic.com.au"
                  className="text-white/90 hover:opacity-80"
                >
                  support@primedclinic.com.au
                </a>
              </li>
              <li>
                <a
                  href="tel:+615570890234"
                  className="text-white/90 hover:opacity-80"
                >
                  +61 5570 8902 34
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Goals</h4>
            <ul className="space-y-2 text-sm">
              {treatments.map((t) => (
                <li key={t.id}>
                  <Link
                    href={
                      isAuthenticated
                        ? panelLink
                        : `/questionnaire/${slugify(t.name)}/${t.id}/start-quiz`
                    }
                    className="text-white/90 hover:opacity-80"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/90 hover:opacity-80"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-white/90 hover:opacity-80"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/our-doctors"
                  className="text-white/90 hover:opacity-80"
                >
                  Doctors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-white/90 hover:opacity-80"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-white/90 hover:opacity-80"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-white/90 hover:opacity-80"
                >
                  Terms And Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/90 hover:opacity-80"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-white/90 hover:opacity-80"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#25a9a8] text-center py-4 text-[13px] w-full">
        <p className="text-white/95 m-0">
          &copy; {new Date().getFullYear()} Primed Clinic. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
