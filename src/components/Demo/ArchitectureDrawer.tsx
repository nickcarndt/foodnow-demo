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
              FoodNow uses <strong>platform charges with separate transfers</strong>, the recommended
              model for multi-party marketplaces that need control over timing and splits.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Customer pays the platform</li>
              <li>Platform creates Transfer objects to restaurants and couriers</li>
              <li>Transfers grouped by <code className="bg-gray-100 px-1 rounded">transfer_group</code> (order ID)</li>
              <li>Each transfer tied to the funded charge via <code className="bg-gray-100 px-1 rounded">source_transaction</code></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">Why Not Destination Charges?</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li><strong>Multiple recipients:</strong> Destination charges support only one connected account</li>
              <li><strong>Timing control:</strong> Transfers can be delayed or gated on fulfillment or risk</li>
              <li><strong>Disputes:</strong> Platform owns the charge and manages disputes directly</li>
              <li><strong>Flexibility:</strong> Splits can be adjusted post-payment (within Stripe limits)</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">When Funds Move</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li><strong>Charge:</strong> Immediate — funds enter the platform balance</li>
              <li><strong>Transfers:</strong> Created when business conditions are met</li>
              <li><strong>Payouts:</strong> Standard (T+2) or instant if account is eligible</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">Liability & Disputes</p>
            <p className="text-gray-500">
              Platform owns the PaymentIntent and is liable for disputes. If a chargeback occurs,
              funds can be recovered from connected accounts using <code className="bg-gray-100 px-1 rounded">transfer reversals</code>.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
