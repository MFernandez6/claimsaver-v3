import { FourteenDaysThanks } from "@/components/14days/landing";
import { daysMetadata } from "@/lib/14days/seo";

export const metadata = {
  ...daysMetadata("fr"),
  robots: { index: false, follow: false },
};

export default function QuatorzeJoursMerciPage() {
  return <FourteenDaysThanks locale="fr" />;
}
