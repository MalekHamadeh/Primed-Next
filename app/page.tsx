"use client";

import { useEffect, useState } from "react";
import TreatmentsSwiper from "@/components/treatments-swiper";
import CallToAction from "@/components/call-to-action";
import DescriptionCard from "@/components/description-card";
import FadeInOnScroll from "@/components/fade-in-on-scroll";
import HeroSection from "@/components/hero-section";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Clock } from "lucide-react";
import { getThemeById, type ColorTheme } from "@/components/color-theme-picker";

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

export default function Home() {
  useState();
  const colorTheme = useColorTheme();

  return (
    <div>
      <div id="home_page">
        <HeroSection variant="flip" />

        {/* Description Section */}
        <FadeInOnScroll>
          <section className="py-34">
            <div className="container mx-auto">
              <DescriptionCard />
            </div>
          </section>
        </FadeInOnScroll>

        {/* Treatments Section */}
        <FadeInOnScroll>
          <section className="bg-secondary py-34">
            <div className="container mx-auto px-4">
              <div className="text-center mx-auto">
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

        {/* Benefits Section (Themed two-column) */}
        <FadeInOnScroll>
          <section className="flex items-center justify-center py-12 lg:py-20">
            <div className="container w-full">
              {/* Section Header */}
              <div className="text-center mb-12 space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Benefits
                </h2>
                <p className="text-xl">
                  Gain Access to Leading Doctors Here Today.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Column - Image */}
                <div className="relative group order-2 lg:order-1">
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src="/images/doctors_image.jpg"
                      alt="Professional medical doctors"
                      width={600}
                      height={800}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Right Column - Benefits */}
                <div className="space-y-8 order-1 lg:order-2">
                  {/* Consultation Fee Highlight */}
                  <div
                    className="rounded-2xl p-6 shadow-lg border-2"
                    style={{
                      background: `${colorTheme.accent}0D`,
                      borderColor: `${colorTheme.accent}33`,
                    }}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-medium">
                        Consultation Fee =
                      </span>
                      <span className="text-5xl font-bold">$0</span>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-5">
                    {[
                      "Comprehensive medical review and personalised treatment",
                      "Access to your own online portal - appointments, online ordering, prescriptions",
                      "No waiting rooms. No hidden fees. No referral required",
                      "Only pay for your treatment",
                      "More affordable compared to other clinics and providers",
                      "Australia-wide free express delivery",
                      "FREE Premium support and ongoing transparent and compassionate care",
                    ].map((benefit, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start group hover:translate-x-1 transition-transform duration-200"
                      >
                        <div className="shrink-0 mt-0.5">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-200"
                            style={{
                              backgroundColor: colorTheme.accent,
                              color: "#FFFFFF",
                            }}
                          >
                            <Check
                              className="h-4 w-4"
                              strokeWidth={3}
                            />
                          </div>
                        </div>
                        <p className="leading-relaxed font-medium">{benefit}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-white px-8 py-6 text-lg font-semibold shadow-xl transition-all duration-300"
                      style={{
                        background: `linear-gradient(to right, ${colorTheme.accent}, ${colorTheme.accent})`,
                        color: "#FFFFFF",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(0.95)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "none";
                      }}
                    >
                      Get Started
                      <Check className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        {/* How It Works Section (New themed layout) */}
        <FadeInOnScroll>
          <section className="flex items-center justify-center py-16 lg:py-24 bg-secondary">
            <div className="container w-full">
              <div className="text-center mb-16 space-y-4">
                <div
                  className="inline-block px-4 py-1.5 rounded-md text-sm font-semibold mb-4"
                  style={{
                    backgroundColor: colorTheme.accent,
                    color: colorTheme.background,
                  }}
                >
                  SIMPLE PROCESS
                </div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                  How It Works
                </h2>
                <p className="text-xl max-w-2xl mx-auto">
                  Your journey to better health in four simple steps
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="relative">
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-xl border-2"
                    style={{ borderColor: `${colorTheme.accent}33` }}
                  >
                    <Image
                      src="/images/how_it_works.jpg"
                      alt="Healthcare professional ready to help"
                      width={600}
                      height={800}
                      className="w-full h-auto"
                    />
                  </div>
                  <div
                    className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 rounded-tl-2xl"
                    style={{ borderColor: colorTheme.accent }}
                  />
                  <div
                    className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 rounded-br-2xl"
                    style={{ borderColor: colorTheme.accent }}
                  />
                </div>

                <div className="relative space-y-8">
                  <div
                    className="absolute left-6 top-10 bottom-10 w-0.5"
                    style={{ backgroundColor: `${colorTheme.accent}4D` }}
                  />
                  {[
                    {
                      step: "1",
                      title: "Online Questionnaire",
                      description:
                        "Answer some questions, ensure you are eligible, and receive the right treatment to help you achieve your goals.",
                    },
                    {
                      step: "2",
                      title: "Telehealth",
                      description:
                        "Spend time discussing options available with our clinician. A suitable treatment plan will be available for you to order within 24 hours.",
                    },
                    {
                      step: "3",
                      title: "Treatment Delivered",
                      description:
                        "Upon order, our partner compounding pharmacy will have your prescription filled and start preparing your treatment. Express delivered to your door once ready.",
                    },
                    {
                      step: "4",
                      title: "Ongoing Premium Support",
                      description:
                        "We're available to address any questions, with continued guidance to help you reach those goals, committed to helping you look and feel better.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex gap-6 relative"
                    >
                      <div className="shrink-0 relative z-10">
                        <div
                          className="w-12 h-12 rounded-xl flex text-white items-center justify-center font-bold transition-all duration-300"
                          style={{
                            backgroundColor: colorTheme.accent,
                          }}
                        >
                          {item.step}
                        </div>
                      </div>
                      <div className="space-y-2 flex-1 pt-1 pb-2">
                        <h3 className="font-bold text-xl">{item.title}</h3>
                        <p className="leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-4 pt-4 pl-0">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto px-10 py-6 text-lg font-semibold shadow-xl transition-all duration-300"
                      style={{
                        backgroundColor: colorTheme.accent,
                        color: colorTheme.background,
                        boxShadow: `${colorTheme.accent}33 0px 10px 30px`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(0.95)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "none";
                      }}
                    >
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3 text-sm rounded-xl p-4">
                      <Clock
                        className="h-5 w-5"
                        style={{ color: colorTheme.accent }}
                      />
                      <span className="font-medium">
                        Treatment plan typically available within 24-48 hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        {/* Call to Action Section */}
        <FadeInOnScroll>
          <section className="py-12">
            <div className="container mx-auto px-4">
              <CallToAction />
            </div>
          </section>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
