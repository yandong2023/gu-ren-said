import type { Metadata } from "next";
import SearchExperience from "@/components/SearchExperience";

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return <SearchExperience />;
}
