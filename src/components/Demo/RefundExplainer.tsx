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
          💸 How Refunds Would Work
        </span>
        <span className="text-gray-400 text-sm">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen ? (
        <div className="px-4 pb-4 space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
          <p>
            In production, refunds in a multi-party system require coordinated reversals:
          </p>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="font-medium text-gray-900">Full refund flow:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-500">
              <li>Create a <code className="bg-gray-100 px-1 rounded">Refund</code> on the original PaymentIntent</li>
              <li>Create <code className="bg-gray-100 px-1 rounded">Transfer Reversals</code> to recover funds from connected accounts</li>
              <li>Platform absorbs any payout timing gaps</li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800">
              <strong>Key consideration:</strong> If funds have already been paid out to connected
              accounts, the platform may need to recover via negative balance or debit.
            </p>
          </div>

          <p className="text-gray-500 text-xs">
            This demo focuses on the happy path. Refund handling is straightforward via the API
            but requires business logic for partial refunds and courier compensation.
          </p>
        </div>
      ) : null}
    </div>
  );
}
