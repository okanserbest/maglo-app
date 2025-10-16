import { useAuth } from '../../features/auth/AuthContext';
import { useState } from 'react';
import searchIcon from '../../assets/icons/topBar/search.png';
import notificationIcon from '../../assets/icons/topBar/notification.png';
import profilePicture from '../../assets/icons/topBar/profilePicture.png';

export default function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="h-12 mt-[30px] bg-white flex items-center justify-between px-8">
      <h1 className="text-2xl font-semibold font-kumbh text-[#1B212D]">Dashboard</h1>
      <div className="flex items-center gap-11">
        <div className="flex items-center gap-11">
          <button aria-label="Search" className="h-10 w-10 grid place-items-center rounded-full hover:bg-gray-50">
            <img src={searchIcon} width={24} height={24} alt="" />
          </button>
          <button aria-label="Notifications" className="h-10 w-10 grid place-items-center rounded-full hover:bg-gray-50">
            <img src={notificationIcon} width={24} height={24} alt="" />
          </button>
        </div>
        <div className="w-52 pl-1.5 pr-3.5 py-1.5 bg-neutral-50 rounded-[100px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-9 h-9 rounded-full" src={profilePicture} alt="" />
            <div className="text-sm font-semibold font-kumbh text-[#1B212D] truncate max-w-[8rem]">
              {user?.fullName ?? 'Mahfuzul Nabil'}
            </div>
          </div>
          <button onClick={() => setOpen((v) => !v)} aria-label="Open profile menu" className="h-8 w-8 grid place-items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          {open && (
            <div className="absolute right-8 top-16 w-48 rounded-xl border bg-white shadow-lg p-1 text-sm">
              <button className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50">Profile</button>
              <button className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50">Settings</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
