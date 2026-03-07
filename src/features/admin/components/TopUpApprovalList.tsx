'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi, TopUpRequest } from '@/features/wallet/api/wallet.api';
import { Check, X, Loader2, ExternalLink, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TopUpApprovalList() {
    const queryClient = useQueryClient();
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['admin-topup-requests', 'PENDING'],
        queryFn: () => walletApi.adminGetTopUpRequests('PENDING'),
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => walletApi.adminApproveTopUp(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-topup-requests'] });
            toast.success('Top-up request approved successfully');
        },
        onError: () => toast.error('Failed to approve top-up request'),
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => walletApi.adminRejectTopUp(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-topup-requests'] });
            toast.success('Top-up request rejected');
        },
        onError: () => toast.error('Failed to reject top-up request'),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No pending requests</h3>
                <p className="text-gray-500 text-sm">Everything is up to date!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((request: any) => (
                <div key={request.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                            <User size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{request.helper?.user?.fullName || 'Unknown Helper'}</h4>
                            <p className="text-xs text-gray-500">Requested: {format(new Date(request.createdAt), 'MMM d, yyyy • p')}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-lg font-black text-gray-900">{request.amount.toLocaleString()} PKR</span>
                                <a
                                    href={request.screenshotUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-bold text-gray-600 flex items-center gap-1 transition-colors"
                                >
                                    <ExternalLink size={10} /> View Proof
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => approveMutation.mutate(request.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {approveMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                            Approve
                        </button>
                        <button
                            onClick={() => rejectMutation.mutate(request.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="flex-1 md:flex-none px-6 py-3 bg-white border border-red-100 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
