"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import DoctorsCard from "@/components/DoctorsCard";
import { doctors } from "@/data/doctors";

export default function DoctorsSwiper() {
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={20}
      breakpoints={{
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }}
      className="w-full"
    >
      {doctors.map((d) => (
        <SwiperSlide
          key={d.id}
          className="pb-10"
        >
          <DoctorsCard
            imageSrc={d.imageSrc}
            doctorName={d.name}
            doctorRole={d.role}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
