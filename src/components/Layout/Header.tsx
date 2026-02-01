import Link from 'next/link';

import { headerNavItems } from '@/lib/demo-data';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img
            src="/foodnow-logo.svg"
            alt="FoodNow logo"
            className="h-10 w-10 rounded-xl border border-gray-200 bg-white p-1"
          />
          <div>
            <p className="text-lg font-semibold text-gray-900">FoodNow Dashboard</p>
            <p className="text-sm text-gray-500">Stripe Connect demo</p>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm text-gray-600">
          {headerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
