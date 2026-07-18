import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use — KuberaNow",
  description: "Terms governing your use of the KuberaNow website.",
};

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="July 18, 2026"
      sections={[
        {
          heading: "Acceptance of terms",
          body: (
            <p>
              By accessing or using KuberaNow (the &quot;Website&quot;), you agree
              to be bound by these Terms of Use. If you do not agree, please do not
              use the Website.
            </p>
          ),
        },
        {
          heading: "Use of content",
          body: (
            <>
              <p>
                All content on this Website — including text, graphics, logos,
                videos and software — is the property of K Globes Digital Media
                Private Limited or its licensors and is protected by Indian and
                international copyright laws.
              </p>
              <p>
                You may view and print content for personal, non-commercial use.
                Any other use, including reproduction, redistribution, or
                modification, requires our prior written permission.
              </p>
            </>
          ),
        },
        {
          heading: "User conduct",
          body: (
            <p>
              You agree not to misuse the Website, including by attempting to gain
              unauthorized access, introducing viruses, scraping content at scale,
              or using the site for any unlawful purpose.
            </p>
          ),
        },
        {
          heading: "No warranties",
          body: (
            <p>
              The Website is provided &quot;as is&quot; without warranties of any
              kind, express or implied. We do not warrant that the site will be
              error-free, uninterrupted, or free of harmful components.
            </p>
          ),
        },
        {
          heading: "Limitation of liability",
          body: (
            <p>
              To the maximum extent permitted by law, KuberaNow shall not be liable
              for any direct, indirect, incidental, consequential or special
              damages arising out of your use of, or inability to use, the Website.
            </p>
          ),
        },
        {
          heading: "Third-party links & advertising",
          body: (
            <p>
              The Website may contain links to third-party sites and
              advertisements. We are not responsible for the content or practices
              of those third parties.
            </p>
          ),
        },
        {
          heading: "Changes to these terms",
          body: (
            <p>
              We may update these Terms from time to time. Continued use of the
              Website after changes constitutes acceptance of the revised Terms.
            </p>
          ),
        },
        {
          heading: "Governing law",
          body: (
            <p>
              These Terms are governed by the laws of India. Any disputes shall be
              subject to the exclusive jurisdiction of the courts at Gandhinagar,
              Gujarat.
            </p>
          ),
        },
      ]}
    />
  );
}
