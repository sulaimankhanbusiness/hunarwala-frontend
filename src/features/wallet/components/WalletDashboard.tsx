'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { walletApi, WalletTransaction } from '../api/wallet.api';
import { useWallet, useWalletConfig } from '../hooks/useWallet';
import {
    Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus,
    History, Clock, Calculator, Shield, AlertTriangle,
    TrendingUp, Percent, BadgeCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import TopUpModal from './TopUpModal';
import ScrollReveal from '@/components/ScrollReveal';

export default function WalletDashboard() {
    const { data: wallet, isLoading: isWalletLoading, refetch: refetchWallet } = useWallet();
    const { data: transactions = [], isLoading: isTxLoading } = useQuery({
        queryKey: ['wallet-transactions'],
        queryFn: () => walletApi.getTransactions(),
    });
    const { data: config, isLoading: isConfigLoading } = useWalletConfig();
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

    if (isWalletLoading || isTxLoading || isConfigLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const isLowBalance = (wallet?.balance || 0) < (config?.minimumRequiredBalance || 200);
    const totalTopUps = transactions
        .filter((tx: WalletTransaction) => tx.type === 'TOPUP')
        .reduce((s: number, tx: WalletTransaction) => s + tx.amount, 0);
    const totalCommissions = transactions
        .filter((tx: WalletTransaction) => tx.type === 'COMMISSION')
        .reduce((s: number, tx: WalletTransaction) => s + tx.amount, 0);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ── Hero Header ─────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-8 md:p-12 mb-8 shadow-2xl shadow-indigo-500/20">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-indigo-300/10 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                            <WalletIcon size={13} />
                            Financial Overview
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">My Wallet</h1>
                        <p className="text-indigo-100/80 mt-2 font-medium">Manage your earnings, commissions &amp; top-ups</p>
                    </div>
                    <button
                        onClick={() => setIsTopUpModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-indigo-50 text-indigo-700 rounded-xl font-bold transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 self-start md:self-center"
                    >
                        <Plus size={18} />
                        Submit Top-Up
                    </button>
                </div>

                <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    <div>
                        <div className="text-2xl md:text-3xl font-black text-white">{(wallet?.balance || 0).toLocaleString()}</div>
                        <div className="text-indigo-200 text-[10px] font-bold mt-1 uppercase tracking-wider">Balance (PKR)</div>
                    </div>
                    <div>
                        <div className="text-2xl md:text-3xl font-black text-white">{totalTopUps.toLocaleString()}</div>
                        <div className="text-indigo-200 text-[10px] font-bold mt-1 uppercase tracking-wider">Total Topped Up</div>
                    </div>
                    <div>
                        <div className="text-2xl md:text-3xl font-black text-white">{totalCommissions.toLocaleString()}</div>
                        <div className="text-indigo-200 text-[10px] font-bold mt-1 uppercase tracking-wider">Commission Paid</div>
                    </div>
                </div>
            </div>

            {/* ── Low Balance Banner ───────────────────────────── */}
            {isLowBalance && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600 flex-shrink-0">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900 text-sm">Minimum Balance Required</h4>
                        <p className="text-amber-700 text-sm mt-0.5 leading-relaxed">
                            Your balance is below {config?.minimumRequiredBalance} PKR. Top up to keep receiving job requests.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">

                {/* ── Main Column ──────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Balance Cards */}
                    <ScrollReveal>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 group hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] transition-all duration-300">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                        <WalletIcon size={22} />
                                    </div>
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">Available</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Spendable Balance</div>
                                <div className="text-4xl font-black text-gray-900 tracking-tight">
                                    {(wallet?.balance || 0).toLocaleString()}
                                    <span className="text-lg font-semibold text-gray-400 ml-1">PKR</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 group hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="bg-amber-50 p-3 rounded-xl text-amber-500 group-hover:bg-amber-100 transition-colors">
                                        <Clock size={22} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">Coming Soon</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Pending Deposits</div>
                                <div className="text-4xl font-black text-gray-900 tracking-tight">
                                    {(wallet?.pendingBalance || 0).toLocaleString()}
                                    <span className="text-lg font-semibold text-gray-400 ml-1">PKR</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Transaction History */}
                    <ScrollReveal delay={100}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                        <History size={18} />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">Transaction Ledger</h3>
                                </div>
                                <div className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">Last 30 days</div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/80 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3.5">Transaction</th>
                                            <th className="px-6 py-3.5">Reference</th>
                                            <th className="px-6 py-3.5 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                            <Calculator size={28} className="text-gray-300" />
                                                        </div>
                                                        <p className="font-semibold text-sm text-gray-500">No transactions yet</p>
                                                        <p className="text-xs text-gray-300">Your ledger will appear here once you're active</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx: WalletTransaction) => {
                                                const isCredit = tx.type === 'TOPUP' || tx.type === 'REFUND';
                                                return (
                                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 transition-colors ${isCredit ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100' : 'bg-red-50 text-red-500 border-red-100 group-hover:bg-red-100'}`}>
                                                                    {isCredit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-900 text-sm capitalize">{tx.type.toLowerCase().replace('_', ' ')}</div>
                                                                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                                                                        {format(new Date(tx.createdAt), 'MMM d, yyyy · h:mm a')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-mono text-[10px] text-gray-300 mb-1">TXN: {tx.id.slice(0, 8)}…</div>
                                                            {tx.bookingId && (
                                                                <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                                                                    Job: {tx.bookingId.slice(0, 5)}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className={`px-6 py-4 text-right font-black text-base ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {isCredit ? '+' : '−'}{tx.amount.toLocaleString()}
                                                            <span className="text-xs font-normal opacity-60 ml-0.5">PKR</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* ── Sidebar ──────────────────────────────────── */}
                <div className="space-y-5">

                    {/* Policy Card */}
                    <ScrollReveal delay={150}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                    <Shield size={16} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">Policy &amp; Rules</h4>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="bg-indigo-50 rounded-lg p-1.5 text-indigo-600 flex-shrink-0 mt-0.5">
                                        <Percent size={13} />
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        A <span className="text-gray-900 font-bold">{(config?.commissionRate || 0.08) * 100}% commission</span> is deducted from every settled booking.
                                    </p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="bg-emerald-50 rounded-lg p-1.5 text-emerald-600 flex-shrink-0 mt-0.5">
                                        <BadgeCheck size={13} />
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Maintain at least <span className="text-gray-900 font-bold">{config?.minimumRequiredBalance} PKR</span> to keep receiving job requests.
                                    </p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="bg-red-50 rounded-lg p-1.5 text-red-500 flex-shrink-0 mt-0.5">
                                        <AlertTriangle size={13} />
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Cancellations may incur a <span className="text-red-600 font-bold">{config?.cancellationPenalty || 75} PKR penalty</span>.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </ScrollReveal>

                    {/* Support Card */}
                    <ScrollReveal delay={200}>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-lg shadow-indigo-500/20">
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-violet-400/20 rounded-full blur-xl" />
                            <div className="relative z-10">
                                <div className="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-white/20">
                                    <TrendingUp size={18} className="text-white" />
                                </div>
                                <h4 className="font-bold text-white mb-2">Need Assistance?</h4>
                                <p className="text-sm text-indigo-100/80 font-medium leading-relaxed mb-5">
                                    Issues with top-ups or commission calculations? Our support team is here to help.
                                </p>
                                <button className="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
                onSuccess={refetchWallet}
            />
        </div>
    );
}
