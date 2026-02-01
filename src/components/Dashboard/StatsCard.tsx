import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  label: string;
  value: string;
  sublabel?: ReactNode;
}

export function StatsCard({ label, value, sublabel }: StatsCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {sublabel ? <Badge status="neutral">{sublabel}</Badge> : null}
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </Card>
  );
}
