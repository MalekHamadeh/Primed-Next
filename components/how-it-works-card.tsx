import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type HowItWorksCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageSrc?: string;
};

export default function HowItWorksCard({
  imageSrc = "/images/how_it_works.jpg",
  ...props
}: HowItWorksCardProps) {
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
        "We're available to address any questions, with continued guidance to help you reach those goals, committed to helping you look and feel better.",
    },
  ];

  return (
    <div
      className="w-full"
      {...props}
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        {/* Left Column - Image */}
        <div className="relative w-full min-h-[400px] lg:min-h-[600px]">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt="Healthcare professional ready to help"
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
              SIMPLE PROCESS
            </div>
            <div className="space-y-1 leading-[1.1]">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your journey to better health in four simple steps
              </p>
            </div>
          </div>

          {/* Steps Section */}
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex gap-5 group"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[#14B8A6] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {idx + 1}
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-lg leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="space-y-8 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#14B8A6] opacity-90 hover:bg-[#14B8A6] hover:opacity-100 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
