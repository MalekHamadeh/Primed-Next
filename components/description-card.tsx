import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
type DescriptionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  leftImageSrc?: string;
  processLineSrc?: string;
};

export default function DescriptionCard({
  leftImageSrc = "/images/start_your_journey.jpg",
  processLineSrc = "/images/list.svg",
  ...props
}: DescriptionCardProps) {
  return (
    <div
      className="w-full max-w-7xl mx-auto"
      {...props}
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Image with glow */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-linear-to-br from-teal-400/20 to-cyan-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={leftImageSrc}
              alt="Woman eating healthy food after workout"
              width={600}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              FREE Consultation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Start Your Journey <span className="text-teal-600">Now</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Book a FREE initial consultation with one of our dedicated
              practitioners.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
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
                className="flex gap-4 group"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                </div>
                <div className="space-y-1 flex-1 pt-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href="/our-treatments"
              scroll
            >
              <button className="w-full sm:w-auto bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center">
                Get Started
                <Check className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal-600" />
              <span>No commitment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal-600" />
              <span>100% free consultation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
