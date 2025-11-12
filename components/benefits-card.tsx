import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type BenefitsCardProps = React.HTMLAttributes<HTMLDivElement> & {
  leftImageSrc?: string;
};

export default function BenefitsCard({
  leftImageSrc = "/images/doctors_image.jpg",
  ...props
}: BenefitsCardProps) {
  return (
    <div
      className="w-full"
      {...props}
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        {/* Left Column - Image */}
        <div className="relative w-full min-h-[400px] lg:min-h-[600px]">
          <Image
            src={leftImageSrc || "/placeholder.svg"}
            alt="Professional medical doctors"
            fill
            className="object-cover rounded-2xl"
            priority
          />
        </div>

        {/* Right Column - Content */}
        <div className="space-y-10">
          {/* Header Section */}
          <div className="space-y-3 leading-[1.1]">
            <div className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              $0 Consultation Fee
            </div>
            <div className="space-y-1 leading-[1.1]">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
                Benefits
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Gain Access to Leading Doctors Here Today.
              </p>
            </div>
          </div>

          {/* Benefits List Section */}
          <div className="space-y-8">
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
                className="flex gap-5 items-start group"
              >
                <div className="shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-md bg-[#14B8A6] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <Check
                      className="h-4 w-4"
                      strokeWidth={3}
                    />
                  </div>
                </div>
                <p className="leading-relaxed font-medium text-[15px]">
                  {benefit}
                </p>
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
