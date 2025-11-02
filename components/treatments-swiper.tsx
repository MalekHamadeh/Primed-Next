"use client";

import { useEffect, useState } from "react";
import { httpGet } from "@/lib/api";
import { TreatmentsResponse, TreatmentApi } from "@/types/treatments";
import TreatmentCard from "./treatment-card";

// Swiper: match legacy behavior with Scrollbar and breakpoints
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

type TreatmentItem = {
  id: string | number;
  name: string;
  image?: string | null;
};

export default function TreatmentsSwiper() {
  const [items, setItems] = useState<TreatmentItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Base client already appends /api; use /v1 to get /api/v1 per project rule
        const res = await httpGet<TreatmentsResponse>("/treatments");
        const list = Array.isArray(res?.data) ? res.data : [];
        const mapped: TreatmentItem[] = list.map((t: TreatmentApi) => ({
          id: t.id,
          name: t.name,
          image: t.image ? `/images/${t.image}` : null,
        }));
        if (!cancelled) setItems(mapped);
      } catch {
        if (!cancelled) setItems([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="treatments_swiper">
      <div className="container mx-auto px-4">
        <div className="row">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            modules={[Scrollbar]}
            scrollbar={{ draggable: true }}
            breakpoints={{
              740: { slidesPerView: 2 },
              1080: { slidesPerView: 3 },
              1300: { slidesPerView: 4 },
            }}
          >
            {items.map((t) => (
              <SwiperSlide key={t.id}>
                <TreatmentCard
                  id={t.id}
                  name={t.name}
                  image={t.image || undefined}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
