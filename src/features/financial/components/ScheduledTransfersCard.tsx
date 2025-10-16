import { useQuery } from '@tanstack/react-query';
import { fetchScheduledTransfers } from '../../financial/api';
import { SkeletonText } from '../../../components/ui/Skeleton';
import { formatCurrency, formatDateAt } from '../../../lib/format';
import moreIcon from '../../../assets/icons/scheduledTransfers/ic-expand-more.png';

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function ScheduledTransfersCard() {
  const transfers = useQuery({ queryKey: ['scheduled-transfers'], queryFn: fetchScheduledTransfers });

  return (
    <div className=" mt-8">
      <div className="flex items-center justify-between mb-7">
        <h3 className="font-semibold font-['Kumbh_Sans']">Scheduled Transfers</h3>
        
        <button className="flex items-center text-sm text-emerald-600 hover:underline font-['Kumbh_Sans']">
            View All
            <img src={moreIcon} alt="more" className="w-4 h-4"/>
            </button>
      </div>
      {transfers.isLoading ? (
        <SkeletonText rows={5} />
      ) : (
        <ul className="space-y-4">
          {transfers.data?.data.transfers.map((tr: any) => {
            const imgSrc =  tr.image || '';
            return (
              <li key={tr.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {imgSrc ? (
                    <img src={imgSrc} alt={tr.name || ''} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gray-200 text-gray-600 grid place-items-center text-xs font-semibold">
                      {getInitials(tr.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium font-['Kumbh_Sans']">{tr.name}</p>
                    <p className="text-xs text-gray-500 font-['Kumbh_Sans']">{formatDateAt(tr.date)}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 font-['Kumbh_Sans']">{formatCurrency(tr.amount, tr.currency)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
