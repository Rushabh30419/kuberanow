import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer — KuberaNow",
  description: "Editorial and financial disclaimer for KuberaNow.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated="July 18, 2026"
      sections={[
        {
          heading: "General information only",
          body: (
            <p>
              All content published on KuberaNow (including articles, market data,
              calculators, videos and newsletters) is provided for general
              informational and educational purposes only. It does not constitute
              investment advice, financial advice, trading advice, or any other
              form of advice.
            </p>
          ),
        },
        {
          heading: "Not investment advice",
          body: (
            <>
              <p>
                Nothing on this website should be interpreted as a recommendation
                to buy, sell, or hold any security, mutual fund, commodity,
                cryptocurrency, or other financial instrument.
              </p>
              <p>
                Investments in securities markets are subject to market risks. Past
                performance is not indicative of future results. Please consult a
                SEBI-registered investment advisor before making any investment
                decision.
              </p>
            </>
          ),
        },
        {
          heading: "Market data accuracy",
          body: (
            <p>
              Market data, prices, and statistics displayed on KuberaNow may be
              delayed, sample, or illustrative. We do not guarantee the accuracy,
              completeness, or timeliness of any data on this website and accept no
              liability for any losses arising from its use.
            </p>
          ),
        },
        {
          heading: "Calculators & tools",
          body: (
            <p>
              Our financial calculators (SIP, FD, EMI, Tax, SWP) produce
              estimates based on the inputs you provide and standard formulas.
              Actual results will vary based on market conditions, taxes, fees,
              and other factors.
            </p>
          ),
        },
        {
          heading: "External links",
          body: (
            <p>
              KuberaNow may link to third-party websites for reference. We do not
              control and are not responsible for the content, privacy practices,
              or accuracy of any third-party sites.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about this disclaimer can be sent to{" "}
              <a
                href="mailto:legal@kuberanow.com"
                className="text-blue-700 underline"
              >
                legal@kuberanow.com
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
