
import TreatmentsSwiper from "@/components/treatments-swiper";
import CallToAction from "@/components/call-to-action";

export default function OurTreatmentsPage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Our Treatments
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Explore our range of clinically guided programmes designed to help you
          look, feel, and perform at your best.
        </p>
        <TreatmentsSwiper />
        <div className="mt-12">
          <CallToAction />
        </div>
      </main>
    </div>
  );
}
