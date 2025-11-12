"use client";
import { useEffect, useRef, useState } from "react";
import type React from "react";

import Link from "next/link";
import { getThemeById } from "@/components/color-theme-picker";
import { FaUserMd, FaLaptopMedical } from "react-icons/fa";

import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Headset,
  Heart,
  Pill,
  Truck,
} from "lucide-react";

function useThemeColors() {
  const [colors, setColors] = useState({
    background: "#14B8A6",
    text: "#121212",
  });

  useEffect(() => {
    const updateColors = () => {
      const savedThemeId = localStorage.getItem("hero-color-theme") || "primed";
      const theme = getThemeById(savedThemeId);
      const background = theme.brandBarBg ?? theme.accent;
      const text =
        theme.brandBarText ?? (theme.isDark ? theme.background : "#000000");
      setColors({ background, text });
    };

    updateColors();
    window.addEventListener("theme-changed", updateColors);
    return () => window.removeEventListener("theme-changed", updateColors);
  }, []);

  return colors;
}

function Item({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-2 group"
    >
      <span className="inline-flex items-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function Track({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-8 whitespace-nowrap ${className ?? ""}`}
    >
      <Item
        href="/our-treatments"
        icon={<Pill className="size-4 " />}
        label="Peptide Programs"
      />
      <Item
        href="/our-treatments"
        icon={<Heart className="size-4" />}
        label="Hormone Therapy"
      />
      <Item
        href="/our-treatments"
        icon={<FlaskConical className="size-4" />}
        label="Compounded Treatments For Your Care"
      />
      <Item
        href="/how-it-works"
        icon={<FaLaptopMedical className="text-lg" />}
        label="100% Telehealth"
      />
      <Item
        href="/contact"
        icon={<FaUserMd className="text-lg" />}
        label="FREE Consultation"
      />
      <Item
        href="/contact"
        icon={<Headset className="size-4" />}
        label="FREE Ongoing Premium Support"
      />
      <Item
        href="/faq"
        icon={<Truck className="size-4" />}
        label="FREE Express Delivery Australia-Wide"
      />
    </div>
  );
}

export default function ValuePropBar() {
  const themeColors = useThemeColors();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [segmentCopies, setSegmentCopies] = useState(2);

  const positionRef = useRef(0);
  const speedRef = useRef(0); // px/s (current)
  const targetSpeedRef = useRef(0); // px/s (target)
  const baseSpeedRef = useRef(0); // px/s (computed from content width)
  const lastTsRef = useRef<number | null>(null);
  const trackWidthRef = useRef(0);
  const segmentWidthRef = useRef(0); // width of composite segment (segmentCopies * track width)
  const rafRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const isArrowActiveRef = useRef(false);

  useEffect(() => {
    function measure() {
      const el = trackRef.current;
      if (!el) return;
      const width = el.offsetWidth;
      trackWidthRef.current = width;
      // Slow base speed: one full content width in ~120s
      const base = width / 80;
      baseSpeedRef.current = base;
      speedRef.current = base;
      targetSpeedRef.current = base;

      // Build a composite segment: repeat the track until its width >= container width + one track
      const containerW = containerRef.current?.offsetWidth ?? 0;
      const copies = Math.max(2, Math.ceil(containerW / width) + 1);
      setSegmentCopies(copies);
      segmentWidthRef.current = copies * width;

      // Reset position within one segment to avoid jumps
      positionRef.current = Math.max(
        -segmentWidthRef.current + 1,
        Math.min(0, positionRef.current)
      );
    }

    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    function tick(ts: number) {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000); // clamp dt
      lastTsRef.current = ts;

      // Ease current speed toward target speed (smooth decel/accel)
      const ease = Math.min(1, dt * 4); // time-constant ~250ms
      speedRef.current += (targetSpeedRef.current - speedRef.current) * ease;

      // Advance position
      positionRef.current -= speedRef.current * dt;

      // Loop by one composite segment width for continuous flow without early duplicates
      const segW = segmentWidthRef.current;
      if (segW > 0) {
        while (positionRef.current <= -segW) {
          positionRef.current += segW;
        }
        while (positionRef.current >= 0) {
          positionRef.current -= segW;
        }
      }

      // Apply transform
      const scroller = scrollerRef.current;
      if (scroller) {
        scroller.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (!isArrowActiveRef.current) {
      targetSpeedRef.current = 0; // ease to stop
    }
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (!isArrowActiveRef.current) {
      targetSpeedRef.current = baseSpeedRef.current; // ease back to running speed
    }
  };

  const accelerate = (dir: "left" | "right") => {
    isArrowActiveRef.current = true;
    const base = baseSpeedRef.current || 40; // fallback if not measured yet
    const factor = 8;
    targetSpeedRef.current = (dir === "right" ? 1 : -1) * base * factor;
  };

  const decelerate = () => {
    isArrowActiveRef.current = false;
    if (isHoveringRef.current) {
      targetSpeedRef.current = 0;
    } else {
      targetSpeedRef.current = baseSpeedRef.current;
    }
  };

  return (
    <div
      className="text-[12px] font-semibold py-[10px] overflow-hidden relative w-full marquee shadow-[0_-15px_25px_rgba(0,0,0,0.4)] group"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Left arrow */}
      <button
        type="button"
        aria-label="Scroll left"
        title="Press and hold"
        className="absolute left-0 top-0 bottom-0 w-10 md:w-12 h-auto flex items-center justify-center z-10 focus:outline-none group opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto"
        onMouseDown={() => accelerate("right")}
        onMouseUp={decelerate}
        onMouseLeave={decelerate}
        onTouchStart={() => accelerate("right")}
        onTouchEnd={decelerate}
      >
        <span
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-transparent z-0"
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
          Press and hold
        </span>
        <span className="relative z-10 h-6 w-6 md:h-7 md:w-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center shadow-md transition-colors">
          <ChevronLeft className="size-4 text-white" />
        </span>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        aria-label="Scroll right"
        title="Press and hold"
        className="absolute right-0 top-0 bottom-0 w-10 md:w-12 flex items-center justify-center z-10 focus:outline-none group opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto"
        onMouseDown={() => accelerate("left")}
        onMouseUp={decelerate}
        onMouseLeave={decelerate}
        onTouchStart={() => accelerate("left")}
        onTouchEnd={decelerate}
      >
        <span
          className="pointer-events-none absolute inset-0 bg-linear-to-l from-black/10 to-transparent z-0"
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
          Press and hold
        </span>
        <span className="relative z-10 h-6 w-6 md:h-7 md:w-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center shadow-md transition-colors">
          <ChevronRight className="size-4 text-white" />
        </span>
      </button>

      <div
        ref={scrollerRef}
        className="flex will-change-transform whitespace-nowrap"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {/* Two composite segments for continuous coverage */}
        {[0, 1].map((segIdx) => (
          <div
            key={segIdx}
            className="flex flex-none"
            aria-hidden={segIdx !== 0}
          >
            {Array.from({ length: segmentCopies }).map((_, idx) => (
              <div
                key={`${segIdx}-${idx}`}
                ref={segIdx === 0 && idx === 0 ? trackRef : undefined}
                className="flex-none pr-8"
              >
                <Track />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
