import TreatmentsSwiper from "@/components/treatments-swiper";
import CallToAction from "@/components/call-to-action";
import DescriptionCard from "@/components/description-card";
import FadeInOnScroll from "@/components/fade-in-on-scroll";
import HeroSection from "@/components/hero-section";
import BenefitsCard from "@/components/benefits-card";
import HowItWorksCard from "@/components/how-it-works-card";

export default function Home() {
  return (
    <div>
      <div id="home_page">
        <HeroSection variant="flip" />

        {/* Description Section */}
        <FadeInOnScroll>
          <section className="py-34">
            <div className="container mx-auto px-4">
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
            <div className="container w-full px-4">
              <BenefitsCard leftImageSrc="/images/doctors_image.jpg" />
            </div>
          </section>
        </FadeInOnScroll>

        {/* How It Works Section (New themed layout) */}
        <FadeInOnScroll>
          <section className="flex items-center bg-secondary justify-center py-12 lg:py-20">
            <div className="container w-full px-4">
              <HowItWorksCard />
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
