'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { walletApi, Wallet, WalletTransaction, WalletConfig } from '../api/wallet.api';
import { useWallet, useWalletConfig } from '../hooks/useWallet';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History, Clock, CheckCircle2, XCircle, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import TopUpModal from './TopUpModal';
import { toast } from 'sonner';

export default function WalletDashboard() {
    const { data: wallet, isLoading: isWalletLoading, refetch: refetchWallet } = useWallet();
    const { data: transactions = [], isLoading: isTxLoading, refetch: refetchTransactions } = useQuery({
        queryKey: ['wallet-transactions'],
        queryFn: () => walletApi.getTransactions(),
    });
    const { data: config, isLoading: isConfigLoading } = useWalletConfig();

    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

    const handleRefresh = () => {
        refetchWallet();
        refetchTransactions();
    };

    if (isWalletLoading || isTxLoading || isConfigLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const isLowBalance = (wallet?.balance || 0) < (config?.minimumRequiredBalance || 200);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
                    <p className="text-gray-500 mt-1">Manage your earnings, commissions, and top-ups</p>
                </div>
                <button
                    onClick={() => setIsTopUpModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    Submit Top-Up
                </button>
            </header>

            {/* Status Banner */}
            {isLowBalance && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900 text-sm md:text-base">Minimum Balance Required</h4>
                        <p className="text-amber-700 text-sm mt-0.5 leading-relaxed">
                            Your balance is below {config?.minimumRequiredBalance} PKR. You must top up to continue receiving new job requests.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Balance Cards */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/40">
                            {/* Decorative elements */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                                        <WalletIcon size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-blue-100/70 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                        Available PKR
                                    </span>
                                </div>
                                <div className="mb-2 text-blue-100/60 text-sm font-medium uppercase tracking-wider">Spendable Balance</div>
                                <div className="text-5xl font-black tracking-tight">{wallet?.balance.toLocaleString()} <span className="text-2xl font-normal opacity-60">PKR</span></div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-8 text-gray-400">
                                <div className="bg-amber-50 p-3 rounded-2xl text-amber-500 group-hover:bg-amber-100 transition-colors">
                                    <Clock size={24} />
                                </div>
                                <span className="text-sm font-medium">Coming Soon</span>
                            </div>
                            <div className="mb-2 text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Deposits</div>
                            <div className="text-4xl font-black text-gray-900 tracking-tight">{wallet?.pendingBalance.toLocaleString()} <span className="text-xl font-normal text-gray-400">PKR</span></div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <History size={22} className="text-blue-500" />
                                Transaction Ledger
                            </h3>
                            <div className="text-sm text-gray-400 font-medium tracking-tight">Last 30 days</div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-4">Transaction Details</th>
                                        <th className="px-8 py-4">Status / ID</th>
                                        <th className="px-8 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Calculator size={48} className="opacity-10" />
                                                    <p>No transactions found on your ledger yet.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx: WalletTransaction) => (
                                            <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${tx.type === 'TOPUP' || tx.type === 'REFUND'
                                                            ? 'bg-green-50 text-green-600 border-green-100 group-hover:bg-green-100'
                                                            : 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-100'
                                                            }`}>
                                                            {tx.type === 'TOPUP' || tx.type === 'REFUND' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 capitalize">{tx.type.toLowerCase().replace('_', ' ')}</div>
                                                            <div className="text-xs text-gray-400 font-medium">
                                                                {format(new Date(tx.createdAt), 'MMM d, yyyy • p')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-mono text-[10px] text-gray-400 mb-1">TXN: {tx.id.slice(0, 8)}...</div>
                                                    {tx.bookingId && (
                                                        <div className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                                                            Job Ref: {tx.bookingId.slice(0, 5)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className={`px-8 py-6 text-right font-black text-lg ${tx.type === 'TOPUP' || tx.type === 'REFUND' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {tx.type === 'TOPUP' || tx.type === 'REFUND' ? '+' : '-'} {tx.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-blue-500" />
                            Policy & Rules
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    A <span className="text-gray-900 font-bold">{(config?.commissionRate || 0.08) * 100}% commission</span> is automatically deducted from every settled booking.
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    Maintain at least <span className="text-gray-900 font-bold">{config?.minimumRequiredBalance} PKR</span> to keep receiving job requests.
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    Cancellations for accepted jobs may incur a <span className="text-red-600 font-bold">{config?.cancellationPenalty || 75} PKR penalty</span>.
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="relative group rounded-[2rem] overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600 transition-transform group-hover:scale-110 duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
                        <div className="relative p-8 text-white">
                            <h4 className="font-bold mb-4">Need Assistance?</h4>
                            <p className="text-sm text-blue-100 font-medium leading-relaxed mb-6">
                                If you face issues with top-ups or commission calculations, contact our support team.
                            </p>
                            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-xl shadow-black/20">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
                onSuccess={handleRefresh}
            />
        </div>
    );
}

function ShieldCheck({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
        </svg>
    )
}
