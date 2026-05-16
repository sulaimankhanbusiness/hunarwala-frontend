import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — HunarWalaa',
  description: 'Terms of Service for HunarWalaa — the rules and conditions for using our platform.',
};

const EFFECTIVE_DATE = 'May 1, 2025';

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-gray-500">Effective date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the HunarWalaa platform, including the website{' '}
              <a href="https://hunarwalaa.com" className="text-indigo-600 hover:underline">hunarwalaa.com</a>{' '}
              and any related applications (the &quot;Platform&quot;), operated by HunarWalaa (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p className="mt-3">
              By creating an account or using the Platform, you agree to these Terms. If you do not agree, do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. The Platform</h2>
            <p>
              HunarWalaa is a marketplace that connects clients (&quot;Clients&quot;) seeking skilled services — at home, on the road, or anywhere across Pakistan — with independent service providers (&quot;Helpers&quot;). We are a technology platform, not a service provider. HunarWalaa does not employ Helpers and is not responsible for the quality of services delivered, except as expressly stated in these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to use the Platform.</li>
              <li>You must be a resident of Pakistan or authorized to conduct business in Pakistan.</li>
              <li>You must provide accurate, complete, and current registration information.</li>
              <li>One account per person. Accounts are non-transferable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Client Responsibilities</h2>
            <p className="mb-3">As a Client, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information about the service you need and your location.</li>
              <li>Treat Helpers with respect and ensure a safe working environment.</li>
              <li>Agree on and settle service payment directly with the Helper. HunarWalaa does not handle or guarantee client-to-helper payments.</li>
              <li>Not circumvent the Platform to avoid Helper commission deductions (e.g. convincing Helpers to mark bookings as cancelled while still receiving the service).</li>
              <li>Submit honest and accurate reviews of services received.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Helper Responsibilities</h2>
            <p className="mb-3">As a Helper, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information about your skills, qualifications, and experience during registration.</li>
              <li>Complete bookings you have accepted, or cancel with reasonable notice.</li>
              <li>Deliver services professionally and to a reasonable standard of quality.</li>
              <li>Not misrepresent your identity or qualifications.</li>
              <li>Comply with all applicable Pakistani laws and regulations relevant to your trade.</li>
              <li>Not attempt to avoid platform commission deductions — for example, by asking Clients to book off-platform or marking a completed service as cancelled.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Platform Commission &amp; Helper Wallet</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>HunarWalaa operates on a commission model. Helpers are charged a platform fee of <strong>8% of the agreed booking value</strong>, deducted automatically from their HunarWalaa wallet upon booking completion.</li>
              <li>Helpers must maintain a sufficient wallet balance to accept and complete bookings. Bookings may be paused if a Helper&apos;s wallet balance is insufficient.</li>
              <li>Helpers can top up their wallet through the Platform using available payment methods.</li>
              <li>Wallet top-ups are non-refundable except in cases of verified technical error.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Client–Helper Payments</h2>
            <p className="mb-3">
              HunarWalaa does <strong>not</strong> process payments between Clients and Helpers. The Platform connects both parties; how they settle the service fee is entirely at their discretion.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clients and Helpers may agree to pay by cash, bank transfer, or any other mutually acceptable method.</li>
              <li>HunarWalaa is not a party to the financial transaction between Client and Helper and accepts no liability for payment disputes between them.</li>
              <li>Any disagreement over the amount charged for a service is solely between the Client and Helper.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cancellations &amp; Disputes</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clients may cancel a booking at no charge if cancelled before the Helper is en route.</li>
              <li>Helpers who repeatedly cancel accepted bookings may have their accounts suspended.</li>
              <li>Disputes related to <strong>platform commission or wallet deductions</strong> must be raised within 48 hours by contacting support. We will review and respond within 3 business days.</li>
              <li>Disputes related to service quality or client-to-helper payment are outside HunarWalaa&apos;s jurisdiction and must be resolved directly between the parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Prohibited Conduct</h2>
            <p className="mb-3">You may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Platform for any unlawful purpose or in violation of Pakistani law.</li>
              <li>Post false, misleading, or defamatory reviews or information.</li>
              <li>Harass, threaten, or abuse other users.</li>
              <li>Attempt to manipulate ratings or reviews.</li>
              <li>Use automated bots or scrapers on the Platform.</li>
              <li>Circumvent the Platform to avoid service fees.</li>
              <li>Share your account credentials with others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Intellectual Property</h2>
            <p>
              All content on the Platform, including but not limited to text, graphics, logos, and software, is the property of HunarWalaa or its licensors and is protected under applicable law. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, HunarWalaa shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability to you for any claim shall not exceed the amount paid to HunarWalaa (e.g. Helper wallet top-ups) in the 30 days preceding the claim, or PKR 5,000 — whichever is greater.
            </p>
            <p className="mt-3">
              HunarWalaa is not liable for the actions, quality of work, or conduct of Helpers or Clients on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Account Termination</h2>
            <p>
              We reserve the right to suspend or permanently terminate any account that violates these Terms, engages in fraudulent activity, or poses a risk to the safety of other users. You may also delete your account at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Modifications to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify you of material changes via email or in-app notification at least 7 days before changes take effect. Continued use of the Platform after that date constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Islamabad, Pakistan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. Contact</h2>
            <p>For questions about these Terms:</p>
            <div className="mt-3 bg-gray-50 rounded-xl p-5 space-y-1">
              <p><strong>HunarWalaa</strong></p>
              <p>Email: <a href="mailto:hello@hunarwalaa.com" className="text-indigo-600 hover:underline">hello@hunarwalaa.com</a></p>
              <p>Phone: <a href="tel:+923230196061" className="text-indigo-600 hover:underline">+92-323-019-6061</a></p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
          <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
