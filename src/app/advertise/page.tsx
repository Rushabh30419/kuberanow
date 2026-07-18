import type { Metadata } from "next";
import { SectionHeading, GradientIcon } from "@/components/company/SectionHeading";
import { PageShell } from "@/components/company/PageShell";

export const metadata: Metadata = {
  title: "Advertise with Us | KuberaNow",
  description:
    "Reach Gujarat's business audience with KuberaNow advertising across television, digital, newsletter, and social media channels.",
};

const FORMATS = [
  {
    title: "Digital & Web",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
      </svg>
    ),
    items: [
      { bold: "Pre-Roll & Mid-Roll Video Ads:", text: " 15 to 30 second non-skippable and skippable video ads on our website and YouTube channel." },
      { bold: "Homepage & Section Display Banners:", text: " High-visibility banner placements (Billboard, Leaderboard, MREC) across the website." },
      { bold: "Sponsored Articles & Native Content:", text: " Long-form branded editorial content crafted in KuberaNow's voice, clearly marked as sponsored." },
      { bold: "Push Notification Campaigns:", text: " Branded breaking news alerts to opted-in subscribers." },
    ],
  },
  {
    title: "Live Stream",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l2-2h14l2 2" />
      </svg>
    ),
    items: [
      { bold: "30-Second and 60-Second Commercial Spots:", text: " Premium placement in prime-time business bulletins, market opening/closing segments, and special programming." },
      { bold: "Programme Sponsorship:", text: " Exclusive sponsor of flagship shows such as morning market reports, evening business summaries, and weekly sector specials." },
      { bold: "Lower Third Branded Tickers:", text: " Branded data scrolls appearing during live market updates." },
      { bold: "In-Studio Brand Integration:", text: " Tasteful brand presence within the studio set during editorial programming." },
    ],
  },
  {
    title: "Newsletter & Email Marketing",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
      </svg>
    ),
    items: [
      { bold: "Morning Business Briefing Sponsorship:", text: " Exclusive sponsorship of KuberaNow's daily subscriber newsletter, delivered to verified business professionals." },
      { bold: "Dedicated Email Campaigns:", text: " Custom-designed emails sent to segmented audience lists on behalf of advertisers." },
    ],
  },
  {
    title: "Social Media",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 10v4M5 10a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2zM12 8V4M9 4h6" />
      </svg>
    ),
    items: [
      { bold: "Branded Content Posts:", text: " Sponsored content across KuberaNow's Facebook, Instagram, X (Twitter), and LinkedIn channels." },
      { bold: "Reel & Short Video Sponsorship:", text: " Branded tags on high-performing short-form content." },
      { bold: "Live Session Sponsors:", text: " Exclusive branding during KuberaNow Facebook and YouTube Live sessions." },
    ],
  },
];

const WHY = [
  {
    title: "Unmatched Reach",
    body: "Access Gujarat's most commercially active audience through the only dedicated Gujarati-language business news platform.",
  },
  {
    title: "High-Intent Audience",
    body: "Our viewers are active decision-makers — business owners and investors who act on the information they consume.",
  },
  {
    title: "Brand Trust by Association",
    body: "Advertising with a credible, independent business digital TV significantly elevates brand perception among discerning business consumers.",
  },
  {
    title: "Multi-Platform Presence",
    body: "Your brand travels with your audience — from TV to mobile to social media — through integrated multi-platform campaigns.",
  },
];

export default function AdvertisePage() {
  return (
    <PageShell>
      <section className="flex w-full flex-col gap-4 lg:gap-5">
          {/* Hero intro */}
          <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
            <SectionHeading>Advertise with Us</SectionHeading>
            <h2 className="text-career-dark mt-3 text-base leading-5 font-bold lg:text-xl lg:leading-6">
              Reach the Heart of Gujarati Business India
            </h2>
            <p className="text-career-dark mt-3 text-sm leading-relaxed lg:text-base">
              KuberaNow is not just a news digital TV. It is a trusted daily
              companion for Gujarat's most economically active and commercially
              influential audience. When you advertise with KuberaNow, you are not
              merely buying airtime or digital impressions — you are earning the
              attention, trust, and consideration of a community that has always
              put business first.
            </p>
          </article>

          {/* Advertising Formats */}
          <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
            <SectionHeading>Advertising Formats</SectionHeading>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              {FORMATS.map((f) => (
                <div
                  key={f.title}
                  className="bg-surface border-career-stroke flex h-full flex-col gap-4 border-b pb-5"
                >
                  <div className="flex items-center gap-3">
                    <GradientIcon>{f.icon}</GradientIcon>
                    <h3 className="text-career-dark text-base leading-5 font-bold lg:text-[22px] lg:leading-6.5">
                      {f.title}
                    </h3>
                  </div>
                  <ul className="text-career-dark flex flex-col gap-2 text-xs leading-4 lg:text-[16px] lg:leading-5">
                    {f.items.map((it, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary mt-1 shrink-0 lg:mt-1.5">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                        <span>
                          <strong className="font-semibold">{it.bold}</strong>
                          {it.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          {/* CTA gradient banner */}
          <section className="bg-contact-ad-gradient shadow-contact-promo overflow-hidden rounded-md border border-career-stroke lg:rounded-lg">
            <div className="flex flex-col items-center gap-6 p-3 text-center lg:gap-10 lg:p-8">
              <h2 className="text-center text-lg leading-5.5 font-bold text-white lg:max-w-[34rem] lg:text-[32px] lg:leading-10">
                <span className="text-career-accent">Ready to Reach</span>{" "}
                Gujarat's Business Audience?
              </h2>
              <p className="text-center text-xs leading-4.5 text-white/90 lg:max-w-[34rem] lg:text-lg lg:leading-5.5">
                Contact our Business Development team today for a customised media
                kit, audience insights, and campaign packages tailored to your
                brand objectives.
              </p>
              <div className="bg-career-accent text-career-dark flex flex-wrap items-center justify-center gap-3 rounded-lg px-4 py-2 text-xs leading-5 font-bold shadow-[0px_0px_3px_rgba(0,0,0,0.5)] lg:gap-4 lg:text-base">
                <a href="tel:+919904277760" className="hover:opacity-80">
                  +91 99042 77760
                </a>
                <span aria-hidden="true">|</span>
                <a href="mailto:info@kuberanow.com" className="hover:opacity-80">
                  info@kuberanow.com
                </a>
              </div>
            </div>
          </section>

          {/* Why Advertise */}
          <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
            <SectionHeading>Why Advertise with KuberaNow?</SectionHeading>
            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
              {WHY.map((w) => (
                <article
                  key={w.title}
                  className="border-career-stroke bg-career-tint shadow-[1px_1px_2px_rgba(0,0,0,0.1)] rounded-md border p-3 lg:p-4"
                >
                  <h3 className="text-career-dark mb-3 text-base leading-5 font-bold lg:mb-4 lg:text-[22px] lg:leading-6.5">
                    {w.title}
                  </h3>
                  <p className="text-career-dark text-xs leading-4 lg:text-base lg:leading-5">
                    {w.body}
                  </p>
                </article>
              ))}
            </div>
          </article>

          {/* Disclaimer note */}
          <div className="border-career-stroke bg-surface rounded-md border px-6 py-4 lg:rounded-lg">
            <p className="text-career-dark text-xs leading-4 lg:text-sm">
              KuberaNow offers transparent, ethical, and clearly labelled
              commercial arrangements. Sponsored and branded content is always
              disclosed to our audience in accordance with the guidelines of the
              Press Council of India and applicable digital advertising standards.
            </p>
          </div>
        </section>
    </PageShell>
  );
}
