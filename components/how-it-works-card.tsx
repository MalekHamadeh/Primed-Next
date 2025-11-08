 "use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getThemeById, type ColorTheme } from "@/components/color-theme-picker";

type HowItWorksCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageSrc?: string;
};

export default function HowItWorksCard({
  imageSrc = "/images/how_it_works.jpg",
  ...props
}: HowItWorksCardProps) {
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

  const steps = [
    {
      title: "Online Questionnaire",
      description:
        "Answer some questions, ensure you are eligible, and receive the right treatment to help you achieve your goals.",
    },
    {
      title: "Telehealth",
      description:
        "Spend time discussing options available with our clinician. A suitable treatment plan will be available for you to order within 24 hours.",
    },
    {
      title: "Treatment Delivered",
      description:
        "Upon order, our partner compounding pharmacy will have your prescription filled and start preparing your treatment. Express delivered to your door once ready.",
    },
    {
      title: "Ongoing Premium Support",
      description:
        "We’re available to address any questions, with continued guidance to help you reach those goals, committed to helping you look and feel better.",
    },
  ];

  return (
    <div
      className="w-full"
      {...props}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left image with gradient aura */}
        <div className="relative group flex items-start justify-center lg:justify-start">
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            style={{
              background: `linear-gradient(to bottom right, ${theme.accent}33, ${theme.accent}22)`,
            }}
          />
          <div className="relative h-[520px] w-full max-w-[470px] rounded-[12px] overflow-hidden shadow-2xl">
            <Image
              src={imageSrc}
              alt="How it works"
              width={470}
              height={520}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right process */}
        <div className="lg:pl-2">
          <div className="relative pl-6">
            {/* subtle vertical guide line */}
            <div
              className="absolute left-2 top-1 bottom-1 w-px"
              style={{ backgroundColor: `${theme.accent}4D` }}
            />

            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-white rounded-full px-2 py-1 text-[16px] leading-none font-normal"
                      style={{ backgroundColor: theme.accent }}
                    >
                      {idx + 1}
                    </span>
                    <div className="mt-[-2px]">
                      <h4
                        className="text-[22px] font-normal mb-1"
                        style={{ color: theme.text }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="max-w-[510px] text-[16px] font-normal m-0"
                        style={{
                          color: theme.isDark
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(15,23,42,0.7)",
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
