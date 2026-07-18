import type { Metadata } from "next";
import {
  LegalCard,
  LegalSectionHeading,
  LegalP,
  LegalList,
} from "@/components/company/LegalCard";

export const metadata: Metadata = {
  title: "Disclaimer | KuberaNow",
  description:
    "Read the KuberaNow disclaimer to understand the limitations of liability, content accuracy, third-party links, and the terms governing the use of our website.",
};

export default function DisclaimerPage() {
  return (
    <LegalCard title="Disclaimer">
      <div className="flex flex-col gap-4 md:gap-8">
        <section className="flex flex-col gap-3 md:gap-4">
          <LegalSectionHeading number="1.1" label="General Information Disclaimer" />
          <div className="space-y-2 md:space-y-3">
            <LegalP>
              The information published on KuberaNow (hereinafter referred to as
              &quot;the digital TV&quot;) — accessible via the website
              www.kuberanow.com and across all associated digital platforms, social
              media handles, mobile applications, and broadcast channels — is
              intended solely for general informational and educational purposes
              directed at Gujarati-speaking business professionals, traders,
              entrepreneurs, and investors.
            </LegalP>
            <LegalP>
              While KuberaNow endeavours to present accurate, timely, and credible
              business and financial news, the digital TV makes no representation
              or warranty — express or implied — regarding the completeness,
              correctness, reliability, suitability, or availability of any
              information, news report, data, analysis, commentary, or opinion
              published on or through the digital TV.
            </LegalP>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:gap-4">
          <LegalSectionHeading number="1.2" label="No Investment or Financial Advice" />
          <div className="space-y-2 md:space-y-3">
            <LegalP>
              <strong>IMPORTANT:</strong> Nothing published, broadcast, streamed,
              or communicated by KuberaNow constitutes investment advice, financial
              planning guidance, or any form of recommendation to buy, sell, or
              hold any securities, commodities, currencies, derivatives, or any
              other financial instrument.
            </LegalP>
            <LegalP>
              KuberaNow is a news media digital TV and is not registered with the
              Securities and Exchange Board of India (SEBI) as an Investment
              Adviser, Research Analyst, Portfolio Manager, Stock Broker, or in any
              other regulated capacity under the SEBI Act, 1992, or any regulations
              framed thereunder.
            </LegalP>
            <LegalP>
              Market data, stock prices, commodity rates, foreign exchange rates,
              economic indicators, and financial statistics published by KuberaNow
              are sourced from third-party data providers and public sources. Such
              data is provided for informational reference only and may not reflect
              real-time market conditions.
            </LegalP>
            <LegalP>
              Viewers, readers, and users are strongly advised to consult a
              SEBI-registered financial adviser or certified professional before
              making any investment decisions. KuberaNow shall bear no liability
              for any financial loss, damage, or adverse outcome arising directly
              or indirectly from reliance on content published by the digital TV.
            </LegalP>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:gap-4">
          <LegalSectionHeading number="1.3" label="Accuracy of News & Information" />
          <div className="space-y-2 md:space-y-3">
            <LegalP>
              KuberaNow follows standard journalistic practices in sourcing and
              verifying news. However, the digital TV does not guarantee the
              absolute accuracy of all reports and expressly disclaims any
              liability arising from:
            </LegalP>
            <LegalList
              items={[
                "Errors, inaccuracies, or omissions in any published content, whether editorial or otherwise.",
                "Delay in updating information that may have changed after the time of original publication.",
                "Inadvertent typographical, factual, or data-entry errors.",
                "Misinterpretation of statements made by third parties, public officials, or corporate entities.",
              ]}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3 md:gap-4">
          <LegalSectionHeading
            number="1.4"
            label="Third-Party Content & External Sources"
          />
          <div className="space-y-2 md:space-y-3">
            <LegalP>
              KuberaNow may publish, embed, link to, or otherwise reference content
              sourced from third-party news agencies, wire services, research
              reports, government publications, and corporate press releases. The
              digital TV does not endorse, verify, or assume responsibility for the
              accuracy, legality, or appropriateness of such third-party content.
            </LegalP>
            <LegalP>
              Opinions, views, and analyses expressed by guest contributors,
              anchors, analysts, or external commentators are solely their own and
              do not represent the editorial position of KuberaNow.
            </LegalP>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:gap-4">
          <LegalSectionHeading number="1.5" label="Forward-Looking Statements" />
          <div className="space-y-2 md:space-y-3">
            <LegalP>
              Certain content published by KuberaNow, including market outlooks,
              business forecasts, economic projections, and sector analyses, may
              contain forward-looking statements. Such statements are inherently
              speculative and involve risks and uncertainties. Actual outcomes may
              differ materially from those projected. KuberaNow undertakes no
              obligation to update or revise forward-looking statements following
              their publication.
            </LegalP>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:gap-4">
          <LegalSectionHeading number="1.6" label="Limitation of Liability" />
          <div className="space-y-2 md:space-y-3">
            <LegalP>
              To the fullest extent permitted under applicable Indian law,
              including the Information Technology Act, 2000, and the Information
              Technology (Intermediary Guidelines and Digital Media Ethics Code)
              Rules, 2021, KuberaNow, its directors, editors, reporters, employees,
              agents, and licensors shall not be held liable for any direct,
              indirect, incidental, consequential, special, or exemplary loss or
              damage arising out of the use of, or inability to use, any content
              published by the digital TV.
            </LegalP>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:gap-4">
          <LegalSectionHeading number="1.7" label="Changes to Disclaimer" />
          <div className="space-y-2 md:space-y-3">
            <LegalP>
              KuberaNow reserves the right to amend, update, or modify this
              Disclaimer at any time without prior notice. Continued use of the
              digital TV following any such revision constitutes your acceptance of
              the updated Disclaimer. The effective date of the current version is
              indicated at the top of this document.
            </LegalP>
          </div>
        </section>
      </div>
    </LegalCard>
  );
}
