import { FourteenDaysLanding } from "@/components/14days/landing";
import { daysFaqJsonLd, daysMetadata } from "@/lib/14days/seo";

export const metadata = daysMetadata("es");

export default function CatorceDiasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(daysFaqJsonLd("es")) }}
      />
      <FourteenDaysLanding locale="es" />
    </>
  );
}
