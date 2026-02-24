'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed w-full z-50 glass border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tighter">
              HunarWala<span className="text-amber-500">.</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/services" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Services</Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How it Works</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Hi, {user.fullName.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-900 font-medium hover:text-blue-600">Login</Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link 
              href="/services" 
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Services
            </Link>
            <Link 
              href="/how-it-works" 
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              How it Works
            </Link>
             {user ? (
               <>
                <div className="block px-3 py-3 text-base font-medium text-gray-500">
                  Signed in as {user.email}
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
               </>
             ) : (
               <div className="pt-4 flex flex-col gap-3">
                  <Link 
                    href="/login" 
                    className="block w-full text-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
               </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
