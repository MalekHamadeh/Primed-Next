import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CallToAction from "@/components/call-to-action";
import Image from "next/image";
import DoctorsSwiper from "@/components/doctors-swiper";

export const metadata: Metadata = {
  title: "Primed Clinic | Our Doctors",
};

export default function OurDoctorsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[rgba(245,245,234,0.35)] py-[75px] px-[25px] text-center">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="max-w-[550px] my-[25px] mb-[55px] mx-auto">
            <h2 className="text-[45px] mb-[15px] leading-none animate-fade-in">
              Meet Our Experts
            </h2>
            <p className="text-[15px] mx-auto mb-[35px] max-w-[440px] text-[#383838] animate-fade-in">
              Welcome to Primed Clinic where we group a team of the best experts
              in the field, that are ready to help you with your problems.
            </p>
          </div>
          <div className="relative w-full h-[500px] rounded-[18px] overflow-hidden">
            <Image
              src="/images/our_doctors_team.jpg"
              alt="Our Doctors"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-[70px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="max-w-[300px] mb-[45px] mx-auto animate-fade-in">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="h-full bg-white shadow-[1px_1px_3px_rgba(123,121,121,0.59)] rounded-[8px] px-[15px] pt-[40px] pb-[55px] text-center max-w-[300px] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/01.png"
                alt="Health Icon"
                className="w-[60px] h-[60px] mb-[44px] mx-auto animate-fade-in"
              />
              <h5 className="mt-[10px] text-[24px] animate-fade-in">
                Your Health First
              </h5>
              <p className="text-[15px] max-w-[300px] mx-auto animate-fade-in">
                We are dedicated to your health and well-being, providing
                personalized care to help you achieve optimal health.
              </p>
            </div>
            {/* Card 2 */}
            <div className="h-full bg-white shadow-[1px_1px_3px_rgba(123,121,121,0.59)] rounded-[8px] px-[15px] pt-[40px] pb-[55px] text-center max-w-[300px] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/02.png"
                alt="Honest Icon"
                className="w-[60px] h-[60px] mb-[44px] mx-auto animate-fade-in"
              />
              <h5 className="mt-[10px] text-[24px] animate-fade-in">
                Honest Care
              </h5>
              <p className="text-[15px] max-w-[300px] mx-auto animate-fade-in">
                Our team ensures you understand every step of your treatment
                plan and are always informed about your progress.
              </p>
            </div>
            {/* Card 3 */}
            <div className="h-full bg-white shadow-[1px_1px_3px_rgba(123,121,121,0.59)] rounded-[8px] px-[15px] pt-[40px] pb-[55px] text-center max-w-[300px] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/03.png"
                alt="Personalized Icon"
                className="w-[60px] h-[60px] mb-[44px] mx-auto animate-fade-in"
              />
              <h5 className="mt-[10px] text-[24px] animate-fade-in">
                Personalized Care
              </h5>
              <p className="text-[15px] max-w-[300px] mx-auto animate-fade-in">
                We recognize that every patient is unique. Our approach to
                healthcare is individualized, focusing on your specific needs
                and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-[75px] px-[5px] bg-[rgba(245,245,234,0.35)]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="mb-[5px] text-center animate-fade-in">Our Experts</h2>
          <p className="max-w-[390px] text-[15px] mb-[43px] leading-[1.3] text-[#474747] text-center mx-auto animate-fade-in">
            Meet Our Experts! Our doctors are here to provide for you the best
            service.
          </p>
          <div>
            <DoctorsSwiper />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-[45px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <CallToAction />
        </div>
      </section>
    </div>
  );
}
