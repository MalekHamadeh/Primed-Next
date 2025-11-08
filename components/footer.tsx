"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore, useEffect, useState } from "react";
import Image from "next/image";
import { getThemeById, type ColorTheme } from "@/components/color-theme-picker";

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

export default function Footer() {
  const auth = useAuthState();
  const isAuthenticated = auth.isAuthenticated === true;
  const panelLink = auth.panelLink || "/patient/treatment-plans";

  const colorTheme = useColorTheme();

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
    <footer
      className="border-t"
      style={{
        backgroundColor: colorTheme.background,
        borderTopColor: `${colorTheme.accent}33`,
        color: colorTheme.text,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start justify-start gap-4">
            <Image
              src="/images/Artboard 2.svg"
              alt="Primed Clinic"
              width={180}
              height={26}
              className="w-24 pb-4"
              priority
            />
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@primedclinic.com.au"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  support@primedclinic.com.au
                </a>
              </li>
              <li>
                <a
                  href="tel:+615570890234"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  +61 5570 8902 34
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: colorTheme.text }}
            >
              Goals
            </h4>
            <ul className="space-y-2 text-sm">
              {treatments.map((t) => (
                <li key={t.id}>
                  <Link
                    href={
                      isAuthenticated
                        ? panelLink
                        : `/questionnaire/${slugify(t.name)}/${t.id}/start-quiz`
                    }
                    className="transition-colors"
                    style={{ color: colorTheme.text }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = colorTheme.accent)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = colorTheme.text)
                    }
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: colorTheme.text }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="transition-colors"
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
              </li>
              <li>
                <Link
                  href="/our-doctors"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  Doctors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: colorTheme.text }}
            >
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  Terms And Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="transition-colors"
                  style={{ color: colorTheme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colorTheme.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colorTheme.text)
                  }
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="text-center py-3 text-[13px] w-full"
        style={{
          backgroundColor: colorTheme.brandBarBg ?? colorTheme.background,
          color: colorTheme.brandBarText ?? colorTheme.accent,
        }}
      >
        <p className="m-0">
          &copy; {new Date().getFullYear()} Primed Clinic. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
