"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import TreatmentsSwiper from "@/components/treatments-swiper";
import HowItWorksCard from "@/components/how-it-works-card";
import Faq from "@/components/faq-section";
import CallToAction from "@/components/call-to-action";
import DescriptionCard from "@/components/description-card";
import BenefitsCard from "@/components/benefits-card";
import ValuePropBar from "@/components/value-prop-bar";
import Image from "next/image";
import FadeInOnScroll from "@/components/fade-in-on-scroll";

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <ValuePropBar />
      <div id="home_page">
        {/* Hero Section */}
        <FadeInOnScroll>
          <section className="bg-secondary w-full pb-12 md:pb-24">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="max-w-[520px]">
                  <p className="text-foreground/80">
                    <i>
                      <u>Better You</u>
                    </i>{" "}
                    Healthcare
                  </p>
                  <h1 className="text-[53px] leading-none font-black mt-2">
                    <span className="text-foreground">
                      Your Body. Your Goals. Your PRIME.
                    </span>
                  </h1>
                  <p className="text-foreground mt-3">
                    Access Personalised Treatments and Medical Programmes To
                    Help Optimise The Way You Look, Feel, Perform and Live.
                  </p>
                  <Link
                    href={isAuthenticated ? authRedirectUrl : "/our-treatments"}
                    onClick={scrollToTop}
                  >
                    <button className="mt-4 bg-primary-dark text-white rounded-[4px] px-3 py-2 w-full max-w-[170px] hover:opacity-80">
                      Get Started
                    </button>
                  </Link>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <Image
                    src="/images/hero_image_cream.png"
                    alt="PRIMED"
                    width={600}
                    height={600}
                    priority
                    className="w-full h-auto max-w-[600px]"
                  />
                </div>
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        {/* Description Section */}
        <FadeInOnScroll>
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto text-center">
                <h2 className="text-[37px] text-foreground font-bold mb-6">
                  Start Your Journey Now
                </h2>
                <DescriptionCard />
              </div>
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
