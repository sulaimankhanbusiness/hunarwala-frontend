import api from '@/lib/api';

export interface Wallet {
    balance: number;
    pendingBalance: number;
}

export interface WalletConfig {
    commissionRate: number;
    minimumRequiredBalance: number;
    cancellationPenalty: number;
    updatedAt: string;
}

export interface WalletTransaction {
    id: string;
    type: 'TOPUP' | 'COMMISSION' | 'REFUND' | 'ADMIN_ADJUSTMENT' | 'PENALTY';
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    bookingId?: string;
    topUpId?: string;
    notes?: string;
    createdAt: string;
}

export interface TopUpRequest {
    id: string;
    amount: number;
    screenshotUrl: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

const WALLET_BASE_URL = '/wallet';
const ADMIN_WALLET_BASE_URL = '/admin/wallet';

export const walletApi = {
    getBalance: async (): Promise<Wallet> => {
        return api.get(`${WALLET_BASE_URL}/balance`);
    },

    createTopUp: async (amount: number, screenshotUrl: string): Promise<TopUpRequest> => {
        return api.post(`${WALLET_BASE_URL}/topup`, { amount, screenshotUrl });
    },

    getTransactions: async (): Promise<WalletTransaction[]> => {
        return api.get(`${WALLET_BASE_URL}/transactions`);
    },

    getConfig: async (): Promise<WalletConfig> => {
        return api.get(`${WALLET_BASE_URL}/config`);
    },

    // Admin endpoints
    adminApproveTopUp: async (requestId: string): Promise<TopUpRequest> => {
        return api.post(`${ADMIN_WALLET_BASE_URL}/topup/${requestId}/approve`);
    },

    adminRejectTopUp: async (requestId: string): Promise<TopUpRequest> => {
        return api.post(`${ADMIN_WALLET_BASE_URL}/topup/${requestId}/reject`);
    },

    adminGetRevenue: async (): Promise<any[]> => {
        return api.get(`${ADMIN_WALLET_BASE_URL}/revenue`);
    },

    adminGetTopUpRequests: async (status?: string): Promise<TopUpRequest[]> => {
        return api.get(`${ADMIN_WALLET_BASE_URL}/topups`, { params: { status } });
    },

    adminManualAdjustment: async (data: { helperId: string; amount: number; type: string; notes: string }): Promise<any> => {
        return api.post(`${ADMIN_WALLET_BASE_URL}/adjust`, data);
    },
};
