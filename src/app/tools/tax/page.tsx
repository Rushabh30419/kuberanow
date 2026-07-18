import type { Metadata } from "next";
import { TaxCalculator } from "@/components/calculators/TaxCalculator";

export const metadata: Metadata = {
  title: "Tax Calculator — KuberaNow",
  description: "Compare New vs Old income tax regime for FY 2025-26.",
};

export default function TaxPage() {
  return <TaxCalculator />;
}
