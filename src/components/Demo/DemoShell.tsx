'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { KeyboardShortcuts } from '@/components/Demo/KeyboardShortcuts';
import { LogPanel } from '@/components/Demo/LogPanel';

interface DemoShellProps {
  children: ReactNode;
}

export function DemoShell({ children }: DemoShellProps) {
  const [isLogOpen, setIsLogOpen] = useState(false);

  const handleToggleLogs = useCallback(() => {
    setIsLogOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const hideDevArtifacts = () => {
      document
        .querySelectorAll(
          'button[aria-label="Open Next.js Dev Tools"], button[title="Open Next.js Dev Tools"]',
        )
        .forEach((node) => node.parentElement?.removeChild(node));

      document
        .querySelectorAll(
          'iframe[title="Stripe developer tools frame"], button[title="Open Stripe Developer Tools"]',
        )
        .forEach((node) => node.parentElement?.removeChild(node));

      document
        .querySelectorAll('nextjs-portal, [data-nextjs-devtools], [data-nextjs-devtools-overlay]')
        .forEach((node) => node.parentElement?.removeChild(node));

      document.querySelectorAll('button').forEach((node) => {
        const text = node.textContent?.trim() || '';
        const label = node.getAttribute('aria-label') || '';
        const title = node.getAttribute('title') || '';
        if (
          text === 'N' ||
          text.includes('Next.js') ||
          label.includes('Next.js') ||
          title.includes('Next.js')
        ) {
          node.parentElement?.removeChild(node);
        }
      });
    };

    hideDevArtifacts();

    const observer = new MutationObserver(hideDevArtifacts);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <KeyboardShortcuts onToggleLogs={handleToggleLogs} />
      {children}
      <LogPanel isOpen={isLogOpen} onToggle={handleToggleLogs} />
    </>
  );
}
