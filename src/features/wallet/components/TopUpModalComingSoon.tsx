'use client';

import { X, Wallet, Bell } from 'lucide-react';

interface TopUpModalComingSoonProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TopUpModalComingSoon({ isOpen, onClose }: TopUpModalComingSoonProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-end mb-4">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
                            <Wallet size={36} className="text-indigo-600" />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                            Online Top-Up Coming Soon
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            We are setting up secure online payments. You will be able to top up your wallet directly from this screen very soon.
                        </p>

                        <div className="mt-8 w-full p-4 bg-indigo-50 rounded-2xl flex items-start gap-3 text-left">
                            <Bell size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                                Need to top up now? Contact us at{' '}
                                <a href="mailto:hello@hunarwalaa.com" className="underline underline-offset-2">
                                    hello@hunarwalaa.com
                                </a>{' '}
                                and we will assist you manually.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
