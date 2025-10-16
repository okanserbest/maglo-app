import { NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAuth } from '../../features/auth/AuthContext';
import dashboardIcon from '../../assets/icons/sider/Dashboard.png';
import transactionsIcon from '../../assets/icons/sider/Transactions.png';
import invoicesIcon from '../../assets/icons/sider/Invoices.png';
import walletsIcon from '../../assets/icons/sider/MyWallets.png';
import settingsIcon from '../../assets/icons/sider/Settings.png';
import helpIcon from '../../assets/icons/sider/Help.png';
import logoutIcon from '../../assets/icons/sider/Logout.png';
import LogoIcon from '../../assets/icons/Exclude.png';
// Using PNG icons directly (PDF wrapper removed)

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-[#FAFAFA] min-h-screen px-6 pt-7 pb-24">
      <div className="flex items-center mb-6 ">
        <div className="w-[30px] h-[30px] mr-2">
          <img src={LogoIcon} width={30} height={30} alt="Maglo" className="" />
        </div>
        <div
          className="h-6 flex items-center font-bold text-lg font-['Gordita']"
          style={{ color: '#1B212D' }}
        >
          Maglo.
        </div>
      </div>
      <div className="flex-1 mt-10 flex flex-col justify-between">
        <nav className="flex flex-col gap-0.5">
          {[
            { to: '/dashboard', label: 'Dashboard', icon: dashboardIcon },
            { to: '/transactions', label: 'Transactions', icon: transactionsIcon, disabled: true },
            { to: '/invoices', label: 'Invoices', icon: invoicesIcon, disabled: true },
            { to: '/wallets', label: 'My Wallets', icon: walletsIcon, disabled: true },
            { to: '/settings', label: 'Settings', icon: settingsIcon, disabled: true },
          ].map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                classNames(
                  'w-48 pl-4 pr-20 py-3 rounded-lg inline-flex items-center gap-3',
                  'font-kumbh text-sm',
                  isActive
                    ? 'bg-[#C8EE44] text-[#1B212D] font-semibold'
                    : 'text-[#929EAE] font-medium hover:bg-gray-100',
                  l.disabled && 'pointer-events-none opacity-50'
                )
              }
            >
              <img src={l.icon} width={20} height={20} alt="" className="shrink-0" />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-0.5 mt-24">
          {[
            { label: 'Help', icon: helpIcon },
            { label: 'Logout', icon: logoutIcon },
          ].map((l) => (
            <button
              key={l.label}
              onClick={() => {
                if (l.label === 'Logout') {
                  logout().finally(() => navigate('/signin', { replace: true }));
                }
              }}
              className={classNames(
                'w-48 pl-4 pr-20 py-3 rounded-lg inline-flex items-center gap-3',
                'text-[#929EAE] font-kumbh text-sm font-medium hover:bg-gray-100'
              )}
            >
              <img src={l.icon} width={20} height={20} alt="" className="shrink-0" />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
