import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { DemoIndicator } from '@/components/Layout/DemoIndicator';
import { Header } from '@/components/Layout/Header';
import { RecentActivity } from '@/components/Dashboard/RecentActivity';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { RunDemoButton } from '@/components/Demo/RunDemoButton';
import { Card } from '@/components/ui/Card';
import { dashboardHighlights, dashboardStats, featureCards } from '@/lib/demo-data';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DemoIndicator />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-base text-gray-600 mt-2">
            Track demo performance and jump into each Stripe Connect workflow.
          </p>
          <div className="mt-4">
            <RunDemoButton />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {dashboardStats.map((stat) => (
            <StatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              sublabel={stat.sublabel}
            />
          ))}
        </section>

        <section className="grid gap-6 mt-6 md:grid-cols-2">
          {dashboardHighlights.map((stat) => (
            <StatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              sublabel={stat.sublabel}
            />
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Demo Features</h2>
            <p className="text-sm text-gray-500 mt-1">
              Navigate to each flow independently during the presentation.
            </p>
            </div>
            <div className="grid gap-4">
              {featureCards.map((feature, index) => (
                <Link key={feature.id} href={feature.href}>
                  <Card className="flex flex-col gap-2 hover:border-orange-200 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-gray-900">{feature.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-orange-600 font-medium mt-3">{feature.cta} →</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <RecentActivity />
        </section>
      </main>
    </div>
  );
}
