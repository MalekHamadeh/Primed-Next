"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { type ColorTheme, getThemeById } from "@/components/color-theme-picker";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { cn } from "@/lib/utils";

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
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export default function HeroSection({
  variant = "flip",
}: {
  variant?: "flip" | "classic";
}) {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    () => false
  );

  const authRedirectUrl = "/patient/treatment-plans";

  const [heroTheme] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hero-color-theme") || "primed";
      return getThemeById(saved);
    }
    return getThemeById("primed");
  });
  const heroImages = [
    "/images/hero/ELDER 2.jpg",
    "/images/hero/ELDER.jpg",
    "/images/hero/gym 3.jpg",
    "/images/hero/gym 2.jpg",
    "/images/hero/gym.jpg",
  ];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const pauseRef = useRef(false);
  const pauseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const intervalId = window.setInterval(() => {
      if (pauseRef.current) return;
      setCurrentBgIndex((idx) => (idx + 1) % heroImages.length);
    }, 6000);
    return () => window.clearInterval(intervalId);
  }, [heroImages.length]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDotClick = (index: number) => {
    setCurrentBgIndex(index);
    pauseRef.current = true;
    if (pauseTimeoutRef.current) {
      window.clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = window.setTimeout(() => {
      pauseRef.current = false;
    }, 8000);
  };

  const flipWords = ["Body.", "Goals.", "PRIME."];

  return (
    <section
      className={cn(
        "bg-primed-black w-full py-44 relative overflow-hidden",
        variant === "classic" && "py-34"
      )}
      style={{
        backgroundColor: heroTheme.background,
        fontFamily: "var(--font-proxima)",
      }}
    >
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentBgIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="Hero background"
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="w-full text-left px-4 relative z-10">
        <div className="w-full container mx-auto">
          <div className="max-w-2xl text-left">
            <p
              className="text-primed-bright-teal text-sm md:text-base font-semibold tracking-wide uppercase mb-6"
              style={{ color: heroTheme.accent }}
            >
              Better You
            </p>

            {variant === "flip" ? (
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-6"
                style={{ color: heroTheme.text }}
              >
                Your{" "}
                <FlipWords
                  words={flipWords}
                  duration={3000}
                  letterDelay={0.05}
                  wordDelay={0.25}
                  className="text-primed-bright-teal font-light"
                />
              </h1>
            ) : (
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-6"
                style={{ color: heroTheme.text }}
              >
                Your Body. Your Goals.{" "}
                <span
                  className="text-primed-bright-teal"
                  style={{ color: heroTheme.accent }}
                >
                  Your PRIME.
                </span>
              </h1>
            )}

            <p
              className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed"
              style={{
                color: heroTheme.isDark
                  ? "rgba(255, 255, 255, 0.8)"
                  : "rgba(15, 23, 42, 0.7)",
              }}
            >
              Access Personalised Treatments and Medical Programmes To Help
              Optimise The Way You Look, Feel, Perform and Live.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-start items-start mb-16">
              <Link
                href={isAuthenticated ? authRedirectUrl : "/our-treatments"}
                onClick={scrollToTop}
              >
                <button
                  className="bg-primed-bright-teal text-primed-midnight-teal rounded-xl px-8 py-4 font-bold text-lg hover:opacity-90 transition-opacity w-full sm:w-auto min-w-[200px]"
                  style={{
                    backgroundColor: heroTheme.accent,
                    color: heroTheme.isDark ? heroTheme.background : "#FFFFFF",
                  }}
                >
                  Get Started
                </button>
              </Link>
              <Link
                href="/how-it-works"
                onClick={scrollToTop}
              >
                <button
                  className="bg-transparent border-2 border-white/20 text-white rounded-lg px-8 py-4 font-semibold text-lg hover:border-primed-bright-teal hover:text-primed-bright-teal transition-colors w-full sm:w-auto min-w-[200px]"
                  style={{
                    borderColor: heroTheme.isDark
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(15, 23, 42, 0.2)",
                    color: heroTheme.text,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = heroTheme.accent;
                    e.currentTarget.style.color = heroTheme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = heroTheme.isDark
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(15, 23, 42, 0.2)";
                    e.currentTarget.style.color = heroTheme.text;
                  }}
                >
                  How It Works
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show hero image ${index + 1}`}
            onClick={() => handleDotClick(index)}
            className="w-3.5 h-3.5 rounded-full border transition-colors"
            style={{
              backgroundColor:
                index === currentBgIndex ? heroTheme.accent : "transparent",
              borderColor: heroTheme.isDark
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(15, 23, 42, 0.5)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
