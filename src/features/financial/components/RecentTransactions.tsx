import { useQuery } from '@tanstack/react-query';
import { fetchRecentTransactions } from '../../financial/api';
import { SkeletonText } from '../../../components/ui/Skeleton';
import { formatCurrency, formatDate } from '../../../lib/format';

export default function RecentTransactions() {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => fetchRecentTransactions(5),
  });

  if (isLoading) {
    return (
      <div className="pl-6 pr-5 py-5 bg-white rounded-[10px] border border-neutral-100 font-['Kumbh_Sans']">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-800 text-lg font-semibold">Recent Transaction</h3>
          <div className="flex items-center gap-1.5 text-teal-600">
            <span className="text-sm font-semibold">View All</span>
            <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_160px_120px_120px] items-center text-xs font-semibold text-gray-400 px-1 ">
          <div>NAME/BUSINESS</div>
          <div>TYPE</div>
          <div>AMOUNT</div>
          <div>DATE</div>
        </div>
        <SkeletonText rows={5} />
      </div>
    );
  }

  const txs = data?.data.transactions ?? [];

  return (
    <div className="pl-6 pr-5 py-5 bg-white rounded-[10px] border border-neutral-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-gray-800 text-lg font-semibold font-['Kumbh_Sans']">Recent Transaction</h3>
        <button className="flex items-center gap-1.5 text-teal-600 hover:opacity-90">
          <span className="text-sm font-semibold font-['Kumbh_Sans']">View All</span>
          <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[minmax(0,1fr)_160px_120px_120px] items-center text-xs font-semibold text-gray-400 pb-5 font-['Kumbh_Sans']">
        <div>NAME/BUSINESS</div>
        <div>TYPE</div>
        <div>AMOUNT</div>
        <div>DATE</div>
      </div>

      <ul className="flex flex-col gap-4">
        {txs.map((t) => (
          <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_160px_120px_120px] items-center gap-4">
            {/* Name/Business */}
            <div className="min-w-0 flex items-center gap-3">
              <img src={t.image} alt="" width={40} height={40} className="h-10 w-10 rounded-[5px] bg-sky-100 object-cover" />
              <div className="truncate">
                <p className="text-gray-800 text-sm font-medium truncate font-['Kumbh_Sans']">{t.name}</p>
                <p className="text-gray-400 text-xs truncate font-['Kumbh_Sans']">{t.business}</p>
              </div>
            </div>
            {/* Type */}
            <div className="text-gray-400 text-sm font-['Kumbh_Sans']">{t.type}</div>
            {/* Amount */}
            <div className="text-gray-800 text-sm font-semibold font-['Kumbh_Sans']">{formatCurrency(t.amount, t.currency)}</div>
            {/* Date */}
            <div className="text-gray-400 text-sm font-['Kumbh_Sans']">{formatDate(t.date)}</div>
          </li>
        ))}
      </ul>

      {txs.length === 0 && (
        <div className="text-sm text-gray-500 px-1 py-4">No recent transactions</div>
      )}
    </div>
  );
}
