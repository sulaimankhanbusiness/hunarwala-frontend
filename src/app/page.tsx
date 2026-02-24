import HelperSearch from '@/features/helpers/components/HelperSearch';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-24 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-blue-100 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            #1 Service Marketplace in Pakistan
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Expert Help, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Right at Your Doorstep
            </span>
          </h1>

          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with verified professionals for plumbing, electrical work, cleaning, and more. Trusted by thousands of households.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#search" className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center">
              Find a Professional
            </a>
            <Link href="/register?type=helper" className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center flex items-center gap-2 justify-center">
              Become a Helper <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Search & Results Section */}
      <section id="search" className="bg-gray-50 pb-20 scroll-mt-20">
        <HelperSearch />
      </section>

      {/* Earn Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">
                Turn Your Skills into <br />
                <span className="text-amber-400">Steady Earnings</span>
              </h2>
              <p className="text-xl text-blue-100/80 mb-8 leading-relaxed">
                Join thousands of service providers in Pakistan. Set your own rates, work on your schedule, and grow your professional reputation.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'Verified clients and secure payments',
                  'Flexible work hours — you are the boss',
                  'Build your profile and get more jobs'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-blue-50 font-medium">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                      <CheckCircle2 size={14} className="text-blue-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/register?type=helper"
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-amber-500/20 hover:-translate-y-1"
              >
                Register as a Helper Now
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-400/20">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Instant Matching</h4>
                  <p className="text-sm text-blue-100/60">Connect with local customers</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-200">Weekly Target Reach</span>
                  <span className="text-white">85%</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs text-blue-200/60 mb-1">Total Jobs</p>
                    <p className="text-xl font-bold">42</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-xs text-blue-200/60 mb-1">Avg Score</p>
                    <p className="text-xl font-bold">4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HunarWala?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We don't just find you help; we ensure peace of mind with our rigorous vetting and safety standards.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Verified Professionals</h3>
              <p className="text-gray-600 leading-relaxed">Every helper undergoes a strict background check and skill verification process before joining.</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Transparent Pricing</h3>
              <p className="text-gray-600 leading-relaxed">Know the rates upfront. No hidden fees or last-minute surprises. Pay only for what you agreed on.</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Fast & Reliable</h3>
              <p className="text-gray-600 leading-relaxed">Book a pro in minutes. Our matching system connects you with the nearest available expert instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
