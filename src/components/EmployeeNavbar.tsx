'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const employeeLinks = [
  { href: '/employee/dashboard', label: 'Dashboard' },
  { href: '/employee/schedule', label: 'Schedule' },
  { href: '/employee/announcements', label: 'Announcements' },
];

export default function EmployeeNavbar() {
  const pathname = usePathname();
  const { signOut, userData } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/employee/dashboard" className="text-2xl font-bold">
            🍨 Employee Portal
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {employeeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-secondary transition ${
                  pathname === link.href ? 'text-secondary' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm capitalize">{userData?.role}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
