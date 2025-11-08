"use client";

import { useEffect, useState } from "react";
import { httpGet } from "@/lib/api";
import type { TreatmentsResponse, TreatmentApi } from "@/types/treatments";
import TreatmentCard from "./treatment-card";
import { Loader2 } from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type TreatmentItem = {
  id: string | number;
  name: string;
  image?: string | null;
};

export default function TreatmentsSwiper() {
  const [items, setItems] = useState<TreatmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await httpGet<TreatmentsResponse>("/treatments");
        const list = Array.isArray(res?.data) ? res.data : [];
        const mapped: TreatmentItem[] = list.map((t: TreatmentApi) => ({
          id: t.id,
          name: t.name,
          image: t.image ? `/images/${t.image}` : null,
        }));
        if (!cancelled) {
          setItems(mapped);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full">
      <div className="container mx-auto pt-24">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground">
              No treatments available at the moment.
            </p>
          </div>
        ) : (
          <div className="relative">
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              modules={[Navigation, Pagination, Autoplay]}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
                1280: { slidesPerView: 4, spaceBetween: 32 },
              }}
              className="pb-12!"
            >
              {items.map((t) => (
                <SwiperSlide
                  key={t.id}
                  className="h-auto"
                >
                  <TreatmentCard
                    id={t.id}
                    name={t.name}
                    image={t.image || undefined}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <style
        jsx
        global
      >{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: hsl(var(--muted-foreground));
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: hsl(var(--primary));
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
