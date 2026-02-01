import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ReturnClient } from './return-client';

function ReturnFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <LoadingSpinner />
        Loading onboarding details...
      </div>
    </div>
  );
}

export default function OnboardingReturnPage() {
  return (
    <Suspense fallback={<ReturnFallback />}>
      <ReturnClient />
    </Suspense>
  );
}
