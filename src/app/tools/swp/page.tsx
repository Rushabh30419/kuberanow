import type { Metadata } from "next";
import { SWPCalculator } from "@/components/calculators/SWPCalculator";

export const metadata: Metadata = {
  title: "SWP Calculator — KuberaNow",
  description: "Estimate how long your corpus lasts with monthly withdrawals.",
};

export default function SWPPage() {
  return <SWPCalculator />;
}
