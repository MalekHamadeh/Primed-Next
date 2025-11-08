import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type DescriptionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  leftImageSrc?: string;
};

export default function DescriptionCard({
  leftImageSrc = "/images/start_your_journey.jpg",
  ...props
}: DescriptionCardProps) {
  return (
    <div
      className="w-full"
      {...props}
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column - Image */}
        <Image
          src={leftImageSrc || "/placeholder.svg"}
          alt="Woman eating healthy food after workout"
          width={600}
          height={800}
          className="w-full h-auto rounded-2xl"
          priority
        />

        {/* Right Column - Content */}
        <div className="space-y-10">
          {/* Header Section */}
          <div className="space-y-3 leading-[1.1]">
            <div className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              FREE Consultation
            </div>
            <div className="space-y-1 leading-[1.1]">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
                Start Your Journey <span className="text-teal-600">Now</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Book a FREE initial consultation with one of our dedicated
                practitioners.
              </p>
            </div>
          </div>

          {/* Steps Section */}
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Complete Your Profile",
                description:
                  "Fill out the online medical form, tell us about your goals, and we connect you with our qualified clinicians to provide suitable personalised therapies.",
              },
              {
                step: "2",
                title: "Free Consultation",
                description:
                  "Free consultation. No upfront fees. Only pay for your program.",
              },
              {
                step: "3",
                title: "Ongoing Support",
                description:
                  "100% commitment free, handling all admin, and guiding you with premium support every step of the way.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-5 group"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#14B8A6] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-lg leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="space-y-8 pt-2">
            <Link
              href="/our-treatments"
              scroll
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#14B8A6] opacity-90 hover:bg-[#14B8A6] hover:opacity-100 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started
                <Check className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
