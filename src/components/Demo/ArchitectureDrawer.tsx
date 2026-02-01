'use client';

import { useState } from 'react';

export function ArchitectureDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">
          🏗️ Architecture Deep Dive
        </span>
        <span className="text-gray-400 text-sm">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen ? (
        <div className="px-4 pb-4 space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
          <div>
            <p className="font-semibold text-gray-900 mb-2">Charge Model: Separate Charges & Transfers</p>
            <p className="mb-2">
              FoodNow uses <strong>platform charges with separate transfers</strong> — the recommended
              model for multi-party marketplaces where the platform needs flexibility.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Customer pays the platform directly</li>
              <li>Platform creates separate Transfer objects to each connected account</li>
              <li>Transfers linked via <code className="bg-gray-100 px-1 rounded">transfer_group</code></li>
              <li>Each transfer includes <code className="bg-gray-100 px-1 rounded">source_transaction</code> for traceability</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">Why Not Destination Charges?</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li><strong>Multiple recipients:</strong> Destination charges only support one recipient</li>
              <li><strong>Timing control:</strong> Transfers can be delayed or gated by business logic</li>
              <li><strong>Dispute handling:</strong> Platform owns the charge and handles disputes</li>
              <li><strong>Flexibility:</strong> Can adjust splits after payment (within limits)</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">When Funds Move</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li><strong>Charge:</strong> Immediate — funds land in platform's Stripe balance</li>
              <li><strong>Transfers:</strong> Immediate — moves from platform balance to connected account</li>
              <li><strong>Payouts:</strong> T+2 standard, or instant (with fee) if enabled</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">Liability & Disputes</p>
            <p className="text-gray-500">
              Platform owns the PaymentIntent and is responsible for disputes. If a chargeback occurs,
              the platform can recover funds from connected accounts via <code className="bg-gray-100 px-1 rounded">transfer reversals</code>.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
