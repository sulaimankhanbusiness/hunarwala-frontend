import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tighter mb-4 block">
              HunarWala<span className="text-amber-500">.</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Connecting skilled professionals with people who need them. Trusted, verified, and reliable services at your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Customers</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/services" className="hover:text-blue-600 transition-colors">Find a Service</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link href="/trust" className="hover:text-blue-600 transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Helpers</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/register" className="hover:text-blue-600 transition-colors">Join as a Professional</Link></li>
              <li><Link href="/success-stories" className="hover:text-blue-600 transition-colors">Success Stories</Link></li>
              <li><Link href="/resources" className="hover:text-blue-600 transition-colors">Resources</Link></li>
              <li><Link href="/community" className="hover:text-blue-600 transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2025 HunarWala. All rights reserved.</p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
