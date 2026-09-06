'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import DarkAurora from '@/components/effects/DarkAurora'
import ElegantParticles from '@/components/effects/ElegantParticles'
import ComponentErrorBoundary from '@/components/effects/ErrorBoundary'

export default function PrivacyPolicyClient() {
  return (
    <div
      className="privacy-page-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <style jsx global>{`
        /* Exact dot-grid extracted directly from heyclicky.com */
        .privacy-page-bg {
          background-color: #f5f5f5;
          background-image: radial-gradient(#00000021 1px, #0000 1.3px);
          background-size: 34.238px 34px;
          color: #1a1a22;
          transition: background-color 0.25s ease;
        }

        /* Dark mode: Deep cosmic background with matching starry dot-grid */
        [data-theme='dark'] .privacy-page-bg {
          background-color: #0A0A1E !important;
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, #0000 1.3px) !important;
          background-size: 34.238px 34px !important;
          color: #e6e2f0 !important;
        }

        .privacy-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 56px 24px 80px;
          width: 100%;
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
        }

        .privacy-title {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(38px, 5.5vw, 64px);
          font-weight: 400;
          letter-spacing: -0.02em;
          text-align: center;
          margin: 0 0 36px 0;
          color: #111118;
        }
        [data-theme='dark'] .privacy-title {
          color: #faf8f5;
          text-shadow: 0 2px 28px rgba(255, 255, 255, 0.06);
        }

        .privacy-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: 15px;
          color: rgba(26, 26, 34, 0.6);
          text-decoration: none;
          margin-bottom: 28px;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .privacy-back-link:hover {
          color: var(--violet, #4d3fff);
          transform: translateX(-3px);
        }
        [data-theme='dark'] .privacy-back-link {
          color: rgba(230, 226, 245, 0.6);
        }
        [data-theme='dark'] .privacy-back-link:hover {
          color: #a59bff;
        }

        .privacy-content {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(17px, 1.22vw, 19.5px);
          line-height: 1.68;
          color: rgba(26, 26, 34, 0.88);
        }
        [data-theme='dark'] .privacy-content {
          color: rgba(235, 232, 246, 0.86);
        }

        .privacy-content p {
          margin: 0 0 18px 0;
        }

        .privacy-heading-1 {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(22px, 2vw, 27px);
          font-weight: 600;
          color: #111118;
          margin: 40px 0 14px 0;
          letter-spacing: -0.01em;
        }
        [data-theme='dark'] .privacy-heading-1 {
          color: #faf8f5;
        }

        .privacy-heading-2 {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(19px, 1.5vw, 22px);
          font-weight: 600;
          color: #111118;
          margin: 28px 0 10px 0;
        }
        [data-theme='dark'] .privacy-heading-2 {
          color: #f0ecf9;
        }

        .privacy-list-item {
          margin-bottom: 12px;
          padding-left: 4px;
        }

        .privacy-link {
          color: #4d3fff;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s ease;
        }
        .privacy-link:hover {
          opacity: 0.8;
        }
        [data-theme='dark'] .privacy-link {
          color: #a59bff;
        }

        .privacy-footer-links {
          margin-top: 56px;
          padding-top: 28px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          justifyContent: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 15px;
          color: rgba(26, 26, 34, 0.65);
        }
        [data-theme='dark'] .privacy-footer-links {
          border-top-color: rgba(255, 255, 255, 0.08);
          color: rgba(230, 226, 245, 0.65);
        }
      `}</style>

      {/* Landing page animated dark background effects (active in dark mode) */}
      <ComponentErrorBoundary>
        <DarkAurora />
        <ElegantParticles count={60} />
      </ComponentErrorBoundary>

      {/* Persistent Navigation */}
      <ComponentErrorBoundary>
        <Header />
      </ComponentErrorBoundary>

      <main style={{ paddingTop: '80px', flex: 1, position: 'relative', zIndex: 1 }}>
        <div className="privacy-container">
          <h1 className="privacy-title">privacy policy</h1>

          <Link href="/" className="privacy-back-link">
            &larr; back
          </Link>

          <div className="privacy-content">
            <p>
              At College Circle AI, we prioritize your privacy and the protection of your data. We are committed to safeguarding all data collected, both personal and non-personal, adhering to the highest standards of data protection.
            </p>
            <p>
              All data collected through College Circle AI, whether personal or non-personal, is protected with utmost diligence. Our privacy policy is designed to ensure your personal data remains under your control. We comply with applicable data protection laws and regulations.
            </p>
            <p>
              This privacy policy applies to the College Circle AI website and platform and governs the use of services provided by College Circle AI to its users.
            </p>

            <h2 className="privacy-heading-1">1. Notice</h2>
            <p>
              Whenever we collect information that could be used to personally identify you, we will explicitly ask for your provision and permission to use it. This policy ensures that you are fully informed and consenting to the collection of your personal data. Such requests for information by our system occur when explicit confirmation of your permission is needed to proceed. Examples include asking for your consent to use cookies when you visit our site, or requesting your account details when you sign up for our services.
            </p>

            <h2 className="privacy-heading-1">2. Your consent</h2>
            <p>
              You always have the option to grant or withhold permission for us to process your information.
            </p>
            <p>
              For data not crucial to the core functionality of our services, such as cookies for marketing purposes, you can choose not to give consent without impacting your access to College Circle AI.
            </p>
            <p>
              However, if you opt not to provide essential information required for our services (e.g., essential cookies, email address), we will not be able to grant you access to all features of College Circle AI that depend on this information. Whether information is essential or not will be clearly indicated at the time you are asked to provide it or consent to its use.
            </p>
            <p>
              By accepting this privacy policy and supplying us with your personal information, you are consenting to our processing of your information as outlined in this policy.
            </p>

            <h2 className="privacy-heading-1">3. Eligibility</h2>
            <p>
              College Circle AI is intended for users aged 18 years and above. We do not knowingly permit individuals under 18 to create accounts. If we become aware that a user is under 18, we will take appropriate steps to remove their account and associated data.
            </p>

            <h2 className="privacy-heading-1">4. Usage</h2>

            <h3 className="privacy-heading-2">4.1 Data we collect</h3>
            <p>
              At College Circle AI, we collect various types of personally identifiable information. This encompasses information that can directly identify you, such as your name, email address, and university or college name. In addition, we gather data based on your usage of our platform through our analytics provider.
            </p>
            <p>
              College Circle AI allows you to upload academic content such as course plans, syllabi, study materials, and documents. The platform also enables you to record lectures through the Live Classroom feature. All uploaded content and recordings are processed to provide the service to you, including AI-generated notes, transcriptions, study plans, and learning analytics.
            </p>

            <h3 className="privacy-heading-2">4.2 Lecture recordings</h3>
            <p>
              When you use the Live Classroom feature, audio is captured and processed to generate transcriptions, structured notes, and summaries. Lecture recordings may contain the voices or statements of other individuals present in the classroom. You are responsible for ensuring you have the necessary permission to record before using this feature. College Circle AI does not independently verify whether such permission exists.
            </p>

            <h3 className="privacy-heading-2">4.3 Third-party AI providers</h3>
            <p>
              College Circle AI relies on third-party AI providers to power its transcription, note generation, academic assistant, and study planning features. Content you provide (course materials, audio, questions, documents) is transmitted to these providers through our backend so they can process your request and return a response. We do not sell your data.
            </p>
            <p>
              We do not permit third-party providers to use your data for training their general-purpose models, to the extent that is within our control under our agreements with those providers. We select providers that maintain appropriate data handling and security practices.
            </p>

            <h3 className="privacy-heading-2">4.4 Data storage and security</h3>
            <p>
              Your data is stored securely on our servers and is protected using industry-standard encryption and security practices. We retain your data for the period necessary to fulfill the purposes outlined in this privacy policy unless a longer retention period is required or permitted by law.
            </p>
            <p>
              We do not disclose the specific infrastructure, hosting providers, or database systems we use to operate the platform. This information is treated as confidential to protect the security and integrity of our systems.
            </p>

            <h3 className="privacy-heading-2">4.5 Sharing of user data</h3>
            <p>
              We do not share user data with third parties unless it is necessary to provide the service, comply with the law, or protect our rights. When third parties are employed to process user data on our behalf, they do so under confidentiality agreements and are obligated to comply with our privacy policy and applicable data protection laws.
            </p>
            <p>
              We do not sell, rent, or trade your personal data to advertisers, data brokers, or any third party for their own marketing or commercial purposes.
            </p>

            <h3 className="privacy-heading-2">4.6 How we use your data</h3>
            <p>We use your personally identifiable information for the following purposes:</p>
            <div style={{ marginLeft: '12px', marginBottom: '16px' }}>
              <p className="privacy-list-item"><strong>Access to features:</strong> To provide you with full access to College Circle AI&apos;s features, including AI-generated notes, transcription, academic assistance, study plans, and learning analytics.</p>
              <p className="privacy-list-item"><strong>Payment processing:</strong> To process your payments for our services where applicable.</p>
              <p className="privacy-list-item"><strong>Information updates:</strong> To inform you about important information regarding College Circle AI, as well as any other information you opt into receiving.</p>
              <p className="privacy-list-item"><strong>Customer support and communication:</strong> To contact you about issues, respond to support requests, or for other opted-in reasons.</p>
              <p className="privacy-list-item"><strong>Usage data analysis:</strong> To analyse usage data to improve our platform and services.</p>
              <p className="privacy-list-item"><strong>Academic research:</strong> To use anonymised, aggregated data for academic research purposes (see Section 5).</p>
            </div>
            <p>
              Data regarding platform usage may be shared with service providers, such as analytics tools, to enhance our services and maintain operations. These providers act on our behalf and are not permitted to use your data for their own unrelated purposes.
            </p>
            <p>
              In response to a legal request by an Indian court, judge, or law enforcement authority, we may be required to provide your personally identifiable information. This could be done without your permission and without prior notice to you.
            </p>
            <p>
              Outside these specified categories, no external party will have access to your personal information, unless you explicitly give us permission. Should we wish to share your information with an external party outside of these categories, we will always seek your explicit consent first.
            </p>

            <h2 className="privacy-heading-1">5. Academic research</h2>
            <p>
              College Circle AI is associated with a research collaboration studying how AI-assisted learning affects student outcomes.
            </p>
            <p>
              Data used for research purposes is anonymised and aggregated before use. Anonymisation means removing identifiers and attributes that could reasonably be used to identify you — not merely removing your name alone. Your individual identity is never included in any research output, publication, or report.
            </p>
            <p>
              If you do not wish your anonymised usage data to be included in the research dataset, you may opt out at any time by contacting us at the email address provided at the end of this policy. Opting out will not affect your access to any platform features.
            </p>

            <h2 className="privacy-heading-1">6. Retention of information</h2>
            <p>
              We retain your information for as long as necessary to provide you with College Circle AI&apos;s services.
            </p>
            <p>
              All personally identifiable information will be deleted upon your request to cease using our services, such as when you delete your account or when you explicitly request its deletion. Following your request and its confirmation, your information will be deleted within 30 days.
            </p>
            <p>
              Anonymised, aggregated data that has already been incorporated into research outputs may be retained, as it cannot be used to identify you.
            </p>
            <p>
              We may retain certain information for longer periods if required to comply with legal obligations, including tax and financial record-keeping requirements under applicable law. In cases where the law mandates, or an Indian court orders, we may retain information for an extended period and/or disclose it to the relevant authorities.
            </p>

            <h2 className="privacy-heading-1">7. Subscriptions and refunds</h2>
            <p>
              College Circle AI offers both free and paid subscription plans. Free plans provide access to limited features. Paid plans unlock additional capabilities as described on the platform at the time of purchase.
            </p>
            <p>
              <strong>Refund policy:</strong> If you are not satisfied with your subscription, you may request a full refund within 24 hours of purchase by emailing <a href="mailto:support@collegecircleai.com" className="privacy-link">support@collegecircleai.com</a>. Refund requests received within this window will be processed and the amount returned to your original payment method within 5–7 business days, depending on your bank or payment provider. After the 24-hour window, subscriptions are non-refundable.
            </p>
            <p>
              <strong>Cancellation:</strong> You may cancel your subscription at any time. Upon cancellation, you retain access to paid features until the end of your current billing period. No further charges will be made.
            </p>
            <p>
              <strong>Billing disputes:</strong> For any billing issue, error, or dispute, email <a href="mailto:support@collegecircleai.com" className="privacy-link">support@collegecircleai.com</a>. We will acknowledge your request within 24 hours and aim to resolve it within 7 working days.
            </p>

            <h2 className="privacy-heading-1">8. AI-generated content</h2>
            <p>
              College Circle AI uses artificial intelligence to generate notes, answers, summaries, study plans, and other academic content.
            </p>
            <p>
              AI-generated content may contain errors, inaccuracies, or omissions. College Circle AI does not guarantee the accuracy, completeness, or reliability of any AI-generated output. You should independently verify important academic information using official university materials, textbooks, and faculty guidance.
            </p>
            <p>
              College Circle AI is not a substitute for attending classes, following your institution&apos;s curriculum, or seeking guidance from your teachers. We are not responsible for any academic consequence that may result from reliance on AI-generated content.
            </p>
            <p>
              You are solely responsible for complying with your university&apos;s or institution&apos;s policies regarding academic integrity, plagiarism, and the use of AI tools in coursework and examinations. College Circle AI does not encourage the submission of AI-generated content as your own original work where your institution prohibits such use.
            </p>

            <h2 className="privacy-heading-1">9. Your content</h2>
            <p>
              You retain ownership of the content you upload to College Circle AI, including course plans, study materials, lecture recordings, and notes you create on the platform.
            </p>
            <p>
              By uploading content, you grant College Circle AI a limited licence to host, store, process, and transform that content solely as necessary to provide and operate the platform&apos;s features. This licence exists only for as long as your content remains on the platform. When you delete your content or your account, this licence terminates, except for anonymised data already incorporated into research outputs.
            </p>
            <p>
              You are responsible for the content you upload and confirm that you have the right to share it. You confirm that your content does not infringe the intellectual property rights of any third party.
            </p>

            <h2 className="privacy-heading-1">10. Your rights</h2>
            <p>
              As the owner of your information and in accordance with applicable data protection laws, you are entitled to several rights regarding the handling of your data by College Circle AI:
            </p>
            <div style={{ marginLeft: '12px', marginBottom: '16px' }}>
              <p className="privacy-list-item"><strong>Right of access:</strong> You have the right to obtain a summary of all personally identifiable information related to you that we have processed.</p>
              <p className="privacy-list-item"><strong>Right to correction:</strong> If any personally identifiable information you have provided is incorrect or incomplete, you have the right to have it corrected or updated.</p>
              <p className="privacy-list-item"><strong>Right to erasure:</strong> You can request the erasure of your personal data. This can be done by deleting your account or by contacting us.</p>
              <p className="privacy-list-item"><strong>Right to withdraw consent:</strong> You may withdraw your consent to any processing that is based on consent. Withdrawal does not affect the lawfulness of processing carried out before withdrawal.</p>
              <p className="privacy-list-item"><strong>Right to opt out:</strong> You may opt out of marketing communications and research data use at any time.</p>
            </div>
            <p>
              To exercise any of these rights, please contact us using the email address provided at the end of this privacy policy.
            </p>

            <h2 className="privacy-heading-1">11. Data breach</h2>
            <p>
              If we become aware of a security incident that affects your personal data, we will take appropriate steps to investigate and contain the breach. We will notify affected users and relevant authorities as required under applicable law, providing a clear explanation of what happened and the steps we are taking to address it.
            </p>

            <h2 className="privacy-heading-1">12. Opting out</h2>
            <p>
              In addition to our core services, we may offer additional services to enhance your experience, such as newsletters, product updates, and feedback surveys. You have the option to opt out of these services at any time. To unsubscribe from our email communications, simply click the unsubscribe link located at the bottom of any of our emails.
            </p>

            <h2 className="privacy-heading-1">13. Security of your information</h2>
            <p>
              At College Circle AI, we employ multiple measures to protect your data to the fullest extent possible. These measures include:
            </p>
            <div style={{ marginLeft: '12px', marginBottom: '16px' }}>
              <p className="privacy-list-item">&bull; Implementing TLS (Transport Layer Security) to ensure secure connections between our servers and your device.</p>
              <p className="privacy-list-item">&bull; Using encrypted storage for data at rest.</p>
              <p className="privacy-list-item">&bull; Enforcing authentication and access controls across our systems.</p>
              <p className="privacy-list-item">&bull; Conducting regular backups to prevent data loss.</p>
            </div>

            <h2 className="privacy-heading-1">14. Changes to this policy</h2>
            <p>
              College Circle AI reserves the right to amend this privacy policy as needed. Should any changes occur, we will notify you at least two weeks in advance of the changes taking effect. If you do not agree with the modifications to the policy, you have the opportunity to withdraw your consent during this notification period.
            </p>

            <h2 className="privacy-heading-1">15. Contact</h2>
            <p>
              Should you have any inquiries or comments regarding our privacy policy, data requests, refund requests, or if you wish to discuss its enforcement or any other related matters, please feel free to reach out at{' '}
              <a href="mailto:support@collegecircleai.com" className="privacy-link">
                support@collegecircleai.com
              </a>
            </p>

            <div className="privacy-footer-links">
              <Link href="/" className="privacy-back-link" style={{ marginBottom: 0 }}>
                &larr; back to College Circle AI
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ComponentErrorBoundary>
        <Footer />
      </ComponentErrorBoundary>
    </div>
  )
}
