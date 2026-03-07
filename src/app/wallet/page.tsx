import WalletDashboard from '@/features/wallet/components/WalletDashboard';

export const metadata = {
    title: 'My Wallet | HunarWalaPro',
    description: 'Manage your earnings and top up your wallet.',
};

export default function WalletPage() {
    return (
        <main className="bg-gray-50 min-h-screen py-12">
            <WalletDashboard />
        </main>
    );
}
