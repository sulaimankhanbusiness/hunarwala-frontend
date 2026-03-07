'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi, TopUpRequest } from '@/features/wallet/api/wallet.api';
import { Check, X, Loader2, AlertCircle, Banknote, History, Settings, User } from 'lucide-react';
import { toast } from 'sonner';
import TopUpApprovalList from '@/features/admin/components/TopUpApprovalList';
import ManualAdjustmentForm from '@/features/admin/components/ManualAdjustmentForm';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useEffect } from 'react';

export default function AdminWalletPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'topups' | 'adjust'>('topups');

    useEffect(() => {
        if (!user || user.userType !== 'admin') {
            router.push('/');
        }
    }, [user, router]);

    if (!user || user.userType !== 'admin') {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Administration</h1>
                <p className="text-gray-500 mt-1">Manage platform revenue, approve top-ups, and adjust helper wallets.</p>
            </header>

            <div className="flex gap-4 mb-8 border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('topups')}
                    className={`pb-4 px-4 text-sm font-bold transition-all ${activeTab === 'topups'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    Top-Up Requests
                </button>
                <button
                    onClick={() => setActiveTab('adjust')}
                    className={`pb-4 px-4 text-sm font-bold transition-all ${activeTab === 'adjust'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    Manual Adjustment
                </button>
            </div>

            <main>
                {activeTab === 'topups' ? (
                    <TopUpApprovalList />
                ) : (
                    <ManualAdjustmentForm />
                )}
            </main>
        </div>
    );
}
