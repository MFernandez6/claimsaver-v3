import { FourteenDaysLanding } from "@/components/14days/landing";
import { daysFaqJsonLd, daysMetadata } from "@/lib/14days/seo";

export const metadata = daysMetadata("fr");

export default function QuatorzeJoursPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(daysFaqJsonLd("fr")) }}
      />
      <FourteenDaysLanding locale="fr" />
    </>
  );
}
