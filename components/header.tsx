"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { httpGet } from "@/lib/api";
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

function getAuthKey(): string {
  return (
    process.env.NEXT_PUBLIC_USER_AUTH_KEY ||
    process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY ||
    "user_auth"
  );
}
const DEFAULT_AUTH: StoredAuth = Object.freeze({ isAuthenticated: false });

function useAuthState() {
  function getSnapshot() {
    if (typeof window === "undefined") return DEFAULT_AUTH;
    try {
      const raw = localStorage.getItem(getAuthKey());
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

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Base client appends /api; use /v1 per project API prefix
        const res = await httpGet<TreatmentsResponse>("/treatments");
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
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/images/primedclinic-logo.png"
              alt="Primed Clinic"
              width={180}
              height={26}
              className="h-[26px] w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <div
              className="relative"
              ref={menuRef}
            >
              <button
                className="flex items-center gap-1 text-primary hover:opacity-80 transition"
                onClick={() => setIsTreatmentsOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isTreatmentsOpen}
              >
                GOALS
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/arrowNavDown.png"
                  alt="Open"
                  className={`w-[14px] h-[15px] ml-[7px] mb-px transition-transform ${
                    isTreatmentsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isTreatmentsOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-3 w-screen max-w-6xl bg-card border border-border rounded-md shadow-lg p-4"
                  onMouseLeave={() => setIsTreatmentsOpen(false)}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {treatments.map((t) => (
                      <Link
                        key={t.id}
                        href={`/questionnaire/${slugify(t.name)}/${
                          t.id
                        }/start-quiz`}
                        className="no-underline"
                        onClick={() => setIsTreatmentsOpen(false)}
                      >
                        <div className="flex flex-col items-center text-center bg-white rounded-md p-2 hover:bg-muted/60 transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={t.image || "/images/weight_loss.jpg"}
                            alt={t.name}
                            className="w-full h-[210px] object-cover rounded-xl mb-2"
                          />
                          <span className="text-primary text-[14px] leading-tight font-light">
                            <strong className="font-medium">{t.name}</strong>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/our-story"
              className="text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>

            {!isAuthenticated ? (
              <>
                <Link href="/our-treatments">
                  <button className="rounded-[4px] px-6 py-2 border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-colors">
                    Get Started
                  </button>
                </Link>
                <Link href="/login">
                  <button className="rounded-[4px] px-6 py-2 bg-primary text-primary-foreground hover:opacity-90">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <div
                className="relative"
                ref={profileRef}
              >
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold"
                >
                  {userInitial}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2">
                    <div className="flex items-center gap-2 px-4 py-2 text-primary-darker">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{auth.userName}</span>
                    </div>
                    <hr className="my-2 border-border" />
                    <Link
                      href={panelLink}
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      My Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col gap-2">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none text-primary">
                <span>Our Treatments</span>
                <img
                  src="/images/arrowNavDown.png"
                  alt="Open"
                  className="w-[14px] h-[15px] ml-[7px] mb-px transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {treatments.map((t) => (
                  <Link
                    key={t.id}
                    href={`/questionnaire/${slugify(t.name)}/${
                      t.id
                    }/start-quiz`}
                    className="block px-3 py-2 border border-border rounded-md text-primary hover:bg-muted/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </details>

            <Link
              href="/how-it-works"
              className="text-foreground hover:text-primary transition-colors px-1 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors px-1 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors px-1 py-2"
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
                  <button className="rounded-[4px] px-4 py-2 border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-colors">
                    Get Started
                  </button>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button className="rounded-[4px] px-4 py-2 bg-primary text-primary-foreground hover:opacity-90">
                    Login
                  </button>
                </Link>
              </div>
            ) : (
              <Link
                href={panelLink}
                onClick={() => setIsMenuOpen(false)}
              >
                <button className="rounded-[4px] px-4 py-2 bg-primary text-primary-foreground hover:opacity-90">
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
