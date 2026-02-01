import { Card } from '@/components/ui/Card';

const activity = [
  {
    id: 'activity_1',
    title: 'Mario’s Pizza completed onboarding',
    detail: 'Express account ready for payouts.',
    time: 'Just now',
  },
  {
    id: 'activity_2',
    title: "Mario's Pizza order paid",
    detail: 'Transfers queued to restaurant + courier.',
    time: '5 min ago',
  },
  {
    id: 'activity_3',
    title: 'Radar blocked a risky charge',
    detail: 'High risk score, low amount.',
    time: '15 min ago',
  },
  {
    id: 'activity_4',
    title: 'Instant payout simulated',
    detail: 'Courier cash-out confirmed in demo.',
    time: '20 min ago',
  },
];

export function RecentActivity() {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">What you’ll see</h3>
        <p className="text-sm text-gray-500">Sample activity once the demo starts.</p>
      </div>
      <div className="space-y-3">
        {activity.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
              </div>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
