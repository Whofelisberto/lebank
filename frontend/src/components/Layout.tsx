import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Navbar />
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
