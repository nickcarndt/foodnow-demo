import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface MoneyFlowProps {
  total: number;
  platformFee: number;
  restaurantAmount: number;
  courierAmount: number;
}

const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

export function MoneyFlow({
  total,
  platformFee,
  restaurantAmount,
  courierAmount,
}: MoneyFlowProps) {
  return (
    <Card className="space-y-4">
      <p className="text-sm font-semibold text-gray-900">Money Flow</p>
      <div className="grid gap-3 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Customer pays</span>
          <span className="font-medium text-gray-900">{formatCurrency(total)}</span>
        </div>
        <div className="text-center text-gray-400">↓</div>
        <div className="flex items-center justify-between">
          <span>Platform (FoodNow)</span>
          <Badge status="info">Receives full charge</Badge>
        </div>
        <div className="text-center text-gray-400">↓</div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span>Transfer to Mario's Pizza</span>
            <span className="font-medium text-gray-900">{formatCurrency(restaurantAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Transfer to Alex (courier)</span>
            <span className="font-medium text-gray-900">{formatCurrency(courierAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Platform keeps</span>
            <span className="font-medium text-gray-900">{formatCurrency(platformFee)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
