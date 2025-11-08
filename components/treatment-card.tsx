"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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
      className="group block no-underline"
      aria-label={name}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-52 h-52 rounded-full overflow-hidden bg-background">
          <Image
            src={imgSrc || "/placeholder.svg"}
            alt={name}
            width={350}
            height={350}
            className="w-full h-full object-cover object-center rounded-full transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="text-base md:text-lg font-semibold text-foreground leading-tight text-balance group-hover:text-primary transition-colors duration-300 max-w-[200px]">
            {name}
          </h3>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300">
            <span>View Treatment</span>
            <div className="w-6 h-6 rounded-full bg-[#14B8A6]/10 flex items-center justify-center group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-3.5 h-3.5 text-[#112726] transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
