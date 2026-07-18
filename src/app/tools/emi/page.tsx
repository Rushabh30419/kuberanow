import type { Metadata } from "next";
import { EMICalculator } from "@/components/calculators/EMICalculator";

export const metadata: Metadata = {
  title: "EMI Calculator — KuberaNow",
  description: "Calculate your monthly loan EMI and total interest payable.",
};

export default function EMIPage() {
  return <EMICalculator />;
}
