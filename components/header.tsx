"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { httpGet } from "@/lib/api";
import { getThemeById, type ColorTheme } from "@/components/color-theme-picker";
import type { TreatmentsResponse, TreatmentApi } from "@/types/treatments";

type Treatment = {
  id: string;
  name: string;
  image?: string;
};

type StoredAuth = {
  isAuthenticated: boolean;
  userName?: string;
  panelLink?: string;
};

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
  const auth = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return auth;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function useColorTheme() {
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTreatmentsOpen, setIsTreatmentsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const auth = useAuthState();
  const isAuthenticated = auth.isAuthenticated === true;
  const userInitial = (auth.userName || "").trim().charAt(0).toUpperCase();
  const panelLink = auth.panelLink || "/patient/treatment-plans";

  const [treatments, setTreatments] = useState<Treatment[]>([]);

  const colorTheme = useColorTheme();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await httpGet<TreatmentsResponse>("/treatments");
        console.log("treatments", res);
        const list = Array.isArray(res?.data) ? res.data : [];
        const mapped: Treatment[] = list
          .slice(0, 10)
          .map((t: TreatmentApi) => ({
            id: String(t.id),
            name: t.name,
            image: t.image
              ? `/images/${t.image}`
              : "/images/hero_image_cream.jpg",
          }));
        if (!cancelled) setTreatments(mapped);
      } catch {
        if (!cancelled) setTreatments([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header
      className="border-b sticky top-0 z-50 py-10"
      style={{
        backgroundColor: colorTheme.background,
        borderBottomColor: `${colorTheme.accent}33`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/images/Artboard 2.svg"
              alt="Primed Clinic"
              width={180}
              height={26}
              className="w-40"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              ref={menuRef}
            >
              <button
                className="flex items-center gap-1.5 font-medium tracking-wide transition-all duration-200 hover:opacity-80 cursor-pointer"
                style={{ color: colorTheme.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colorTheme.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colorTheme.text;
                }}
                onClick={() => setIsTreatmentsOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isTreatmentsOpen}
              >
                GOALS
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-300 ${
                    isTreatmentsOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isTreatmentsOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-4 w-screen max-w-5xl rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: colorTheme.background,
                    border: `1px solid ${colorTheme.accent}33`,
                  }}
                  onMouseLeave={() => setIsTreatmentsOpen(false)}
                >
                  <div
                    className="px-6 py-4 border-b"
                    style={{
                      borderBottomColor: `${colorTheme.accent}22`,
                    }}
                  >
                    <h3
                      className="text-sm font-semibold tracking-wider uppercase"
                      style={{ color: colorTheme.accent }}
                    >
                      Choose Your Goal
                    </h3>
                    <p
                      className="text-xs mt-1 opacity-70"
                      style={{ color: colorTheme.text }}
                    >
                      Select a treatment path tailored to your needs
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-4 p-6 items-stretch">
                    {treatments.map((t) => (
                      <Link
                        key={t.id}
                        href={`/questionnaire/${slugify(t.name)}/${
                          t.id
                        }/start-quiz`}
                        className="no-underline group block h-full"
                        onClick={() => setIsTreatmentsOpen(false)}
                      >
                        <div
                          className="flex flex-col h-full rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: `${colorTheme.accent}08`,
                            border: `1px solid ${colorTheme.accent}15`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${colorTheme.accent}15`;
                            e.currentTarget.style.borderColor = `${colorTheme.accent}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = `${colorTheme.accent}08`;
                            e.currentTarget.style.borderColor = `${colorTheme.accent}15`;
                          }}
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={t.image || "/images/weight_loss.jpg"}
                              alt={t.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              width={210}
                              height={210}
                            />
                          </div>
                          <div className="p-3 min-h-12 flex items-center justify-center">
                            <span
                              className="text-sm font-medium leading-tight block text-center"
                              style={{ color: colorTheme.text }}
                            >
                              {t.name}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/our-story"
              className="font-medium tracking-wide transition-all duration-200 hover:opacity-80"
              style={{ color: colorTheme.text }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = colorTheme.accent)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = colorTheme.text)
              }
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="font-medium tracking-wide transition-all duration-200 hover:opacity-80"
              style={{ color: colorTheme.text }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = colorTheme.accent)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = colorTheme.text)
              }
            >
              Contact
            </Link>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3 ml-10">
                <Link href="/our-treatments">
                  <button
                    className="rounded-md px-5 py-2.5 border font-medium tracking-wide transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: colorTheme.accent,
                      color: colorTheme.accent,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colorTheme.accent;
                      e.currentTarget.style.color = colorTheme.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colorTheme.accent;
                    }}
                  >
                    Get Started
                  </button>
                </Link>
                <Link href="/login">
                  <button
                    className="rounded-md px-5 py-2.5 font-medium tracking-wide transition-all duration-200 hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: colorTheme.accent,
                      color: colorTheme.background,
                    }}
                  >
                    Login
                  </button>
                </Link>
              </div>
            ) : (
              <div
                className="relative ml-2"
                ref={profileRef}
              >
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: colorTheme.accent,
                    color: colorTheme.background,
                  }}
                >
                  {userInitial}
                </button>
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden"
                    style={{
                      backgroundColor: colorTheme.background,
                      border: `1px solid ${colorTheme.accent}33`,
                    }}
                  >
                    <div
                      className="flex items-center gap-3 px-4 py-3 border-b"
                      style={{
                        color: colorTheme.text,
                        borderBottomColor: `${colorTheme.accent}22`,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                        style={{ color: colorTheme.accent }}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {auth.userName}
                      </span>
                    </div>
                    <Link
                      href={panelLink}
                      className="block px-4 py-3 transition-all duration-200"
                      style={{ color: colorTheme.text }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colorTheme.accent}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      My Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200"
            style={{
              color: colorTheme.text,
              backgroundColor: isMenuOpen
                ? `${colorTheme.accent}15`
                : "transparent",
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col gap-2">
            <details className="group">
              <summary
                className="flex items-center justify-between cursor-pointer list-none font-medium px-1 py-2"
                style={{ color: colorTheme.text }}
              >
                <span>Our Treatments</span>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-300 group-open:rotate-180"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {treatments.map((t) => (
                  <Link
                    key={t.id}
                    href={`/questionnaire/${slugify(t.name)}/${
                      t.id
                    }/start-quiz`}
                    className="block px-3 py-2 border rounded-md hover:bg-opacity-10"
                    style={{
                      borderColor: `${colorTheme.accent}66`,
                      color: colorTheme.text,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </details>

            <Link
              href="/our-story"
              className="transition-colors px-1 py-2 font-medium"
              style={{ color: colorTheme.text }}
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="transition-colors px-1 py-2 font-medium"
              style={{ color: colorTheme.text }}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors px-1 py-2 font-medium"
              style={{ color: colorTheme.text }}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {!isAuthenticated ? (
              <div className="mt-2 flex gap-2">
                <Link
                  href="/our-treatments"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button
                    className="rounded-md px-4 py-2 border transition-colors font-medium"
                    style={{
                      borderColor: colorTheme.accent,
                      color: colorTheme.accent,
                    }}
                  >
                    Get Started
                  </button>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button
                    className="rounded-md px-4 py-2 hover:opacity-90 font-medium"
                    style={{
                      backgroundColor: colorTheme.accent,
                      color: colorTheme.background,
                    }}
                  >
                    Login
                  </button>
                </Link>
              </div>
            ) : (
              <Link
                href={panelLink}
                onClick={() => setIsMenuOpen(false)}
              >
                <button
                  className="rounded-md px-4 py-2 hover:opacity-90 font-medium"
                  style={{
                    backgroundColor: colorTheme.accent,
                    color: colorTheme.background,
                  }}
                >
                  My Account
                </button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
