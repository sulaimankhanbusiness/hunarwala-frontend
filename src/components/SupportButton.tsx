import Link from 'next/link';
import { Headphones } from 'lucide-react';

export default function SupportButton() {
  return (
    <Link
      href="/contact"
      title="Support"
      className="hidden md:flex fixed bottom-8 right-8 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 items-center justify-center transition-all duration-200 hover:scale-110 group"
    >
      <Headphones size={22} />
      <span className="absolute right-16 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Need help?
      </span>
    </Link>
  );
}
