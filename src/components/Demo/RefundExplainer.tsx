'use client';

import { useState } from 'react';

export function RefundExplainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">
          💸 Refund Handling (Conceptual)
        </span>
        <span className="text-gray-400 text-sm">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen ? (
        <div className="px-4 pb-4 space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
          <p>
            Refunds in a multi-party marketplace require coordinated reversals:
          </p>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="font-medium text-gray-900">High-level flow:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-500">
              <li>Refund the original charge</li>
              <li>Reverse downstream transfers as needed</li>
              <li>Handle any timing gaps at the platform level</li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800">
              <strong>Important:</strong> If funds have already been paid out, the platform may
              temporarily carry a negative balance or recover via debit, depending on account settings.
            </p>
          </div>

          <p className="text-gray-500 text-xs">
            This demo focuses on the happy path. In production, partial refunds and courier
            compensation require additional business logic, but Stripe provides the primitives.
          </p>
        </div>
      ) : null}
    </div>
  );
}
