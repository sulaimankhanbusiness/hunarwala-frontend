'use client';

import { useState } from 'react';
import { walletApi } from '../api/wallet.api';
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Landmark, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TopUpModal({ isOpen, onClose, onSuccess }: TopUpModalProps) {
    const [amount, setAmount] = useState('');
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!screenshotUrl) {
            toast.error('Please provide a screenshot URL or link');
            return;
        }

        try {
            setIsSubmitting(true);
            await walletApi.createTopUp(Number(amount), screenshotUrl);
            toast.success('Top-up request submitted successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to submit top-up:', error);
            toast.error('Failed to submit top-up request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 pb-0">
                    <div className="flex items-center justify-between mb-8">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                            <Landmark size={24} />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Wallet Top-Up</h2>
                    <p className="text-gray-500 mt-1 leading-relaxed text-sm">Transfer PKR to our bank account and upload proof.</p>

                    <div className="mt-8 p-6 bg-gray-50 rounded-3xl space-y-3 border border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Bank Name</span>
                            <span className="text-gray-900 font-bold">Meezan Bank</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Account Title</span>
                            <span className="text-gray-900 font-bold">HunarWala Pakistan</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Account Number</span>
                            <span className="text-gray-900 font-bold font-mono">0102-0304050607</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6 pb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Amount (PKR)</label>
                            <input
                                type="number"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-lg"
                                placeholder="Enter amount..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Proof Screenshot URL</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <ImageIcon size={18} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={screenshotUrl}
                                    onChange={(e) => setScreenshotUrl(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                                    placeholder="Paste screenshot URL here..."
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 px-1 uppercase tracking-widest font-bold">Tip: Use imgur or similar for screenshots</p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-4">
                            <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-700 font-medium leading-relaxed uppercase tracking-tight">
                                Admin reviews may take up to 24 hours. Your balance will update once approved.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
