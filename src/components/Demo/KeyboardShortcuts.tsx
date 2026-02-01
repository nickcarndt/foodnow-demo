'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { logger } from '@/lib/logger';

interface KeyboardShortcutsProps {
  onToggleLogs: () => void;
}

export function KeyboardShortcuts({ onToggleLogs }: KeyboardShortcutsProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;
      if (!isMeta) return;

      if (event.key.toLowerCase() === 'l') {
        event.preventDefault();
        onToggleLogs();
      }

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        logger.clear();
        router.push('/');
      }

      if (event.key === '1') {
        event.preventDefault();
        router.push('/onboarding');
      }

      if (event.key === '2') {
        event.preventDefault();
        router.push('/checkout');
      }

      if (event.key === '3') {
        event.preventDefault();
        router.push('/fraud');
      }

      if (event.key === '4') {
        event.preventDefault();
        router.push('/payouts');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleLogs, router]);

  return null;
}
