"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";

export type TreatmentCardProps = {
  id: string | number;
  name: string;
  image?: string | null;
};

function getAuthKey(): string {
  return (
    process.env.NEXT_PUBLIC_USER_AUTH_KEY ||
    process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY ||
    "user_auth"
  );
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return false;
  try {
    const key = getAuthKey();
    const raw = window.localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.isAuthenticated === true;
  } catch {
    return false;
  }
}

function subscribeToAuth(callback: () => void) {
  const handler = () => callback();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }
  return () => {};
}

export default function TreatmentCard({ id, name, image }: TreatmentCardProps) {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    () => false
  );

  const href = isAuthenticated
    ? "/patient/treatment-plans/create"
    : "/coming-soon";

  const imgSrc =
    image?.startsWith("/") || image?.startsWith("http")
      ? image
      : image
      ? `/images/${image}`
      : "/images/hero_image_cream.jpg";

  return (
    <Link
      href={href}
      className="no-underline"
      aria-label={name}
    >
      <div className="max-w-[300px] mx-auto mb-[30px] relative border border-[#d9d9d96b] rounded-[30px] overflow-hidden cursor-pointer bg-white p-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] h-[340px] flex flex-col justify-between">
        <div className="bg-transparent rounded-full overflow-hidden mx-auto mb-[15px]">
          <div className="w-[220px] h-[220px] rounded-full mx-auto overflow-hidden">
            {/* Using img to allow dynamic filenames under public/images without domain allowlist */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="text-center px-[10px]">
          <h6 className="text-[16px] font-semibold mb-2 leading-tight min-h-[40px]">
            {name}
          </h6>
          <div className="flex items-center justify-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/roundArrow.png"
              alt="Right Arrow"
              className="w-[22px] h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
