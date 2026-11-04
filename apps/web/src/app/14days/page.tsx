import { FourteenDaysLanding } from "@/components/14days/landing";
import { daysFaqJsonLd, daysMetadata } from "@/lib/14days/seo";

export const metadata = daysMetadata("en");

export default function FourteenDaysPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(daysFaqJsonLd("en")) }}
      />
      <FourteenDaysLanding locale="en" />
    </>
  );
}
