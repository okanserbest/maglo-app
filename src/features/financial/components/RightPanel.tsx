import { useQuery } from '@tanstack/react-query';
import { fetchWalletCards } from '../../financial/api';
import { Skeleton } from '../../../components/ui/Skeleton';
import WalletMiniCard from './WalletMiniCard';
import ScheduledTransfersCard from './ScheduledTransfersCard';

export default function RightPanel() {
  const wallet = useQuery({ queryKey: ['wallet-cards'], queryFn: fetchWalletCards });
  return (
    <aside className="space-y-5">
      <div className="rounded-2xl overflow-hidden shadow-card">
        {wallet.isLoading ? (
          <Skeleton className="h-[340px]" />
        ) : (
          <WalletMiniCard
            cards={wallet.data?.data.cards?.slice(0, 2).map((c: any) => ({
              name: c?.name,
              bank: c?.bank,
              bankLabel: c?.bankLabel,
              cardNumber: c?.cardNumber,
              expiry: c?.expiry,
              brand: c?.brand,
            }))}
          />
        )}
      </div>

      <ScheduledTransfersCard />
    </aside>
  );
}
