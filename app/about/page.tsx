"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import CallToAction from "@/components/call-to-action";

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

export default function AboutUsClient() {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    () => false
  );

  const ctaUrl = isAuthenticated
    ? "/patient/treatment-plans"
    : "/our-treatments";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Healthcare For <br />
                <span className="text-cream">A Better You</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed opacity-90">
                A hectic life? All work, no balance, no guidance? Discover the
                freedom that comes when you finally invest in yourself and
                optimisation.
                <br />
                <br />
                We believe access to healthcare should be smooth, simple, and
                straightforward, so you can reach your goals faster.
              </p>
              <Link
                href={ctaUrl}
                onClick={scrollToTop}
              >
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[500px] bg-primary-dark rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-primary font-semibold text-lg">
              Your Goals, Your Journey, Our Commitment
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-teal leading-tight">
              Through recommended medical programs, you’ll access
              practitioner-prescribed treatments that are individually
              compounded upon order, for your care.
            </h2>
            <Link
              href={ctaUrl}
              onClick={scrollToTop}
            >
              <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity mt-6">
                Find your treatment
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery Process Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] md:h-[500px] bg-primary rounded-2xl"></div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-teal">
                Our Delivery Process, Explained, Simple.
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                We’re not about guesswork. When you order with Primed, you’ll
                always know what’s happening, when it’s happening, and why.
                Because your journey deserves transparency, so we’ll keep you
                informed, with updates and live tracking, every step of the way.
              </p>
              <Link
                href={ctaUrl}
                onClick={scrollToTop}
              >
                <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Steps Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-teal text-center mb-12">
            Your Treatment in 5 Simple Steps
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative h-[400px] lg:h-[600px] bg-primary rounded-2xl"></div>
            <div className="space-y-8">
              <div className="relative">
                <Image
                  src="/images/vertical-process-line.jpg"
                  alt="Process line"
                  width={100}
                  height={600}
                  className="absolute left-0 top-0 h-full w-auto opacity-20"
                />
                <div className="space-y-8 pl-12">
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-dark-teal">
                      Register
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Register and account, complete the online health
                      evaluation form and book a free consultation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-dark-teal">
                      Consultation and Clinical Review
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Once you’ve had your appointment, a treatment plan will be
                      reviewed and suggested.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-dark-teal">
                      Pay for your medication
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      You will receive a notification with a payment link to pay
                      for your medication.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-dark-teal">
                      Prescriptions sent to pharmacy
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Once payment is confirmed, prescriptions will be drafted
                      by your doctor and sent to pharmacy within 24 hours.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-dark-teal">
                      Compounded and dispatched
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Once the pharmacy has received a copy of your
                      prescription, your medication will be compounded in
                      preparation for dispatch. This process varies and can take
                      anywhere from 5-14 days, depending on the treatments to be
                      compounded. We will keep you informed every step of the
                      way.
                    </p>
                  </div>
                  <Link
                    href={ctaUrl}
                    onClick={scrollToTop}
                  >
                    <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity mt-6">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-dark-teal text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="flex justify-center">
                <Image
                  src="/health-wellness-icon.jpg"
                  alt="Your Wellness"
                  width={70}
                  height={70}
                />
              </div>
              <h5 className="font-bold text-xl text-dark-teal">
                Your Wellness, Our Priority
              </h5>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="flex justify-center">
                <Image
                  src="/streamlined-process-icon.jpg"
                  alt="Streamlined Process"
                  width={70}
                  height={70}
                />
              </div>
              <h5 className="font-bold text-xl text-dark-teal">
                Streamlined Process
              </h5>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="flex justify-center">
                <Image
                  src="/premium-support-icon.jpg"
                  alt="Premium Support"
                  width={70}
                  height={70}
                />
              </div>
              <h5 className="font-bold text-xl text-dark-teal">
                Free Ongoing Premium Support
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <CallToAction />
        </div>
      </section>
    </div>
  );
}
