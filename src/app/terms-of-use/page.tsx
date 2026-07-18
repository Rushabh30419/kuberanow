import type { Metadata } from "next";
import {
  LegalCard,
  LegalSectionHeading,
  LegalP,
  LegalList,
} from "@/components/company/LegalCard";

export const metadata: Metadata = {
  title: "Terms of Use | KuberaNow",
  description: "KuberaNow Terms of Use.",
};

export default function TermsOfUsePage() {
  return (
    <LegalCard title="Terms of Use" titleColor="text-career-dark">
      <div className="flex flex-col">
        <LegalSectionHeading number="1.1" label="Acceptance of Terms" />
        <LegalP>
          If you do not agree with these Terms, you must immediately cease all use
          of the Platform. These Terms constitute a legally binding agreement
          between you (&quot;User&quot;) and KuberaNow (&quot;the Company&quot;).
          These Terms are to be read in conjunction with our Privacy Policy and
          Disclaimer, which are incorporated herein by reference.
        </LegalP>
        <LegalP>
          By accessing, browsing, viewing, subscribing to, or otherwise using the
          website{" "}
          <a
            href="http://www.kuberanow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.kuberanow.com
          </a>{" "}
          or any affiliated digital platform operated by KuberaNow (collectively,
          &quot;the Platform&quot;), you acknowledge that you have read,
          understood, and agree to be legally bound by these Terms of Use
          (&quot;Terms&quot;) in their entirety.
        </LegalP>

        <LegalSectionHeading number="1.2" label="Eligibility" />
        <LegalP>
          Use of the Platform is available only to individuals who are at least 18
          years of age and are legally capable of entering into binding contracts
          under the Indian Contract Act, 1872. By using the Platform, you represent
          and warrant that you meet these eligibility requirements.
        </LegalP>

        <LegalSectionHeading number="1.3" label="Intellectual Property & Content Ownership" />
        <LegalP>
          All content published on or made available through the Platform —
          including but not limited to news articles, video reports, audio clips,
          graphics, photographs, logos, trademarks, data visualisations, and
          editorial commentary — is the exclusive intellectual property of
          KuberaNow or its licensed content providers and is protected under:
        </LegalP>
        <LegalList
          items={[
            "The Trade Marks Act, 1999 (India)",
            "The Information Technology Act, 2000 (India)",
            "All other applicable intellectual property laws",
          ]}
        />
        <LegalP>
          Users are granted a limited, non-exclusive, non-transferable, revocable
          licence to access and view content on the Platform for personal,
          non-commercial use only. Any reproduction, redistribution,
          republication, modification, transmission, creation of derivative works,
          or commercial exploitation of any content — in whole or in part —
          without the prior written consent of KuberaNow is strictly prohibited.
        </LegalP>

        <LegalSectionHeading number="1.4" label="User Conduct" />
        <LegalP>
          As a condition of using the Platform, you agree to comply with all
          applicable laws and regulations and agree NOT to:
        </LegalP>
        <LegalList
          items={[
            "Post, upload, or transmit any content that is defamatory, obscene, offensive, unlawful, or infringes the rights of any third party.",
            "Impersonate KuberaNow, its employees, journalists, or any other person or entity.",
            "Engage in any activity that disrupts, damages, or impairs the performance, availability, or integrity of the Platform.",
            "Use any automated tool, bot, spider, scraper, or crawler to extract data from the Platform without express written authorisation.",
            "Attempt to gain unauthorised access to any part of the Platform, including backend systems, user data, or administrative interfaces.",
          ]}
        />

        <LegalSectionHeading number="1.5" label="Prohibited Uses" />
        <LegalP>
          Use the Platform to spread misinformation, disinformation, or knowingly
          false or misleading content.
        </LegalP>
        <LegalP>The following uses of the Platform are expressly prohibited:</LegalP>
        <LegalList
          items={[
            "Commercial republication of KuberaNow content without a formal syndication agreement.",
            "Use of KuberaNow branding, logos, or trademarks in any manner not expressly authorised.",
            "Distribution of malware, viruses, or harmful code through or in connection with the Platform.",
            "Any use of Platform content for the purpose of market manipulation, financial fraud, or any other illegal activity.",
          ]}
        />

        <LegalSectionHeading number="1.6" label="Third-Party Links" />
        <LegalP>
          The Platform may contain hyperlinks to third-party websites,
          advertisements, and external resources. These links are provided for
          convenience only. KuberaNow does not endorse, control, or accept
          responsibility for the content, privacy practices, or policies of any
          linked third-party website. Users access such links at their own risk.
        </LegalP>

        <LegalSectionHeading number="1.7" label="Termination of Access" />
        <LegalP>
          KuberaNow reserves the absolute right to suspend, restrict, or
          permanently terminate your access to the Platform at any time, with or
          without notice, if the Company reasonably determines that you have
          violated these Terms, applicable law, or any policy of the digital TV.
          Upon termination, all licences granted to you under these Terms shall
          immediately cease.
        </LegalP>

        <LegalSectionHeading number="1.8" label="Governing Law & Jurisdiction" />
        <LegalP>
          These Terms of Use shall be governed by and construed in accordance with
          the laws of the Republic of India. Any dispute, claim, or controversy
          arising out of or relating to these Terms shall be subject to the
          exclusive jurisdiction of the courts located in Ahmedabad, Gujarat,
          India.
        </LegalP>

        <LegalSectionHeading number="1.9" label="Dispute Resolution" />
        <LegalP>
          In the event of any dispute arising under or in connection with these
          Terms, the parties shall first attempt to resolve the dispute through
          good-faith negotiations within thirty (30) days of written notice of the
          dispute. If the dispute is not resolved through negotiation, either
          party may seek resolution through competent courts in Ahmedabad,
          Gujarat, in accordance with the Code of Civil Procedure, 1908.
        </LegalP>

        <LegalSectionHeading number="1.10" label="Amendments" />
        <LegalP>
          KuberaNow reserves the right to modify these Terms of Use at any time.
          Revised Terms will be posted on the Platform with an updated effective
          date. It is your responsibility to review these Terms periodically. Your
          continued use of the Platform following the posting of revised Terms
          constitutes your acceptance thereof.
        </LegalP>
      </div>
    </LegalCard>
  );
}
