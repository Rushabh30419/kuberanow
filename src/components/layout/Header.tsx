"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SocialLinks } from "./SocialLinks";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Live Market", href: "/market" },
  { label: "Stocks", href: "/market/stocks" },
  { label: "Mutual Funds", href: "/market/mutual-funds" },
  { label: "IPO", href: "/market/ipo" },
  { label: "Commodities", href: "/market/commodities" },
  { label: "Crypto", href: "/market/crypto" },
  { label: "Economy", href: "/news/india" },
  { label: "Personal Finance", href: "/news/personal-finance" },
  { label: "Technology", href: "/news/technology" },
  { label: "Gujarat", href: "/news/gujarat" },
  { label: "National", href: "/news/national" },
  { label: "Global", href: "/news/global" },
  { label: "Entertainment", href: "/news/entertainment" },
  { label: "About", href: "/about-us" },
  { label: "Career", href: "/career" },
  { label: "Contact", href: "/contact" },
];

function useTodayLabel() {
  const [label, setLabel] = useState("—");
  useEffect(() => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    setLabel(`${day}, ${dd}/${mm}/${yyyy}`);
  }, []);
  return label;
}

export function Header() {
  const today = useTodayLabel();
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  return (
    <header className="relative z-40 w-full bg-white font-sans shadow-sm">
      {/* Top bar */}
      <div className="mx-auto w-full max-w-7xl px-4 py-2.5 sm:py-1.5 xl:px-0">
        <div className="flex w-full items-center justify-between gap-3">
          <Link href="/" className="w-28 sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="KuberaNow"
              width={148}
              height={50}
              className="w-full"
              loading="lazy"
            />
          </Link>

          <div className="flex items-center gap-2 py-0 sm:py-1">
            <div className="flex w-fit items-center justify-center gap-2 rounded-md border border-gray-200 px-2.5 py-2 text-[10px] whitespace-nowrap sm:py-2.75 sm:text-content-small">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="h-3 w-3 shrink-0 text-black sm:h-3.75 sm:w-3.75"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Calendar">
                  <path d="M18.438,4.954H16.5c0-0.346,0-0.691,0-1.036c0-0.124,0-0.248,0-0.372c0-0.262-0.23-0.512-0.5-0.5 c-0.271,0.012-0.5,0.22-0.5,0.5c0,0.469,0,0.939,0,1.408h-7c0-0.346,0-0.691,0-1.036c0-0.124,0-0.248,0-0.372 c0-0.262-0.23-0.512-0.5-0.5c-0.271,0.012-0.5,0.22-0.5,0.5c0,0.469,0,0.939,0,1.408H5.562c-1.378,0-2.5,1.122-2.5,2.5v11 c0,1.379,1.122,2.5,2.5,2.5h12.875c1.379,0,2.5-1.121,2.5-2.5v-11C20.938,6.076,19.816,4.954,18.438,4.954z M5.562,5.954H7.5 c0,0.073,0,0.147,0,0.22c0,0.124,0,0.248,0,0.372c0,0.262,0.23,0.512,0.5,0.5c0.271-0.012,0.5-0.22,0.5-0.5c0-0.197,0-0.394,0-0.592 h7c0,0.073,0,0.147,0,0.22c0,0.124,0,0.248,0,0.372c0,0.262,0.23,0.512,0.5,0.5c0.271-0.012,0.5-0.22,0.5-0.5 c0-0.197,0-0.394,0-0.592h1.937c0.827,0,1.5,0.673,1.5,1.5v1.584H4.062V7.454C4.062,6.627,4.735,5.954,5.562,5.954z M18.438,19.954 H5.562c-0.827,0-1.5-0.673-1.5-1.5v-8.416h15.875v8.416C19.938,19.281,19.265,19.954,18.438,19.954z" />
                </g>
              </svg>
              <span className="text-career-dark">{today}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="from-dark-navy2 to-primary-navy relative w-full overflow-visible border-b border-[#00FFEE] bg-gradient-to-r text-white">
        <div className="mx-auto flex items-stretch px-4 xl:px-0">
          <div className="w-full justify-center xl:flex">
            <div className="flex justify-between text-[10px] font-bold tracking-normal sm:font-semibold lg:text-sm">
              {/* Desktop nav links */}
              <div className="hidden items-stretch lg:flex">
                {NAV.map((item) => {
                  const active = activePath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-center whitespace-nowrap px-3.5 py-3 xl:px-2.5 xl:py-3 transition-colors border-b-2 ${
                        active
                          ? "border-[#00FFEE] bg-[#00219A] text-[#00FFEE]"
                          : "border-transparent hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile hamburger */}
              <button
                className="mr-0 flex items-center justify-end transition-colors md:mr-10 lg:hidden"
                aria-label="Toggle navigation"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {open ? (
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="32"
                      d="M368 368 144 144M368 144 144 368"
                    />
                  ) : (
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="32"
                      d="M80 160h336M80 256h336M80 352h336"
                    />
                  )}
                </svg>
              </button>

              {/* Social icons (desktop) */}
              <div className="hidden items-center gap-1 sm:flex">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="lg:hidden border-t border-white/10 bg-dark-navy1">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-3 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded px-3 py-2 ${
                    activePath === item.href
                      ? "bg-[#00219A] text-[#00FFEE]"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="px-4 pb-4 sm:hidden">
              <SocialLinks />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
