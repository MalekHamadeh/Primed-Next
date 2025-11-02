
import HowItWorksCard from "@/components/how-it-works-card";
import CallToAction from "@/components/call-to-action";

export default function HowItWorksPage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How It Works
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Getting started is simple. Follow these steps to begin your
          personalised journey.
        </p>
        <HowItWorksCard />
        <div className="mt-12">
          <CallToAction />
        </div>
      </main>
    </div>
  );
}
