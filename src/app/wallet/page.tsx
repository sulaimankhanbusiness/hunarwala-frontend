import WalletDashboard from '@/features/wallet/components/WalletDashboard';

export const metadata = {
  title: 'My Wallet — HunarWalaa',
  description: 'Manage your earnings, view transactions, and top up your HunarWalaa wallet.',
  keywords: ['hunarwala wallet', 'hunarwalaa earnings', 'helper wallet Pakistan'],
  alternates: { canonical: 'https://hunarwalaa.com/wallet' },
};

export default function WalletPage() {
    return (
        <main className="bg-gray-50 min-h-screen py-12">
            <WalletDashboard />
        </main>
    );
}
