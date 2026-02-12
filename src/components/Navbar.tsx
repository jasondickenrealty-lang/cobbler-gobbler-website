'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/location', label: 'Hours & Location' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            🍨 Cobbler Gobbler
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
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
          
          <Link
            href="/employee/login"
            className="bg-accent px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            Employee Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
