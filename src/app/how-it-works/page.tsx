'use client';

import React from 'react';
import {
    Search,
    CalendarCheck,
    PlayCircle,
    CheckCircle2,
    Star,
    UserPlus,
    Clock,
    DollarSign,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
    const clientSteps = [
        {
            icon: <Search className="w-8 h-8 text-blue-600" />,
            title: "Search & Discover",
            description: "Find expert professionals near you by service type, rating, and location."
        },
        {
            icon: <CalendarCheck className="w-8 h-8 text-blue-600" />,
            title: "Book Instantly",
            description: "Describe your job, set an estimated price, and schedule a time that works for you."
        },
        {
            icon: <PlayCircle className="w-8 h-8 text-blue-600" />,
            title: "Live Tracking",
            description: "Track your helper in real-time once they start the journey to your doorstep."
        },
        {
            icon: <CheckCircle2 className="w-8 h-8 text-blue-600" />,
            title: "Confirm & Settle",
            description: "Review the work, confirm the final amount, and settle payment securely."
        },
        {
            icon: <Star className="w-8 h-8 text-amber-500" />,
            title: "Rate & Review",
            description: "Help the community by sharing your experience and rating the helper's skill."
        }
    ];

    const helperSteps = [
        {
            icon: <UserPlus className="w-8 h-8 text-indigo-600" />,
            title: "Register Your Skill",
            description: "Join as a verified professional and build your premium digital profile."
        },
        {
            icon: <Clock className="w-8 h-8 text-indigo-600" />,
            title: "Flexible Scheduling",
            description: "Set your own hours and rates. Work whenever you are available."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
            title: "Verified Jobs",
            description: "Receive booking requests from genuine local clients with clear job details."
        },
        {
            icon: <DollarSign className="w-8 h-8 text-indigo-600" />,
            title: "Direct Earnings",
            description: "Get paid for your hard work and grow your reputation to earn more."
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-20 bg-gray-50">
            {/* Header Section */}
            <section className="bg-white py-20 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        How <span className="text-blue-600">HunarWala</span> Works
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                        Connecting Pakistan's finest talent with those who need it most.
                        A seamless, safe, and professional marketplace for all your service needs.
                    </p>
                </div>
            </section>

            {/* Client Flow */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-black uppercase tracking-widest">
                            For Clients
                        </div>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8">
                        {clientSteps.map((step, index) => (
                            <div key={index} className="relative group">
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.description}</p>

                                    {index < clientSteps.length - 1 && (
                                        <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                            <ArrowRight className="text-gray-300 w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/#search" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                            Start Booking Now <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Helper Flow */}
            <section className="py-24 bg-gradient-to-br from-indigo-900 to-blue-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-black uppercase tracking-widest border border-white/20">
                            For Helpers
                        </div>
                        <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {helperSteps.map((step, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all duration-300 h-full">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-blue-100/70 font-medium leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/register?type=helper" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20">
                            Register as a Helper <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Us? */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-8">Ready to get things done?</h2>
                    <p className="text-gray-500 font-medium mb-12">
                        Whether you need a quick fix or a major renovation, HunarWala is here to connect you
                        with the right skills at the right time. Your satisfaction is our top priority.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/services" className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-50 transition-all">
                            Explore Services
                        </Link>
                        <Link href="/#search" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                            Book a Helper
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
