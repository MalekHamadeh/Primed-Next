"use client";

import Link from "next/link";
import Image from "next/image";
import FadeInOnScroll from "@/components/fade-in-on-scroll";
import CallToAction from "@/components/call-to-action";
import { useCallback, useSyncExternalStore } from "react";

function getAuthKey(): string {
  return (
    process.env.NEXT_PUBLIC_USER_AUTH_KEY ||
    process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY ||
    "user_auth"
  );
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(getAuthKey());
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.isAuthenticated === true;
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  const handler = () => callback();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }
  return () => {};
}

export default function OurStoryClient() {
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false
  );
  const authRedirectUrl = "/patient/treatment-plans";
  const primaryCtaHref = isAuthenticated ? authRedirectUrl : "/our-treatments";

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section>
        <div className="flex items-center bg-secondary">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="max-w-[520px] flex flex-col justify-center mb-8">
                  <h2 className="text-[46px] leading-none text-black mb-5">
                    Healthcare For <br />
                    <span className="text-primary"> A Better You</span>
                  </h2>
                  <p className="text-[15px] text-black/85">
                    A hectic life? All work, no balance, no guidance? Discover
                    the freedom that comes when you finally invest in yourself
                    and optimisation.
                    <br />
                    We believe access to healthcare should be smooth, simple,
                    and straightforward, so you can reach your goals faster.
                  </p>

                  <Link
                    href={primaryCtaHref}
                    onClick={scrollToTop}
                  >
                    <button className="mt-6 bg-primary-dark text-white rounded-[4px] px-4 py-2 w-full max-w-[180px] hover:opacity-80">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div
                  className="h-[450px] w-full max-w-[650px] rounded-[7px]"
                  style={{
                    backgroundImage:
                      "url(/images/healthcare_for_a_better_you.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="py-[115px]">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-primary font-medium mb-2">
                Your Goals, Your Journey, Our Commitment
              </p>
              <h3 className="max-w-[650px] mx-auto text-[24px]">
                Through recommended medical programs, you’ll access
                practitioner-prescribed treatments that are individually
                compounded upon order, for your care.
              </h3>
              <Link
                href={primaryCtaHref}
                onClick={scrollToTop}
              >
                <button className="mt-8 bg-transparent border border-gray-400 rounded-[4px] px-[18px] py-[9px] max-w-[190px] w-full hover:opacity-70">
                  Find your treatment
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Delivery Story */}
        <div className="bg-secondary py-[125px]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <div>
                <div
                  className="h-[450px] w-full max-w-[600px] rounded-[7px] mx-auto"
                  style={{
                    backgroundImage: "url(/images/delivery-process.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
              </div>
              <div>
                <div>
                  <p className="text-primary font-medium mb-1" />
                  <h2 className="text-[36px] max-w-[500px] mb-6">
                    Our Delivery Process, Explained, Simple.
                  </h2>
                  <p className="text-[15px] text-black/85 max-w-[520px]">
                    We’re not about guesswork. When you order with Primed,
                    you’ll always know what’s happening, when it’s happening,
                    and why. Because your journey deserves transparency, so
                    we’ll keep you informed, with updates and live tracking,
                    every step of the way.
                  </p>
                  <Link
                    href={primaryCtaHref}
                    onClick={scrollToTop}
                  >
                    <button className="mt-6 bg-primary-dark text-white rounded-[4px] px-4 py-2 w-full max-w-[170px] hover:opacity-80">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Steps */}
        <div className="py-[70px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-[32px]">Your Treatment in 5 Simple Steps</h2>
            </div>
            <div className="pt-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div
                    className="h-[520px] w-full max-w-[470px] rounded-[4px] mx-auto"
                    style={{
                      backgroundImage:
                        "url(/images/Default_Doctor_uncopped_dark_teal_color_mood_0.jpg)",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
                <div className="mt-2 lg:mt-[45px]">
                  <div className="relative">
                    <div className="absolute right-1/2 mr-[13px] -mt-[10px] flex justify-center items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/workProcess.PNG"
                        alt="process"
                      />
                    </div>

                    {[
                      "Register",
                      "Consultation and Clinical Review",
                      "Pay for your medication",
                      "Prescriptions sent to pharmacy",
                      "Compounded and dispatched",
                    ].map((title, idx) => (
                      <div
                        className="flex items-baseline relative z-100 mb-[30px]"
                        key={idx}
                      >
                        <div className="ml-[20px]">
                          <h4 className="text-[22px] text-primary-darker mb-1">
                            {title}
                          </h4>
                          <p className="text-[16px] text-muted-foreground max-w-[510px]">
                            {idx === 0 &&
                              "Register and account, complete the online health evaluation form and book a free consultation."}
                            {idx === 1 &&
                              "Once you’ve had your appointment, a treatment plan will be reviewed and suggested."}
                            {idx === 2 &&
                              "You will receive a notification with a payment link to pay for your medication."}
                            {idx === 3 &&
                              "Once payment is confirmed, prescriptions will be drafted by your doctor and sent to pharmacy within 24 hours."}
                            {idx === 4 &&
                              "Once the pharmacy has received a copy of your prescription, your medication will be compounded in preparation for dispatch. This process varies and can take anywhere from 5-14 days, depending on the treatments to be compounded. We will keep you informed every step of the way."}
                          </p>
                        </div>
                      </div>
                    ))}

                    <Link
                      href={primaryCtaHref}
                      onClick={scrollToTop}
                    >
                      <button className="mt-4 bg-primary-dark text-white rounded-[4px] px-4 py-2 w-full max-w-[170px] hover:opacity-80">
                        Get Started
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-[95px]">
          <div className="container mx-auto px-4">
            <h2 className="text-[35px] font-bold text-center mb-[45px]">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                {
                  src: "/images/yourhealthfirstillustration.svg",
                  title: "Your Wellness, Our Priority",
                },
                {
                  src: "/images/honestcareillustration.svg",
                  title: "Streamlined Process",
                },
                {
                  src: "/images/personalizedcareillustration.svg",
                  title: "Free Ongoing Premium Support",
                },
              ].map((f, i) => (
                <div
                  className="bg-white rounded-[8px] p-6 shadow-[0_3px_15px_rgba(0,0,0,0.04)]"
                  key={i}
                >
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.src}
                      alt={f.title}
                      className="w-[70px] h-[70px] mx-auto mb-3"
                    />
                    <h5 className="text-[20px]">{f.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call To Action */}
        <div className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <CallToAction />
          </div>
        </div>
      </section>
    </div>
  );
}
