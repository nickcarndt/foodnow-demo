import type { DemoAccounts } from '@/types';
import { demoAccounts } from '@/lib/demo-data';

const STORAGE_KEY = 'foodnow_demo_accounts';

export function getStoredAccounts(): DemoAccounts {
  if (typeof window === 'undefined') {
    return demoAccounts;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return demoAccounts;

  try {
    const parsed = JSON.parse(raw) as DemoAccounts;
    if (!parsed?.restaurantAccountId || !parsed?.courierAccountId) {
      return demoAccounts;
    }
    return parsed;
  } catch {
    return demoAccounts;
  }
}

export function setStoredAccounts(accounts: DemoAccounts) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}
