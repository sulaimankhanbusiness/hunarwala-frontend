import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — HunarWalaa',
  description: 'Privacy Policy for HunarWalaa — how we collect, use, and protect your personal data.',
};

const EFFECTIVE_DATE = 'May 1, 2025';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500">Effective date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <p>
              HunarWalaa (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{' '}
              <a href="https://hunarwalaa.com" className="text-indigo-600 hover:underline">hunarwalaa.com</a>{' '}
              and related mobile applications (the &quot;Platform&quot;). This Privacy Policy explains what personal information we collect, how we use it, and your rights regarding that information.
            </p>
            <p className="mt-3">
              By using our Platform, you agree to the collection and use of information as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Information you provide directly</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Full name, email address, and phone number when you register</li>
              <li>Profile photo and CNIC number (for helper verification only)</li>
              <li>Service descriptions, skills, and work experience (helpers)</li>
              <li>Payment details provided when topping up your Helper wallet (e.g. card or bank info processed securely by our payment partner)</li>
              <li>Messages exchanged through our in-app chat</li>
              <li>Booking details, reviews, and ratings</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Information collected automatically</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your device location (GPS), used to find nearby professionals and display your position on the map</li>
              <li>Push notification tokens (to send booking alerts and service updates)</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Information collected via analytics tools</h3>
            <p className="text-sm text-gray-500 mb-2">
              We use Google Analytics and Vercel Analytics to understand how the Platform is used. These tools automatically collect:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and approximate location (country/city level)</li>
              <li>Device type, operating system, and browser</li>
              <li>Pages visited, time spent, and actions taken on the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To create and manage your account</li>
              <li>To match clients with appropriate service professionals</li>
              <li>To process Helper wallet top-ups and deduct platform commission per completed booking</li>
              <li>To send booking confirmations, status updates, and service notifications</li>
              <li>To verify the identity and credentials of helpers</li>
              <li>To resolve disputes and provide customer support</li>
              <li>To improve the Platform through analytics and usage data</li>
              <li>To comply with legal obligations under Pakistani law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Sharing of Information</h2>
            <p className="mb-3">We do not sell your personal information. We share information only in these circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Between clients and helpers:</strong> When a booking is made, both parties can see each other&apos;s name, profile photo, phone number, and location as needed to complete the service.
              </li>
              <li>
                <strong>Payment processors:</strong> When a Helper tops up their wallet, we share the necessary payment details with our payment partner (Safepay) solely to process that top-up. We do not process or handle payments between Clients and Helpers.
              </li>
              <li>
                <strong>Service providers:</strong> We use third-party services including Firebase (notifications), Google Analytics (usage analytics), and Vercel (hosting). These providers are bound by their own privacy policies.
              </li>
              <li>
                <strong>Legal requirements:</strong> We may disclose information if required by Pakistani law, court order, or government authority.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encrypted data transmission (HTTPS), secure token-based authentication, and restricted access to personal data within our team. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us. Some data may be retained for legal and financial record-keeping purposes as required by Pakistani law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your account and personal data</li>
              <li>Withdraw consent for push notifications at any time through your device settings</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:hello@hunarwalaa.com" className="text-indigo-600 hover:underline">hello@hunarwalaa.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your login session. We also use analytics cookies (Google Analytics, Vercel Analytics) to understand how the Platform is used. You can disable non-essential cookies through your browser settings, though this may affect Platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our Platform is not directed at children under 18. We do not knowingly collect personal information from minors. If we become aware that a child under 18 has provided us with personal information, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users of material changes via email or in-app notification. Continued use of the Platform after changes take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or how we handle your data:</p>
            <div className="mt-3 bg-gray-50 rounded-xl p-5 space-y-1">
              <p><strong>HunarWalaa</strong></p>
              <p>Email: <a href="mailto:hello@hunarwalaa.com" className="text-indigo-600 hover:underline">hello@hunarwalaa.com</a></p>
              <p>Phone: <a href="tel:+923230196061" className="text-indigo-600 hover:underline">+92-323-019-6061</a></p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
          <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
