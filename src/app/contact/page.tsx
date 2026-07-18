import type { Metadata } from "next";
import { SectionHeading, GradientIcon } from "@/components/company/SectionHeading";
import { PageShell } from "@/components/company/PageShell";
import { SocialLinks } from "@/components/layout/SocialLinks";

export const metadata: Metadata = {
  title: "Contact Us | KuberaNow",
  description:
    "Get in touch with KuberaNow for news tips, press inquiries, technical support, advertising partnerships, and grievance matters.",
};

function EmailRow({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="hover:text-primary text-career-dark flex items-center gap-2 break-all text-sm leading-5"
    >
      <svg className="text-career-muted size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
      </svg>
      {email}
    </a>
  );
}

function WhatsAppRow({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary text-career-dark flex items-center gap-2 text-sm leading-5"
    >
      <svg className="text-career-muted size-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 01-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
      </svg>
      {label}
    </a>
  );
}

function ContactNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-career-muted text-xs italic leading-4 lg:text-sm">
      {children}
    </p>
  );
}

export default function ContactPage() {
  return (
    <PageShell>
      <div className="flex w-full flex-col gap-5 md:flex-row">
        {/* Main column */}
        <div className="min-w-0 flex-1">
          <section className="flex w-full flex-col gap-4 lg:gap-5">
            {/* Intro card */}
            <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
              <div className="border-career-stroke flex flex-col gap-2 border-b-2 pb-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex h-8.25 shrink-0 items-center">
                  <span className="bg-primary shadow-[2px_0px_0px_0px_var(--color-career-accent)] absolute left-0 h-5.5 w-1 rounded-xs" />
                  <h1 className="text-career-heading pl-3 text-lg leading-5.5 font-bold lg:text-2xl lg:leading-7">
                    Get in Touch with Us
                  </h1>
                </div>
                <SocialLinks iconSize={26} />
              </div>
              <p className="text-career-dark mt-4 text-sm leading-relaxed lg:text-base">
                We value every message from our viewers, readers, and business
                community members. Whether you have a news tip, a business inquiry,
                a complaint, or simply wish to connect with us, the KuberaNow team
                is here to assist you.
              </p>
              <div className="border-career-stroke bg-career-chip-bg mt-4 rounded border-[1.25px] p-3 lg:p-4">
                <p className="text-primary text-sm leading-[18px] lg:font-semibold">
                  We endeavour to respond to all inquiries within 48 business hours
                  (Monday to Friday, 10:00 AM to 6:00 PM IST). Urgent editorial and
                  grievance matters are prioritised.
                </p>
              </div>
            </article>

            {/* News & Story Suggestions */}
            <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
              <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <GradientIcon>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </GradientIcon>
                    <h2 className="text-career-dark min-w-0 flex-1 text-base leading-5 font-bold lg:text-xl lg:leading-6">
                      News &amp; Story Suggestions
                    </h2>
                  </div>
                  <p className="text-career-dark text-sm leading-relaxed lg:text-base">
                    Have a story that the Gujarati business community needs to know?
                    All tips are reviewed by our editors and handled with
                    confidentiality.
                  </p>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="border-career-stroke bg-career-tint flex flex-col gap-2 rounded-md border p-3">
                    <EmailRow email="editor@kuberanow.com" />
                    <div className="border-career-stroke border-t pt-2">
                      <WhatsAppRow href="https://wa.me/919328888771" label="+91 93288 88771" />
                    </div>
                  </div>
                  <ContactNote>
                    Please note: Submitting a news tip does not guarantee
                    publication. KuberaNow independently verifies all information
                    before publishing.
                  </ContactNote>
                </div>
              </div>
            </article>

            {/* Press + Technical Support (2-col) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4">
              {/* Press & Media */}
              <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
                <div className="flex items-center gap-3">
                  <GradientIcon>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7l9-4 9 4v14M9 21v-6h6v6M9 11h.01M15 11h.01" />
                    </svg>
                  </GradientIcon>
                  <h2 className="text-career-dark text-base leading-5 font-bold lg:text-xl lg:leading-6">
                    Press &amp; Media Inquiries
                  </h2>
                </div>
                <p className="text-career-dark mt-3 text-sm leading-relaxed">
                  For interview requests, official statements, media Promotion, and
                  press-related matters:
                </p>
                <div className="border-career-stroke bg-career-tint mt-3 flex flex-col gap-2 rounded-md border p-3">
                  <EmailRow email="connect@kuberanow.com" />
                  <div className="border-career-stroke border-t pt-2">
                    <WhatsAppRow href="https://wa.me/918160567228" label="+91 8160567228" />
                  </div>
                </div>
                <ContactNote>
                  Please note: Response Within 24 hours for critical issues; 48
                  hours for general queries
                </ContactNote>
              </article>

              {/* Technical Support */}
              <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
                <div className="flex items-center gap-3">
                  <GradientIcon>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3M13 6l-2 12" />
                    </svg>
                  </GradientIcon>
                  <h2 className="text-career-dark text-base leading-5 font-bold lg:text-xl lg:leading-6">
                    Technical Support
                  </h2>
                </div>
                <p className="text-career-dark mt-3 text-sm leading-relaxed">
                  Experiencing difficulties with our website, app, live stream, or
                  digital subscription? Our technical support team is available to
                  assist:
                </p>
                <div className="border-career-stroke bg-career-tint mt-3 flex flex-col gap-2 rounded-md border p-3">
                  <EmailRow email="it@kuberanow.com" />
                </div>
                <ContactNote>
                  Please note: Response Within 24 hours for critical issues; 48
                  hours for general queries
                </ContactNote>
              </article>
            </div>

            {/* Grievance Officer */}
            <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
              <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-4 lg:justify-between lg:self-stretch">
                  <div className="flex items-center gap-3">
                    <GradientIcon>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                      </svg>
                    </GradientIcon>
                    <h2 className="text-career-dark text-base leading-5 font-bold lg:text-xl lg:leading-6">
                      Grievance Officer
                    </h2>
                  </div>
                  <p className="text-career-dark text-sm leading-relaxed">
                    In accordance with the Information Technology (Intermediary
                    Guidelines and Digital Media Ethics Code) Rules, 2021, and the
                    Digital Personal Data Protection Act, 2023, KuberaNow has
                    designated a Grievance Officer for complaints related to our
                    content, editorial conduct, or personal data handling.
                  </p>
                  <p className="text-career-dark text-sm leading-relaxed">
                    Complaints must be submitted in writing (via email or post) and
                    should include the complainant's name, contact details, a clear
                    description of the grievance, and any supporting documentation.
                  </p>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div className="border-career-stroke bg-career-tint rounded-md border p-3 lg:p-4">
                    <div className="flex items-start gap-2 py-2.5">
                      <svg className="text-career-muted mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path strokeLinecap="round" d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                      </svg>
                      <span className="text-career-dark text-xs font-semibold lg:text-sm">
                        Mitesh Bhavsar
                      </span>
                    </div>
                    <div className="flex items-start gap-2 border-career-stroke/50 border-t py-2.5">
                      <svg className="text-career-muted mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="7" width="18" height="13" rx="2" />
                        <path strokeLinecap="round" d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                      </svg>
                      <span className="text-career-dark text-xs font-semibold lg:text-sm">
                        Grievance Officer, KuberaNow
                      </span>
                    </div>
                    <div className="flex items-start gap-2 border-career-stroke/50 border-t py-2.5">
                      <svg className="text-career-muted mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
                      </svg>
                      <a href="mailto:info@kuberanow.com" className="hover:text-primary text-career-dark text-xs font-semibold break-all lg:text-sm">
                        info@kuberanow.com
                      </a>
                    </div>
                    <div className="flex items-start gap-2 border-career-stroke/50 border-t py-2.5">
                      <svg className="text-career-muted mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      <span className="text-career-dark text-xs font-semibold lg:text-sm">
                        3<sup>rd</sup> Floor, World Centre, Beside Dinesh Hall, Nr.
                        Torrent Power, Ashram Road, Navrangpura, Ahmedabad, Gujarat
                        – 380009
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-career-stroke rounded-md border px-4 py-2">
                      <p className="text-career-muted text-xs">Acknowledgement</p>
                      <p className="text-primary text-xl leading-6 font-bold lg:text-2xl">
                        48 Hrs
                      </p>
                      <p className="text-career-muted text-xs">from receipt</p>
                    </div>
                    <div className="border-career-stroke rounded-md border px-4 py-2">
                      <p className="text-career-muted text-xs">Resolution</p>
                      <p className="text-primary text-xl leading-6 font-bold lg:text-2xl">
                        15 Days
                      </p>
                      <p className="text-career-muted text-xs">from receipt</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="order-1 hidden w-72 shrink-0 flex-col items-center gap-6 md:flex lg:order-2">
          {/* Advertising & Partnerships gradient card */}
          <div className="border-divider from-dark-navy2 to-primary-navy flex min-w-72 flex-col gap-2 rounded-lg border bg-gradient-to-r px-4 py-6">
            <span className="bg-light-navy4 flex h-6 w-48 items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
              </svg>
              Advertising &amp; Partnerships
            </span>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              For advertising inquiries, branded content partnerships, sponsorship
              opportunities, and media kit requests, please contact our Business
              Development team:
            </p>
            <div className="bg-indigo-light border-indigo-dark mt-3 flex flex-col gap-2.5 rounded-md border px-4 py-2">
              <div className="border-indigo-dark flex items-center justify-between border-b pb-2">
                <span className="text-xs font-semibold text-white">Email</span>
                <span className="text-sm font-semibold text-white">info@kuberanow.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Phone</span>
                <span className="text-sm font-semibold text-white">+91 99042 77760</span>
              </div>
            </div>
          </div>

          {/* Our Office */}
          <div className="border-divider flex min-w-full flex-col rounded-[5px] border bg-white">
            <div className="bg-dark-blue rounded-t-[5px] px-4 py-3">
              <h3 className="text-surface text-sm leading-4.5 font-semibold">Our Office</h3>
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-800">K globes Digital Media Pvt. Ltd.</p>
              <address className="text-text-disclaimer mt-1 text-sm not-italic leading-relaxed">
                3<sup>rd</sup> Floor, World Centre, Beside Dinesh Hall, Nr. Torrent
                Power, Ashram Road, Navrangpura, Ahmedabad, Gujarat – 380009
              </address>
            </div>
          </div>

          {/* Contact Us */}
          <div className="border-divider flex min-w-full flex-col rounded-[5px] border bg-white">
            <div className="bg-dark-blue rounded-t-[5px] px-4 py-3">
              <h3 className="text-surface text-sm leading-4.5 font-semibold">Contact Us</h3>
            </div>
            <div className="flex min-w-full flex-col p-4 text-sm leading-4.5">
              <div className="border-divider flex gap-4 border-b py-2">
                <span className="font-semibold text-slate-700">Email</span>
                <span className="text-text-disclaimer font-semibold">info@kuberanow.com</span>
              </div>
              <div className="border-divider flex gap-4 border-b py-2">
                <span className="font-semibold text-slate-700">Phone</span>
                <span className="text-text-disclaimer font-semibold">+91 99042 77760</span>
              </div>
              <div className="flex gap-4 py-2">
                <span className="font-semibold text-slate-700">Office Hours</span>
                <span className="text-text-disclaimer font-semibold">Monday to Friday, 10:00 AM – 6:00 PM IST</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
