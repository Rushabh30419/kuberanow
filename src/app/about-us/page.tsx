import type { Metadata } from "next";
import { SectionHeading, GradientIcon } from "@/components/company/SectionHeading";
import { PageShell } from "@/components/company/PageShell";

export const metadata: Metadata = {
  title: "About Us | KuberaNow",
  description:
    "KuberaNow is Gujarat's dedicated Gujarati-language business news digital TV — where business speaks Gujarati and journalism serves the entrepreneurial spirit.",
};

const COVERAGE = [
  {
    title: "Regional Business News",
    body: "Gujarat is home to some of India's most dynamic industrial clusters — textiles and diamonds in Surat, chemicals and pharmaceuticals in Ankleshwar and Vadodara, the GIFT City financial hub in Gandhinagar, the port trade of Mundra and Kandla, and the agricultural markets of Mehsana, Junagadh, and beyond. KuberaNow covers these markets with unmatched depth, bringing daily ground-level reporting that no national digital TV can replicate.",
  },
  {
    title: "National Economy & Policy",
    body: "From Union Budget analysis to Reserve Bank of India policy decisions, from SEBI regulatory changes to GST updates — KuberaNow decodes national economic policy through the lens of how it impacts Gujarati businesses, MSMEs, traders, and investors.",
  },
  {
    title: "Global Business & International Markets",
    body: "In an era where a policy shift in Washington or a supply-chain disruption in China directly affects a textile exporter in Surat or a diamond polisher in Bhavnagar, global business literacy is no longer optional. KuberaNow brings international business news, currency markets, global commodity prices, and trade developments, contextualised for the Gujarati business professional.",
  },
];

const VALUES = [
  {
    title: "Editorial Integrity",
    body: "Our journalism is guided by trust, fairness, independence, and responsibility. Every editorial decision is free, fair, and unbiased, with users' interests at the centre. We create balanced and meaningful content for Gujarati investors, traders, entrepreneurs, professionals, and the wider business community.",
  },
  {
    title: "Accuracy and Verification",
    body: "Accuracy is central to every report we publish. Our news, data, market updates, and financial insights are carefully reviewed, verified, and cross-checked before publication. We follow high journalistic standards and use credible sources to deliver trusted information our users can rely on.",
  },
  {
    title: "Financial Literacy and Community",
    body: "KuberaNow is building an informed and financially aware Gujarati community. Through practical content on savings, loans, mutual funds, retirement, government schemes, and financial planning, we aim to promote financial literacy, responsible wealth creation, and long-term financial freedom.",
  },
  {
    title: "Independence",
    body: "KuberaNow's editorial team operates with full independence. Our journalism is guided by public interest, not private interest.",
  },
  {
    title: "Investor-First Approach",
    body: "KuberaNow follows an investor-first approach. Every story, insight, and analysis is designed to explain opportunities, risks, market trends, policy changes, and economic developments in a clear and practical way, helping Gujarati investors, traders, entrepreneurs, and professionals make informed decisions.",
  },
  {
    title: "Insights and Analysis",
    body: "KuberaNow delivers more than news; we provide context and perspective. Our analysis explains the reasons behind stock market movements, business decisions, government policies, and economic trends, helping users understand what happened, why it matters, and how it may influence their financial journey.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="flex w-full flex-col gap-4 lg:gap-5">
          {/* Section 1 — intro */}
          <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
            <SectionHeading>Where Business Speaks Gujarati</SectionHeading>
            <div className="mt-4 space-y-3 text-career-dark text-sm leading-relaxed lg:text-base">
              <p>
                Gujarat has always been more than a state. It is a mindset —
                entrepreneurial by heritage, global by ambition, and deeply rooted
                in the values of commerce, community, and trust. For generations,
                Gujarati entrepreneurs, traders, and investors have shaped
                economies from Surat to Singapore and from Rajkot to Rotterdam.
                Yet, despite their global influence, they have never had a
                dedicated Business Digital TV platform that speaks to them in
                their own language — both literally and culturally.
              </p>
              <p className="font-semibold">KuberaNow was born to fill that void.</p>
            </div>
          </article>

          {/* Section 2 — Our Story */}
          <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
            <SectionHeading>Our Story</SectionHeading>
            <div className="mt-4 space-y-3 text-career-dark text-sm leading-relaxed lg:text-base">
              <p>
                KuberaNow was founded with a singular conviction: the
                Gujarati-speaking business community — one of the most economically
                dynamic communities in the world — deserves a{" "}
                <strong>Business Digital TV</strong> platform that is as sharp,
                credible, and forward-looking as the people it serves.
              </p>
              <p>
                Named after Kubera, the ancient custodian of wealth in Indian
                tradition, KuberaNow respects the intelligence of its audience. We
                do not merely simplify business news — we contextualise it. We do
                not chase sensationalism — we pursue significance. Every story we
                cover, from the commodity markets of Unjha to the boardrooms of
                New York, is reported with precision, purpose, and a deep
                understanding of what matters to the Gujarati business mind.
              </p>
            </div>
          </article>

          {/* Section 3 — What We Cover */}
          <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
            <SectionHeading>What We Cover</SectionHeading>
            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {COVERAGE.map((c) => (
                <article
                  key={c.title}
                  className="border-career-stroke bg-career-tint flex flex-col gap-3 rounded-lg border p-4 lg:gap-4"
                >
                  <GradientIcon>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </GradientIcon>
                  <h4 className="text-career-dark text-base leading-5 font-bold lg:text-[22px] lg:leading-6.5">
                    {c.title}
                  </h4>
                  <p className="text-career-dark text-xs leading-relaxed lg:text-sm lg:leading-5">
                    {c.body}
                  </p>
                </article>
              ))}
            </div>
          </article>

          {/* Section 4 — Our Vision (dark gradient banner) */}
          <section className="bg-about-gradient border-career-stroke overflow-hidden rounded-lg border-[1.25px] p-3 lg:p-8">
            <SectionHeading
              as="h2"
              className="text-white!"
            >
              <span className="text-white">Our Vision</span>
            </SectionHeading>
            <div className="mt-4 space-y-4 text-white/90 lg:max-w-3xl">
              <p className="text-sm leading-relaxed lg:text-base">
                To be the most trusted, most-watched, and most-respected
                Gujarati-language <strong>Business Digital TV</strong> platform in
                the world — a platform that every Gujarati business professional
                sees as an indispensable partner in their professional and
                financial life, <strong>wherever they live in the world.</strong>
              </p>
              <p className="text-sm leading-relaxed lg:text-base">
                Gujarat's entrepreneurial spirit has always been its greatest
                strength. KuberaNow's mission is to fuel that spirit with
                knowledge, insight, and truth that does not bend. We are here to
                inform, empower, and guide the Gujarati business community with
                credible reporting, sharp analysis, and a clear understanding of
                what truly matters.
              </p>
            </div>
            {/* Pull-quote */}
            <div className="mt-6 w-full max-w-[582px] rounded-[10px] border border-white/15 bg-white/[0.07] px-4 py-4 lg:px-6">
              <p className="text-sm font-semibold text-white lg:text-base">
                "Powered by the Spirit of Gujarat.{" "}
                <span className="text-career-accent">
                  Driven by the World of Business.
                </span>
                "
              </p>
            </div>
          </section>

          {/* Section 5 — Our Values */}
          <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
            <SectionHeading>Our Values</SectionHeading>
            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
              {VALUES.map((v) => (
                <article
                  key={v.title}
                  className="border-career-stroke bg-career-tint shadow-[1px_1px_4px_0px_#0000001A] rounded-md border p-3 lg:p-4"
                >
                  <h3 className="text-career-dark mb-3 text-base leading-5 font-bold lg:mb-4 lg:text-[22px] lg:leading-6.5">
                    {v.title}
                  </h3>
                  <p className="text-career-dark text-xs leading-4.5 lg:text-base lg:leading-5">
                    {v.body}
                  </p>
                </article>
              ))}
            </div>
          </article>
        </section>
    </PageShell>
  );
}
