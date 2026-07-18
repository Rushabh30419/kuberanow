import type { Metadata } from "next";
import {
  LegalCard,
  LegalSectionHeading,
  LegalH3,
  LegalH4,
  LegalP,
  LegalList,
  LegalManagedBy,
} from "@/components/company/LegalCard";

export const metadata: Metadata = {
  title: "Privacy Policy | KuberaNow",
  description: "KuberaNow Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalCard title="Privacy Policy">
      <div className="flex flex-col gap-3 lg:gap-6">
        {/* 1.1 Introduction */}
        <div>
          <LegalSectionHeading number="1.1" label="Introduction" />
          <LegalP>
            KuberaNow (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
            committed to safeguarding the privacy and personal data of all users
            who access our website at www.kuberanow.com and associated digital
            platforms. This Privacy Policy explains what personal data we collect,
            how we use it, with whom we share it, and the rights available to you
            as a data principal under applicable Indian law.
          </LegalP>
          <LegalP>
            This Policy has been drafted in compliance with the Information
            Technology Act, 2000, the Information Technology (Reasonable Security
            Practices and Procedures and Sensitive Personal Data or Information)
            Rules, 2011, the Information Technology (Intermediary Guidelines and
            Digital Media Ethics Code) Rules, 2021, and the Digital Personal Data
            Protection Act, 2023 (DPDPA).
          </LegalP>
        </div>

        {/* 1.2 Data We Collect */}
        <div>
          <LegalSectionHeading number="1.2" label="Data We Collect" />

          <LegalH3 number="1.2.1" label="Information You Provide Directly" />
          <LegalList
            items={[
              "Full name and display name",
              "Email address",
              "Mobile phone number (where voluntarily provided)",
              "City and state of residence",
              "Professional designation and industry sector",
              "Comments, feedback, or messages submitted through contact forms or interactive features",
            ]}
          />

          <LegalH3 number="1.2.2" label="Automatically Collected Data" />
          <LegalList
            items={[
              "IP address and approximate geographic location",
              "Browser type, version, and language preference",
              "Device type, operating system, and screen resolution",
              "Pages visited, time spent on each page, and navigation paths",
              "Referring URLs and search keywords",
              "Cookies, pixel tags, and similar tracking technologies",
            ]}
          />

          <LegalH3 number="1.2.3" label="Analytics & Behavioural Data" />
          <LegalP>
            We use third-party analytics tools such as Google Analytics to
            understand how users interact with our Platform, measure audience
            engagement, and improve content relevance and user experience.
          </LegalP>
        </div>

        {/* 1.3 Purpose */}
        <div>
          <LegalSectionHeading number="1.3" label="Purpose of Data Collection" />
          <LegalList
            items={[
              "To deliver, maintain, and improve our news content and digital services",
              "To personalise content recommendations and user experience",
              "To send newsletters, breaking news alerts, and editorial updates (only with your consent)",
              "To facilitate registration and management of user accounts",
              "To respond to queries, complaints, and support requests",
              "To analyse audience trends and improve editorial and business strategy",
              "To comply with legal obligations, court orders, and regulatory requirements",
              "To detect, prevent, and investigate fraud, security breaches, and other prohibited conduct",
            ]}
          />
        </div>

        {/* 1.4 Cookies */}
        <div>
          <LegalSectionHeading number="1.4" label="Cookies Policy" />

          <LegalH4>Essential</LegalH4>
          <LegalP>
            Core platform functionality — required for the site to operate.
          </LegalP>
          <LegalManagedBy>Managed by: KuberaNow</LegalManagedBy>

          <LegalH4>Analytics</LegalH4>
          <LegalP>
            Audience measurement &amp; reporting to improve our services.
          </LegalP>
          <LegalManagedBy>Managed by: Google Analytics / third-party</LegalManagedBy>

          <LegalH4>Preference</LegalH4>
          <LegalP>
            Stores language &amp; content settings for a personalised experience.
          </LegalP>
          <LegalManagedBy>Managed by: KuberaNow</LegalManagedBy>

          <LegalH4>Marketing</LegalH4>
          <LegalP>
            Enables targeted advertising &amp; retargeting across ad networks.
          </LegalP>
          <LegalManagedBy>Managed by: Ad network partners</LegalManagedBy>

          <LegalP>
            You may manage or disable non-essential cookies through your browser
            settings or our cookie consent manager. Disabling essential cookies
            may impair Platform functionality.
          </LegalP>
        </div>

        {/* 1.5 Data Sharing */}
        <div>
          <LegalSectionHeading
            number="1.5"
            label="Data Sharing with Third Parties"
          />
          <LegalP>
            We do not sell, rent, or trade your personal data. We may share data
            in the following limited circumstances:
          </LegalP>
          <LegalList
            items={[
              <>
                <strong>Service Providers:</strong> Analytics platforms, cloud
                hosting providers, email delivery services, and payment processors
                engaged under contractual data processing agreements.
              </>,
              <>
                <strong>Legal Compliance:</strong> Government authorities, law
                enforcement agencies, or courts when required by law, judicial
                order, or regulatory mandate.
              </>,
              <>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or restructuring of KuberaNow, user data may be
                transferred as part of the business assets, subject to equivalent
                privacy protections.
              </>,
              <>
                <strong>Advertising Partners:</strong> Aggregated,
                non-personally-identifiable audience data may be shared with
                advertising partners for campaign measurement purposes.
              </>,
            ]}
          />
        </div>

        {/* 1.6 Your Rights */}
        <div>
          <LegalSectionHeading
            number="1.6"
            label="Your Rights under the DPDPA 2023"
          />
          <LegalP>
            Under the Digital Personal Data Protection Act, 2023, you as a Data
            Principal have the following rights that KuberaNow is committed to
            honouring.
          </LegalP>
          <LegalList
            items={[
              <>
                <strong>Right to Access:</strong> Request information about the
                personal data we hold about you and the purposes for which it is
                processed.
              </>,
              <>
                <strong>Right to Correction:</strong> Request correction of
                inaccurate or incomplete personal data.
              </>,
              <>
                <strong>Right to Erasure:</strong> Request deletion of your
                personal data, subject to applicable legal obligations.
              </>,
              <>
                <strong>Right to Withdraw Consent:</strong> Withdraw previously
                given consent at any time without affecting the lawfulness of
                prior processing.
              </>,
              <>
                <strong>Right to Grievance Redressal:</strong> Lodge a complaint
                with our Grievance Officer (see Section 1.8) or escalate to the
                Data Protection Board of India, once established.
              </>,
              <>
                <strong>Right to Nominate:</strong> Nominate another individual to
                exercise your rights in the event of your death or incapacity.
              </>,
            ]}
          />
        </div>

        {/* 1.7 Data Retention */}
        <div>
          <LegalSectionHeading number="1.7" label="Data Retention" />
          <LegalP>
            We retain your personal data only for as long as necessary to fulfil
            the purposes outlined in this Policy, or as required by applicable
            law. Specifically:
          </LegalP>
          <LegalList
            items={[
              "User account data is retained for the duration of the account and for 24 months thereafter.",
              "Website analytics data is retained for up to 26 months in aggregated form.",
              "Communication records (emails, contact form submissions) are retained for 36 months.",
              "Data required for legal compliance or regulatory purposes is retained for the period mandated by applicable law.",
            ]}
          />
        </div>

        {/* 1.8 Grievance Officer */}
        <div>
          <LegalSectionHeading number="1.8" label="Grievance Officer" />
          <LegalP>
            In accordance with Rule 3(2) of the Information Technology
            (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021,
            and the DPDPA 2023, KuberaNow has appointed a Grievance Officer to
            address complaints related to personal data and content.
          </LegalP>

          <div className="border-career-stroke bg-career-tint mt-4 rounded-md border p-4">
            <div className="space-y-3">
              <div>
                <LegalH4>Name</LegalH4>
                <LegalP>Mitesh Bhavsar</LegalP>
              </div>
              <div>
                <LegalH4>Designation</LegalH4>
                <LegalP>Grievance Officer, KuberaNow</LegalP>
              </div>
              <div>
                <LegalH4>Email</LegalH4>
                <LegalP>
                  <a href="mailto:info@kuberanow.com" className="text-primary hover:underline">
                    info@kuberanow.com
                  </a>
                </LegalP>
              </div>
              <div>
                <LegalH4>Address</LegalH4>
                <LegalP>
                  303, 304, 305 - 3rd Floor, World Centre, Nr. Torrent Power,
                  Ashram Road, Navrangpura, Ahmedabad, Gujarat 380009
                </LegalP>
              </div>
              <div>
                <LegalH4>Response Time</LegalH4>
                <LegalP>
                  Within 48 hours of receipt; resolution within 15 days
                </LegalP>
              </div>
            </div>
          </div>

          <LegalP>
            Complaints may also be escalated to the Data Protection Board of India,
            as provided under the DPDPA 2023.
          </LegalP>
        </div>
      </div>
    </LegalCard>
  );
}
