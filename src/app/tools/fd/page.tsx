import type { Metadata } from "next";
import { FDCalculator } from "@/components/calculators/FDCalculator";

export const metadata: Metadata = {
  title: "FD Calculator — KuberaNow",
  description: "Calculate the maturity value of a Fixed Deposit.",
};

export default function FDPage() {
  return <FDCalculator />;
}
