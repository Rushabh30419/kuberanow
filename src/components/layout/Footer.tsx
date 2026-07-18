import Link from "next/link";
import { SocialLinks } from "./SocialLinks";

type Col = { heading: string; links: { label: string; href: string }[] };

const COLUMNS: Col[] = [
  {
    heading: "Markets",
    links: [
      { label: "Live Market", href: "/market" },
      { label: "Stocks", href: "/market/stocks" },
      { label: "Mutual Funds", href: "/market/mutual-funds" },
      { label: "IPO", href: "/market/ipo" },
      { label: "Commodities", href: "/market/commodities" },
      { label: "Cryptocurrency", href: "/market/crypto" },
    ],
  },
  {
    heading: "News",
    links: [
      { label: "Economy", href: "/news/india" },
      { label: "Personal Finance", href: "/news/personal-finance" },
      { label: "Technology", href: "/news/technology" },
      { label: "Gujarat", href: "/news/gujarat" },
      { label: "National", href: "/news/national" },
      { label: "Global", href: "/news/global" },
      { label: "Entertainment", href: "/news/entertainment" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "SIP Calculator", href: "/tools/sip" },
      { label: "FD Calculator", href: "/tools/fd" },
      { label: "EMI Calculator", href: "/tools/emi" },
      { label: "Tax Calculator", href: "/tools/tax" },
      { label: "SWP Calculator", href: "/tools/swp" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Advertisement", href: "/advertise" },
      { label: "Career", href: "/career" },
      { label: "Contact", href: "/contact" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-dark-navy1 border-primary-navy text-gray-300 w-full border-t-2 px-4 py-6 pt-6 pb-6 font-sans xl:pt-10 xl:pb-4">
      <div className="mx-auto w-full md:max-w-7xl">
        <div className="flex w-full flex-col justify-between gap-6 md:flex-row">
          <div className="flex w-fit max-w-sm flex-col gap-4">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo2.svg"
                alt="KuberaNow"
                width={140}
                height={40}
                className="object-contain"
                loading="lazy"
              />
            </Link>
            <p className="text-sm leading-relaxed xl:max-w-xs">
              Independent business and financial journalism trusted by India&apos;s
              investors, executives and policymakers. Real-time market data,
              expert analysis and breaking news.
            </p>
            <SocialLinks iconSize={26} />
          </div>

          <div className="flex w-full flex-wrap justify-between gap-y-6 xl:w-max xl:gap-0">
            {COLUMNS.map((col) => (
              <div
                key={col.heading}
                className="flex w-40 flex-col gap-4 font-sans xl:min-w-[11.5rem]"
              >
                <h3 className="text-sm font-normal tracking-wider text-[#00FFEE] uppercase">
                  {col.heading}
                </h3>
                {col.links.map((l) => (
                  <div key={l.href} className="leading-[1.4] hover:scale-y-105">
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-5 md:flex-row">
          <p className="text-center text-[10px] md:text-left xl:text-xs">
            © 2026 K Globes Digital Media Private Limited. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
