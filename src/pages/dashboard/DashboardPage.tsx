import SummaryCards from '../../features/financial/components/SummaryCards';
// import WalletCard from '../../features/financial/components/WalletCard';
import WorkingCapitalChart from '../../features/financial/components/WorkingCapitalChart';
import RecentTransactions from '../../features/financial/components/RecentTransactions';
import RightPanel from '../../features/financial/components/RightPanel';

export default function DashboardPage() {
  return (
    <div className="space-y-6 xl:space-y-8">
      <div className="grid gap-[40px]" style={{ gridTemplateColumns: '1fr 354px' }}>
        <div className='flex flex-col gap-[40px]'>
          <SummaryCards />
          <WorkingCapitalChart />
          <RecentTransactions />
        </div>
        <div>
          
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
