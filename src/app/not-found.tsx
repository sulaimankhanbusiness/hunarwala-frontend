'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-xl w-full text-center">
                {/* 404 Visual */}
                <div className="relative mb-12">
                    <h1 className="text-[180px] font-black text-blue-600/5 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl shadow-blue-100 flex items-center justify-center border border-gray-100 animate-bounce-subtle">
                            <AlertCircle className="w-16 h-16 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                    Oops! Page Not Found
                </h2>
                <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed">
                    The page you are looking for might have been moved, deleted,
                    or perhaps never existed. Don't worry, we'll help you find your way back.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group"
                    >
                        <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        Back to Home
                    </Link>
                    <Link
                        href="/#search"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                        <Search className="w-5 h-5" />
                        Find a Helper
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-16 pt-8 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                        Popular Sections
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <Link href="/services" className="text-sm font-black text-gray-600 hover:text-blue-600 transition-colors">
                            Services
                        </Link>
                        <Link href="/how-it-works" className="text-sm font-black text-gray-600 hover:text-blue-600 transition-colors">
                            How it Works
                        </Link>
                        <Link href="/register" className="text-sm font-black text-gray-600 hover:text-blue-600 transition-colors">
                            Join Us
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
