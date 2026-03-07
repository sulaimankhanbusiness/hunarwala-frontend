'use client';

import { useQuery } from '@tanstack/react-query';
import { walletApi } from '../api/wallet.api';

export function useWallet() {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: () => walletApi.getBalance(),
        refetchInterval: 30000,
    });
}

export function useWalletConfig() {
    return useQuery({
        queryKey: ['wallet-config'],
        queryFn: () => walletApi.getConfig(),
        staleTime: 600000, // 10 minutes
    });
}
