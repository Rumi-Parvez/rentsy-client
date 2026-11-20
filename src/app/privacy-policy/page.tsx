import type { Metadata } from "next";
import { LegalLayout, LegalSection, PublicPage } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "Privacy Policy — rEntsy",
  description:
    "How rEntsy collects, uses, stores and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PublicPage
      eyebrow="Legal"
      title="Privacy"
      highlight="Policy"
      description="This policy explains what information rEntsy collects, why we collect it and the choices you have."
    >
      <LegalLayout updated="21 November 2026">
        <LegalSection title="1. Information we collect">
          <p>
            When you create an account, we collect your name, email address,
            profile image, phone number and address. If you list equipment, we
            also collect listing details, rental terms and owner contact
            information.
          </p>
          <p>
            When you book equipment, we collect rental dates, quantity, delivery
            address, contact number, notes and booking totals. Payment
            transactions are processed by our payment provider; we store the
            payment status and transaction reference, not full card details.
          </p>
        </LegalSection>

        <LegalSection title="2. How we use your information">
          <p>We use your information to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Create and secure your account.</li>
            <li>Process bookings, payments and rental coordination.</li>
            <li>Show owners the details needed to fulfil a rental.</li>
            <li>Verify roles and protect private dashboard routes.</li>
            <li>Respond to support requests and resolve disputes.</li>
            <li>Improve marketplace safety, listings and features.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Legal bases">
          <p>
            We process personal information to perform our contract with you,
            to comply with legal obligations, to protect the platform and its
            users, and where we have a legitimate interest in operating and
            improving the marketplace.
          </p>
        </LegalSection>

        <LegalSection title="4. Sharing information">
          <p>
            Booking details are shared between the customer and the equipment
            owner as needed to complete the rental. Admins can access account
            and booking records for moderation and support. We do not sell
            personal information.
          </p>
          <p>
            Service providers such as our database host, authentication provider
            and payment processor receive only the information needed to provide
            their service.
          </p>
        </LegalSection>

        <LegalSection title="5. Cookies and sessions">
          <p>
            We use essential cookies to keep you signed in and to protect
            authenticated requests. Theme preferences are stored locally in your
            browser. See our Cookie Policy for more detail.
          </p>
        </LegalSection>

        <LegalSection title="6. Data retention">
          <p>
            Account and listing information is retained while your account is
            active. Booking and payment records are retained as required for
            accounting, dispute resolution and legal compliance. You can request
            account deletion through support.
          </p>
        </LegalSection>

        <LegalSection title="7. Security">
          <p>
            Passwords are hashed, sessions are signed, and private API routes
            verify your access token and role on every request. Roles are loaded
            from our database and are never trusted from the browser. No system
            is completely secure, so please use a strong, unique password.
          </p>
        </LegalSection>

        <LegalSection title="8. Your rights">
          <p>
            Depending on where you live, you may have the right to access,
            correct, export or delete your personal information, or to object to
            certain processing. Contact us to exercise these rights.
          </p>
        </LegalSection>

        <LegalSection title="9. Children">
          <p>
            rEntsy is intended for users who can legally enter into rental
            agreements. We do not knowingly collect personal information from
            children.
          </p>
        </LegalSection>

        <LegalSection title="10. Contact">
          <p>
            Privacy questions can be sent to{" "}
            <a
              href="mailto:help@rentsy.com"
              className="font-semibold text-[#6e13f9] hover:underline dark:text-[#a66cff]"
            >
              help@rentsy.com
            </a>
            . We aim to respond within one business day.
          </p>
        </LegalSection>
      </LegalLayout>
    </PublicPage>
  );
}
