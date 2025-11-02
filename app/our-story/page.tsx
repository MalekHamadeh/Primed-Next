import OurStoryClient from "@/app/our-story/OurStoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primed Clinic | Story Behind Our Platform",
};

export default function OurStoryPage() {
  return <OurStoryClient />;
}
