'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '@/features/wallet/api/wallet.api';
import { AlertCircle, Loader2, Banknote, History } from 'lucide-react';
import { toast } from 'sonner';

export default function ManualAdjustmentForm() {
    const queryClient = useQueryClient();
    const [helperId, setHelperId] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('ADMIN_ADJUSTMENT');
    const [notes, setNotes] = useState('');

    const mutation = useMutation({
        mutationFn: walletApi.adminManualAdjustment,
        onSuccess: () => {
            toast.success('Wallet adjusted successfully');
            setHelperId('');
            setAmount('');
            setNotes('');
        },
        onError: () => toast.error('Failed to adjust wallet balance'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!helperId || !amount || isNaN(Number(amount))) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        mutation.mutate({
            helperId,
            amount: Number(amount),
            type,
            notes,
        });
    };

    return (
        <div className="max-w-xl bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                    <Banknote size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Manual Adjustment</h3>
                    <p className="text-sm text-gray-500">Add or deduct funds from any wallet.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Helper ID / Wallet ID</label>
                    <input
                        type="text"
                        required
                        value={helperId}
                        onChange={(e) => setHelperId(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        placeholder="Paste helper unique ID..."
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Amount (PKR)</label>
                        <input
                            type="number"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                            placeholder="e.g. 500 or -500"
                        />
                        <p className="text-[10px] text-gray-400 mt-2 px-1">Positive for addition, negative for deduction.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold appearance-none bg-white"
                        >
                            <option value="ADMIN_ADJUSTMENT">Adjustment</option>
                            <option value="REFUND">Refund</option>
                            <option value="PENALTY">Penalty</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Internal Notes</label>
                    <textarea
                        required
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                        placeholder="Reason for this adjustment..."
                        rows={3}
                    />
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl flex items-start gap-4">
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                        Warning: This action will immediately affect the helper's balance and log an admin transaction.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Apply Adjustment'
                    )}
                </button>
            </form>
        </div>
    );
}
