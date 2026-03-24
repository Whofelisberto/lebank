import { ArrowLeftRight, LayoutDashboard, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transações', icon: ArrowLeftRight },
];

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <aside className="bg-white border-b border-slate-200 md:border-b-0 md:border-r md:w-64 md:min-h-screen md:shrink-0 md:flex md:flex-col">

      <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-slate-200 sm:px-6 md:justify-start md:py-5">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">LB</span>
        </div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">LeBank</span>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors md:hidden"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>


      <nav className="px-3 py-3 flex gap-2 overflow-x-auto md:flex-1 md:py-4 md:space-y-1 md:block">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:gap-3 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>


      <div className="hidden px-3 pb-4 border-t border-slate-200 pt-4 md:block">
        <div className="flex items-center gap-3 px-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 text-xs font-semibold uppercase">
              {user?.username?.[0] ?? 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </aside>
  );
}
