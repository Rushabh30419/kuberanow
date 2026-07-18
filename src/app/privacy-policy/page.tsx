import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — KuberaNow",
  description: "How KuberaNow collects, uses and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 18, 2026"
      sections={[
        {
          heading: "Introduction",
          body: (
            <p>
              K Globes Digital Media Private Limited (&quot;KuberaNow&quot;,
              &quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
              explains what information we collect, how we use it, and the choices
              you have, in accordance with applicable Indian data protection laws
              including the Digital Personal Data Protection Act, 2023.
            </p>
          ),
        },
        {
          heading: "Information we collect",
          body: (
            <>
              <p>We collect information in the following ways:</p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong>Information you provide:</strong> name, email address
                  and message content when you contact us or subscribe to our
                  newsletter.
                </li>
                <li>
                  <strong>Usage data:</strong> pages visited, device type,
                  browser, and approximate location, collected via cookies and
                  analytics.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "How we use your information",
          body: (
            <ul className="ml-5 list-disc space-y-1">
              <li>To operate, maintain and improve our website and services.</li>
              <li>To send newsletters and updates you have opted into.</li>
              <li>To respond to your queries and provide support.</li>
              <li>To analyze traffic and measure content performance.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          ),
        },
        {
          heading: "Cookies",
          body: (
            <p>
              We use cookies and similar technologies to remember your
              preferences, understand how you use our site, and personalize
              content. You can control cookies through your browser settings.
            </p>
          ),
        },
        {
          heading: "Data sharing",
          body: (
            <p>
              We do not sell your personal data. We may share data with trusted
              service providers (such as analytics and email delivery partners)
              who process it on our behalf under contractual obligations, or when
              required by law.
            </p>
          ),
        },
        {
          heading: "Data retention",
          body: (
            <p>
              We retain personal data only for as long as necessary to fulfill the
              purposes outlined here or to meet legal requirements.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              You may request access to, correction of, or deletion of your
              personal data by contacting{" "}
              <a
                href="mailto:privacy@kuberanow.com"
                className="text-blue-700 underline"
              >
                privacy@kuberanow.com
              </a>
              .
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              For any privacy questions, write to us at the address above or at
              GIFT City, Gandhinagar, Gujarat 382355.
            </p>
          ),
        },
      ]}
    />
  );
}
