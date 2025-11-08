"use client";

import { useSyncExternalStore, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import TreatmentsSwiper from "@/components/treatments-swiper";
import HowItWorksCard from "@/components/how-it-works-card";
import Faq from "@/components/faq-section";
import CallToAction from "@/components/call-to-action";
import DescriptionCard from "@/components/description-card";
import BenefitsCard from "@/components/benefits-card";
import ValuePropBar from "@/components/value-prop-bar";
import FadeInOnScroll from "@/components/fade-in-on-scroll";
import ColorThemePicker, {
  type ColorTheme,
  colorThemes,
} from "@/components/color-theme-picker";

const AUTH_STORAGE_KEY = "user_auth";

// External auth state is stored in localStorage under AUTH_STORAGE_KEY.
// We read it via a snapshot function and subscribe to storage events so
// React can re-render when it changes (without calling setState in effects).
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

// Subscribe to cross-tab/localStorage updates. React will call the snapshot
// again when this fires to get the latest value.
function subscribeToAuth(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export default function Home() {
  // Derive auth from an external store (localStorage):
  // - subscribe: revalidate on storage changes
  // - getSnapshot: current client value
  // - getServerSnapshot: false during SSR to avoid hydration mismatches
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    () => false
  );

  const authRedirectUrl = "/patient/treatment-plans";

  const [heroTheme, setHeroTheme] = useState<ColorTheme>(colorThemes[0]);
  const heroImages = [
    "/images/hero/ELDER 2.jpg",
    "/images/hero/ELDER.jpg",
    "/images/hero/gym 3.jpg",
    "/images/hero/gym 2.jpg",
    "/images/hero/gym.jpg",
  ];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const lastInteractionRef = useRef(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const intervalId = window.setInterval(() => {
      if (Date.now() - lastInteractionRef.current < 8000) return;
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
    lastInteractionRef.current = Date.now();
    setCurrentBgIndex(index);
  };

  return (
    <div>
      <div id="home_page">
        {/* Hero Section */}
        <section
          className="bg-primed-black w-full py-30 relative overflow-hidden"
          style={{
            backgroundColor: heroTheme.background,
            fontFamily: "var(--font-proxima)",
          }}
        >
          {/* Background image carousel */}
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
            {/* Readability overlay */}
            {/* <div className="absolute inset-0 bg-black/40" /> */}
          </div>

          <div className="container text-left px-4 relative z-10 font-sans!">
            <div className="max-w-4xl text-left pl-18">
              {/* Eyebrow text */}
              <p
                className="text-primed-bright-teal text-sm md:text-base font-semibold tracking-wide uppercase mb-6"
                style={{ color: heroTheme.accent }}
              >
                Better You
              </p>

              {/* Main headline */}
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

              {/* Subheading */}
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

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-start items-start mb-16">
                <Link
                  href={isAuthenticated ? authRedirectUrl : "/our-treatments"}
                  onClick={scrollToTop}
                >
                  <button
                    className="bg-primed-bright-teal text-primed-midnight-teal rounded-xl px-8 py-4 font-bold text-lg hover:opacity-90 transition-opacity w-full sm:w-auto min-w-[200px]"
                    style={{
                      backgroundColor: heroTheme.accent,
                      color: heroTheme.isDark
                        ? heroTheme.background
                        : "#FFFFFF",
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

              {/* Stats/Social proof */}
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl pt-8 "
                // style={{
                //   borderColor: heroTheme.isDark
                //     ? "rgba(255, 255, 255, 0.1)"
                //     : "rgba(15, 23, 42, 0.1)",
                // }}
              >
                {/* <div className="text-left">
                  <div
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: heroTheme.accent }}
                  >
                    1000+
                  </div>
                  <div
                    className="text-white/60 text-sm"
                    style={{
                      color: heroTheme.isDark
                        ? "rgba(255, 255, 255, 0.6)"
                        : "rgba(15, 23, 42, 0.6)",
                    }}
                  >
                    Patients Treated
                  </div>
                </div>
                <div className="text-left">
                  <div
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: heroTheme.accent }}
                  >
                    50+
                  </div>
                  <div
                    className="text-white/60 text-sm"
                    style={{
                      color: heroTheme.isDark
                        ? "rgba(255, 255, 255, 0.6)"
                        : "rgba(15, 23, 42, 0.6)",
                    }}
                  >
                    Expert Doctors
                  </div>
                </div>
                <div className="text-left">
                  <div
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: heroTheme.accent }}
                  >
                    98%
                  </div>
                  <div
                    className="text-white/60 text-sm"
                    style={{
                      color: heroTheme.isDark
                        ? "rgba(255, 255, 255, 0.6)"
                        : "rgba(15, 23, 42, 0.6)",
                    }}
                  >
                    Satisfaction Rate
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Hero pagination dots */}
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

        {/* Description Section */}
        <FadeInOnScroll>
          <section className="py-24 bg-linear-to-br from-teal-50 via-white to-cyan-50">
            <div className="container mx-auto px-4">
              <DescriptionCard />
            </div>
          </section>
        </FadeInOnScroll>

        {/* Treatments Section */}
        <FadeInOnScroll>
          <section className="bg-secondary py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-[450px] mx-auto">
                <h2 className="text-[35px] font-bold mb-4">
                  For A Better You
                  <br />
                  Connecting you with doctors to help with
                </h2>
              </div>
              <div className="mt-4">
                <TreatmentsSwiper />
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        {/* Benefits Section */}
        <FadeInOnScroll>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-[350px] mx-auto mb-6">
                <h2 className="text-[35px] font-bold">Benefits</h2>
                <h5 className="text-[20px] font-semibold mt-2">
                  Gain Access to Leading Doctors Here Today.
                </h5>
              </div>
              <BenefitsCard />
            </div>
          </section>
        </FadeInOnScroll>

        {/* How It Works Section */}
        <FadeInOnScroll>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-[350px] mx-auto mb-6">
                <h2 className="text-[35px] font-bold">How It Works</h2>
              </div>
              <HowItWorksCard />
            </div>
          </section>
        </FadeInOnScroll>

        {/* FAQ Section */}
        <FadeInOnScroll>
          <section>
            <div className="bg-secondary w-full">
              <Faq />
            </div>
          </section>
        </FadeInOnScroll>

        {/* Call to Action Section */}
        <FadeInOnScroll>
          <section className="bg-muted py-12">
            <div className="container mx-auto px-4">
              <CallToAction />
            </div>
          </section>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
