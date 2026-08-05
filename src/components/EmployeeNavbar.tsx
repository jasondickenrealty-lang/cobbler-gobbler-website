'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const employeeLinks = [
  { href: '/employee/dashboard', label: 'Dashboard' },
  { href: '/employee/schedule', label: 'Schedule' },
  { href: '/employee/announcements', label: 'Announcements' },
  { href: '/employee/contest-signups', label: 'Contest Signups' },
];

export default function EmployeeNavbar() {
  const pathname = usePathname();
  const { signOut, userData } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Link href="/employee/dashboard" className="text-xl font-bold shrink-0">
            🍨 Employee Portal
          </Link>

          {/* Desktop nav links */}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-sm capitalize">{userData?.role}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex min-h-[44px] items-center rounded bg-red-600 px-3 py-2 text-sm transition hover:bg-red-700"
            >
              Sign Out
            </button>
            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden flex h-11 w-11 flex-col items-center justify-center gap-1 rounded hover:bg-white/10 transition"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen ? 'true' : 'false'}
            >
              <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${mobileOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${mobileOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 bg-primary">
          <div className="px-4 py-3 space-y-1">
            {employeeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block min-h-[44px] px-3 py-3 rounded-lg text-sm font-medium transition hover:bg-white/10 ${
                  pathname === link.href ? 'bg-white/20' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-1 border-t border-white/20 px-3 text-xs text-white/50 capitalize">
              {userData?.role}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
