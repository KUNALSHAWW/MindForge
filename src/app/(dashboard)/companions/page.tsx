import { Suspense } from "react";
import CompanionsPageClient from "./CompanionsClient";

export const metadata = {
  title: "Companions",
  description: "Browse and create learning companions tailored to your needs",
};

export default function CompanionsPage() {
  return (
    <Suspense>
      <CompanionsPageClient />
    </Suspense>
  );
}
