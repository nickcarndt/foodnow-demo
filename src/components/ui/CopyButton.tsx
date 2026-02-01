'use client';

import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-full px-2 py-0.5"
    >
      {copied ? 'Copied' : label}
    </button>
  );
}
