import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy — HunarWalaa',
  description: 'Cancellation and refund policy for HunarWalaa — bookings, wallet top-ups, and commission disputes.',
};

const EFFECTIVE_DATE = 'May 1, 2025';

export default function CancellationPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Cancellation &amp; Refund Policy</h1>
          <p className="text-gray-500">Effective date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <p>
              This policy explains how cancellations, refunds, and disputes are handled on the HunarWalaa platform. Please read it carefully before making a booking or topping up your Helper wallet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Booking Cancellations</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">By the Client</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>A Client may cancel a booking at any time before the Helper is en route at no charge.</li>
              <li>Once a Helper has been marked as en route, cancellation may result in a partial commission deduction from the Helper&apos;s wallet to compensate for their time and travel.</li>
              <li>Clients do not pay HunarWalaa directly — therefore no monetary refund is issued to the Client upon cancellation.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">By the Helper</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Helpers may cancel a booking with reasonable notice before the scheduled time.</li>
              <li>Repeated cancellations without valid reason may result in account suspension.</li>
              <li>No commission is deducted for bookings cancelled before they are marked as started.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Client–Helper Payments</h2>
            <p>
              HunarWalaa does not process or hold payments between Clients and Helpers. Payment for services (cash, bank transfer, or any agreed method) is handled directly between the two parties. As such, HunarWalaa does not issue refunds for service payments — any disputes over service fees must be resolved directly between the Client and Helper.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Helper Wallet Top-Ups</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wallet top-ups processed through the Platform are <strong>non-refundable</strong> once the transaction is confirmed.</li>
              <li>In cases of verified technical error (e.g. duplicate charge, payment processed but wallet not credited), a full refund will be issued within <strong>5–7 business days</strong>.</li>
              <li>To request a refund for a technical error, contact us at{' '}
                <a href="mailto:hello@hunarwalaa.com" className="text-indigo-600 hover:underline">hello@hunarwalaa.com</a>{' '}
                within 48 hours of the transaction with proof of payment.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Commission Disputes</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If a Helper believes a commission deduction was made in error (e.g. for a booking that was cancelled or never completed), they may raise a dispute within <strong>48 hours</strong> of the deduction.</li>
              <li>Disputes must be submitted to{' '}
                <a href="mailto:hello@hunarwalaa.com" className="text-indigo-600 hover:underline">hello@hunarwalaa.com</a>{' '}
                with the booking ID and a brief explanation.
              </li>
              <li>We will review and respond within <strong>3 business days</strong>.</li>
              <li>If the dispute is upheld, the commission amount will be credited back to the Helper&apos;s wallet.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Service Quality Disputes</h2>
            <p>
              HunarWalaa does not guarantee the quality of services delivered by Helpers and does not issue compensation for unsatisfactory work. Clients are encouraged to review Helper profiles, ratings, and reviews before booking, and to raise quality concerns directly with the Helper. For serious misconduct or safety concerns, contact us so we can review the Helper&apos;s account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
            <p>For any cancellation or refund queries:</p>
            <div className="mt-3 bg-gray-50 rounded-xl p-5 space-y-1">
              <p><strong>HunarWalaa Support</strong></p>
              <p>Email: <a href="mailto:hello@hunarwalaa.com" className="text-indigo-600 hover:underline">hello@hunarwalaa.com</a></p>
              <p>Phone: <a href="tel:+923230196061" className="text-indigo-600 hover:underline">+92-323-019-6061</a></p>
              <p className="text-sm text-gray-500 mt-2">Response time: within 3 business days</p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
          <Link href="/contact" className="text-indigo-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
