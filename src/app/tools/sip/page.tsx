import type { Metadata } from "next";
import { SIPCalculator } from "@/components/calculators/SIPCalculator";

export const metadata: Metadata = {
  title: "SIP Calculator — KuberaNow",
  description: "Calculate the future value of your mutual fund SIP.",
};

export default function SIPPage() {
  return <SIPCalculator />;
}
