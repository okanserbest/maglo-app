import { useQuery } from '@tanstack/react-query';
import { fetchFinancialSummary } from '../../financial/api';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatCurrency } from '../../../lib/format';
import walletGreen from '../../../assets/icons/cards/wallet-green.png';
import walletGray from '../../../assets/icons/cards/wallet-gray.png';
import toast from 'react-hot-toast';

export default function SummaryCards() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: fetchFinancialSummary,
  });

  if (isError) toast.error((error as any)?.message ?? 'Failed to load summary');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  const s = data?.data;
  if (!data?.success || !s) {
    toast.error('Summary data is unavailable');
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  console.log("s",s);
  const cards = [
    { key: 'balance', label: 'Total balance', value: s.totalBalance?.amount, c: s.totalBalance?.currency },
    { key: 'spending', label: 'Total spending', value: s.totalExpense?.amount, c: s.totalExpense?.currency },
    { key: 'saved', label: 'Total saved', value: s.totalSavings?.amount, c: s.totalSavings?.currency },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div
          key={card.label}
          className={
            'rounded-[10px] px-5 py-6 flex items-center gap-3.5  ' +
            (idx === 0 ? 'bg-neutral-700 text-white' : 'bg-stone-50')
          }
        >
          <div className="relative w-10 h-10">
            <div className={idx === 0 ? 'absolute inset-0 bg-zinc-600 rounded-full' : 'absolute inset-0 bg-stone-200 rounded-full'} />
            <img
              src={idx === 0 ? walletGreen : walletGray}
              width={20}
              height={20}
              alt=""
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <div className={idx === 0 ? 'text-gray-400 text-sm font-normal font-["Kumbh_Sans"]' : 'text-gray-400 text-sm font-normal font-["Kumbh_Sans"]'}>
              {card.label}
            </div>
            <div className={idx === 0 ? 'text-white text-2xl font-bold font-["Kumbh_Sans"]' : 'text-gray-800 text-2xl font-bold font-["Kumbh_Sans"]'}>
              {card.value != null && card.c ? formatCurrency(card.value, card.c) : '—'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
