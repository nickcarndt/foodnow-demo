'use client';

import { useState } from 'react';

export function DemoIndicator() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-yellow-100 text-yellow-800 py-2 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <span>🧪 DEMO MODE — Using Stripe Test Environment</span>
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-xs text-yellow-900/80 hover:text-yellow-900 underline"
        >
          Details
        </button>
      </div>
      {showDetails ? (
        <div className="max-w-6xl mx-auto px-4 mt-2 text-xs text-yellow-900/80 space-y-1">
          <p>• Keys: Stripe test mode only</p>
          <p>• Instant payouts: UI simulation</p>
          <p>• Metrics: demo-only, directional</p>
          <p>• Objects: Account, AccountLink, PaymentIntent, Transfer (demo)</p>
        </div>
      ) : null}
    </div>
  );
}
