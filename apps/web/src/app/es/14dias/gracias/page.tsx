import { FourteenDaysThanks } from "@/components/14days/landing";
import { daysMetadata } from "@/lib/14days/seo";

export const metadata = {
  ...daysMetadata("es"),
  robots: { index: false, follow: false },
};

export default function CatorceDiasGraciasPage() {
  return <FourteenDaysThanks locale="es" />;
}
