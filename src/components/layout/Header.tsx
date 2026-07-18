"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialLinks } from "./SocialLinks";

type SubItem = { label: string; href: string };
type NavItem = { label: string; href: string; children?: SubItem[] };

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Markets",
    href: "/market",
    children: [
      { label: "Live Market", href: "/market" },
      { label: "Stocks", href: "/market/stocks" },
      { label: "Mutual Funds", href: "/market/mutual-funds" },
      { label: "IPO", href: "/market/ipo" },
      { label: "Commodities", href: "/market/commodities" },
      { label: "Cryptocurrency", href: "/market/crypto" },
    ],
  },
  {
    label: "News",
    href: "/news/india",
    children: [
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
    label: "Tools",
    href: "/tools",
    children: [
      { label: "SIP Calculator", href: "/tools/sip" },
      { label: "FD Calculator", href: "/tools/fd" },
      { label: "EMI Calculator", href: "/tools/emi" },
      { label: "Tax Calculator", href: "/tools/tax" },
      { label: "SWP Calculator", href: "/tools/swp" },
    ],
  },
  {
    label: "Company",
    href: "/about-us",
    children: [
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

function isActive(path: string, pathname: string) {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

export function Header() {
  const today = useTodayLabel();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  // Lock body scroll while drawer open + close on Escape
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="relative z-40 w-full bg-white font-sans shadow-sm">
      {/* Top bar */}
      <div className="mx-auto w-full max-w-7xl px-4 py-2.5 sm:py-1.5 xl:px-0">
        <div className="flex w-full items-center justify-between gap-3">
          <Link href="/" className="w-28 shrink-0 sm:w-40">
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

          <div className="flex min-w-0 items-center justify-end gap-2 py-0 sm:py-1">
            <div className="hidden min-w-0 items-center gap-2 rounded-md border border-gray-200 px-2.5 py-2 text-[10px] sm:flex sm:py-2.75 sm:text-content-small">
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
              <span className="text-career-dark whitespace-nowrap" title={today}>
                {today}
              </span>
            </div>

            {/* Social icons — desktop+tablet */}
            <div className="hidden items-center gap-1 md:flex">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="from-dark-navy2 to-primary-navy relative w-full overflow-visible border-b border-[#00FFEE] bg-gradient-to-r text-white">
        <div className="mx-auto w-full max-w-7xl px-4 xl:px-0">
          <div className="flex w-full items-center justify-between text-[10px] font-bold tracking-normal sm:font-semibold lg:text-sm">
            {/* Desktop nav with dropdowns */}
            <div className="hidden items-stretch lg:flex">
              {NAV.map((item) => {
                const active = isActive(item.href, pathname);
                const hasChildren = !!item.children;
                const isMenuOpen = openMenu === item.label;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(hasChildren ? item.label : null)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    {hasChildren ? (
                      <button
                        className={`flex h-full items-center justify-center gap-1 whitespace-nowrap border-b-2 px-3.5 py-3 transition-colors xl:px-2.5 xl:py-3 ${
                          active
                            ? "border-[#00FFEE] bg-[#00219A] text-[#00FFEE]"
                            : "border-transparent hover:bg-white/5"
                        } ${isMenuOpen ? "bg-white/5" : ""}`}
                        onClick={() => setOpenMenu(isMenuOpen ? null : item.label)}
                        aria-expanded={isMenuOpen}
                      >
                        {item.label}
                        <svg
                          className={`h-3 w-3 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                          viewBox="0 0 320 512"
                          fill="currentColor"
                          strokeWidth="0"
                        >
                          <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center justify-center whitespace-nowrap border-b-2 px-3.5 py-3 transition-colors xl:px-2.5 xl:py-3 ${
                          active
                            ? "border-[#00FFEE] bg-[#00219A] text-[#00FFEE]"
                            : "border-transparent hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Dropdown */}
                    {hasChildren && isMenuOpen && (
                      <div className="absolute top-full left-0 z-50 min-w-52 bg-white py-2 text-slate-800 shadow-xl ring-1 ring-black/5">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenMenu(null)}
                            className={`block px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                              isActive(child.href, pathname)
                                ? "bg-blue-50 font-semibold text-blue-700"
                                : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile/tablet hamburger */}
            <div className="flex w-full items-center justify-between lg:hidden">
              <span className="px-1 text-xs font-semibold tracking-wide text-white/80 uppercase">
                Menu
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                aria-label={open ? "Close navigation" : "Open navigation"}
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
            </div>

            {/* Social icons (desktop lg+) */}
            <div className="hidden items-center gap-1 lg:flex">
              <SocialLinks />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile / tablet slide-in drawer */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-[100dvh] w-[min(86vw,22rem)] flex-col bg-dark-navy1 text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="Site navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="w-28"
            aria-label="KuberaNow home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo2.svg"
              alt="KuberaNow"
              className="w-full"
              loading="lazy"
            />
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M368 368 144 144M368 144 144 368"
              />
            </svg>
          </button>
        </div>

        {/* Drawer body (scrollable) */}
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
          {NAV.map((item) => {
            const hasChildren = !!item.children;
            const isOpen = expanded === item.label;
            const active = isActive(item.href, pathname);

            if (!hasChildren) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block min-h-11 rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors ${
                    active
                      ? "bg-[#00219A] text-[#00FFEE]"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.label} className="border-b border-white/5 last:border-0">
                <button
                  className={`flex min-h-11 w-full items-center justify-between rounded-lg px-4 py-3 text-left text-[15px] font-semibold transition-colors ${
                    active ? "text-[#00FFEE]" : "text-white hover:bg-white/5"
                  }`}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                >
                  <span>{item.label}</span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-white/60 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 320 512"
                    fill="currentColor"
                  >
                    <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
                  </svg>
                </button>

                {/* Submenu */}
                {isOpen && (
                  <div className="mb-1 ml-2 border-l border-white/10 pl-2">
                    {/* Parent overview link */}
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block min-h-11 rounded-lg px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                        isActive(item.href, pathname)
                          ? "text-[#00FFEE]"
                          : "text-[#00FFEE]/70 hover:text-[#00FFEE]"
                      }`}
                    >
                      All {item.label} →
                    </Link>
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={`block min-h-11 rounded-lg px-4 py-2.5 text-[14px] transition-colors ${
                          isActive(child.href, pathname)
                            ? "bg-white/5 font-semibold text-[#00FFEE]"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Drawer footer — social */}
        <div className="border-t border-white/10 px-5 py-4">
          <p className="mb-3 text-[11px] font-semibold tracking-widest text-white/50 uppercase">
            Follow us
          </p>
          <SocialLinks />
        </div>
      </aside>
    </header>
  );
}
