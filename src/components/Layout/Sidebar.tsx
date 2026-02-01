import Link from 'next/link';

import { headerNavItems } from '@/lib/demo-data';

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-60 border-r border-gray-200 bg-white px-4 py-6">
      <p className="text-xs font-semibold uppercase text-gray-400 mb-3">Demo Features</p>
      <nav className="space-y-2">
        {headerNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
