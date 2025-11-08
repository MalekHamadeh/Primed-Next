"use client";
import { useEffect, useRef, useState } from "react";
import type React from "react";

import Link from "next/link";
import { getThemeById } from "@/components/color-theme-picker";
import {
  FaPills,
  FaHeartbeat,
  FaFlask,
  FaUserMd,
  FaHeadset,
  FaLaptopMedical,
  FaTruck,
  FaCircle,
} from "react-icons/fa";

function useThemeColors() {
  const [colors, setColors] = useState({
    background: "#14B8A6",
    text: "#121212",
  });

  useEffect(() => {
    const updateColors = () => {
      const savedThemeId = localStorage.getItem("hero-color-theme") || "primed";
      const theme = getThemeById(savedThemeId);
      const background =
        theme.brandBarBg ?? theme.accent;
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
      <span className="underline-anim-text">{label}</span>
    </Link>
  );
}

function Dot() {
  return (
    <span className="inline-flex items-center justify-center mx-4">
      <FaCircle size={7} />
    </span>
  );
}

function Track({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-8 whitespace-nowrap ${className ?? ""}`}
    >
      <Item
        href="/our-treatments"
        icon={<FaPills className="text-lg" />}
        label="Peptide Programs"
      />
      <Item
        href="/our-treatments"
        icon={<FaHeartbeat className="text-lg" />}
        label="Hormone Therapy"
      />
      <Item
        href="/our-treatments"
        icon={<FaFlask className="text-lg" />}
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
        icon={<FaHeadset className="text-lg" />}
        label="FREE Ongoing Premium Support"
      />
      <Item
        href="/faq"
        icon={<FaTruck className="text-lg" />}
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
    targetSpeedRef.current = 0; // ease to stop
  };

  const handleMouseLeave = () => {
    targetSpeedRef.current = baseSpeedRef.current; // ease back to running speed
  };

  return (
    <div
      className="text-[12px] font-semibold py-[10px] overflow-hidden relative w-full marquee shadow-[0_-15px_25px_rgba(0,0,0,0.4)]"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
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
