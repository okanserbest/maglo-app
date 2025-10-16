import { useQuery } from '@tanstack/react-query';
import { fetchWalletCards } from '../../financial/api';
import { Skeleton } from '../../../components/ui/Skeleton';
import { maskCardNumber } from '../../../lib/format';

export default function WalletCard() {
  const wallet = useQuery({ queryKey: ['wallet-cards'], queryFn: fetchWalletCards });

  return (
    <div className="rounded-2xl overflow-hidden shadow-card">
      {wallet.isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-5">
          <p className="text-sm opacity-80">Wallet</p>
          <p className="text-lg font-semibold mt-6">
            {wallet.data?.data.cards[0]?.name ?? 'Maglo Card'}
          </p>
          <p className="mt-2 tracking-widest">
            {maskCardNumber(wallet.data?.data.cards[0]?.cardNumber ?? '5495 7381 3759 2321')}
          </p>
        </div>
      )}
    </div>
  );
}
