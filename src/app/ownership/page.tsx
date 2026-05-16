import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ownership Statement — HunarWalaa',
  description: 'Ownership and operator information for the HunarWalaa platform.',
};

export default function OwnershipPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Ownership Statement</h1>
          <p className="text-gray-500">HunarWalaa Platform</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Platform Identity</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex gap-4">
                <span className="text-gray-500 w-36 shrink-0">Platform Name</span>
                <span className="font-medium text-gray-900">HunarWalaa</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-36 shrink-0">Website</span>
                <a href="https://hunarwalaa.com" className="text-indigo-600 hover:underline">hunarwalaa.com</a>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-36 shrink-0">Nature of Business</span>
                <span className="font-medium text-gray-900">Online skill marketplace — connecting clients with verified local service professionals across Pakistan</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-36 shrink-0">Country</span>
                <span className="font-medium text-gray-900">Pakistan</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Ownership &amp; Operation</h2>
            <p>
              HunarWalaa is owned and operated as an independent digital platform. The platform is developed, maintained, and managed by its founding team based in Pakistan.
            </p>
            <p className="mt-3">
              HunarWalaa operates as a technology intermediary — it does not employ service providers (Helpers) and does not directly deliver any of the services listed on the platform. All services are provided by independent professionals who have registered and been verified on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Business Model</h2>
            <p>
              HunarWalaa earns revenue by charging a platform commission of 8% on each completed booking, deducted from the Helper&apos;s prepaid wallet balance. The platform does not process or hold payments between Clients and Helpers — service payments are settled directly between the two parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact &amp; Accountability</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex gap-4">
                <span className="text-gray-500 w-36 shrink-0">Email</span>
                <a href="mailto:hello@hunarwalaa.com" className="text-indigo-600 hover:underline">hello@hunarwalaa.com</a>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-36 shrink-0">Phone</span>
                <a href="tel:+923230196061" className="text-indigo-600 hover:underline">+92-323-019-6061</a>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-36 shrink-0">Support Hours</span>
                <span className="font-medium text-gray-900">Mon–Sat, 9am–6pm PKT</span>
              </div>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-sm">
          <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
          <Link href="/cancellation" className="text-indigo-600 hover:underline">Cancellation Policy</Link>
        </div>
      </div>
    </div>
  );
}
