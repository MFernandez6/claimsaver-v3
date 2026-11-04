import { FourteenDaysThanks } from "@/components/14days/landing";
import { daysMetadata } from "@/lib/14days/seo";

export const metadata = {
  ...daysMetadata("en"),
  robots: { index: false, follow: false },
};

export default function FourteenDaysThanksPage() {
  return <FourteenDaysThanks locale="en" />;
}
