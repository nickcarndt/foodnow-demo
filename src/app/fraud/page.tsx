'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Eye, Zap, Globe } from 'lucide-react';

import { DemoIndicator } from '@/components/Layout/DemoIndicator';
import { Header } from '@/components/Layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { pushClientLog } from '@/lib/client-logs';

const radarRules = [
  {
    name: 'Block Card Testing',
    rule: 'Block if :risk_score: > 75 AND :amount_in_usd: < 10',
    description: 'Blocks small transactions from high-risk cards (card testing pattern)',
    icon: Shield,
  },
  {
    name: 'Review New Large Orders',
    rule: 'Review if :is_new_customer: AND :amount_in_usd: > 100',
    description: 'Flags large orders from first-time customers for manual review',
    icon: Eye,
  },
  {
    name: 'Block Velocity Abuse',
    rule: 'Block if :charges_per_email_hourly: > 5',
    description: 'Prevents promo abuse and automated fraud attacks',
    icon: Zap,
  },
  {
    name: 'Block Geographic Mismatch',
    rule: 'Block if :ip_country: != :card_country:',
    description: "Blocks transactions where IP location doesn't match card origin",
    icon: Globe,
  },
];

const simulatedTransactions = [
  {
    id: 'txn_001',
    amount: 8.5,
    riskScore: 82,
    email: 'test123@tempmail.com',
    isNewCustomer: true,
    status: 'blocked',
    reason: 'Block Card Testing rule triggered (risk_score: 82, amount: $8.50)',
  },
  {
    id: 'txn_002',
    amount: 24.99,
    riskScore: 12,
    email: 'john.smith@gmail.com',
    isNewCustomer: false,
    status: 'allowed',
    reason: 'Low risk score, returning customer',
  },
  {
    id: 'txn_003',
    amount: 156.0,
    riskScore: 45,
    email: 'new.user@company.com',
    isNewCustomer: true,
    status: 'review',
    reason: 'Review New Large Orders rule triggered (new customer, $156.00)',
  },
];

const statusBadge: Record<string, 'success' | 'error' | 'warning'> = {
  allowed: 'success',
  blocked: 'error',
  review: 'warning',
};

export default function FraudPage() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setVisibleCount(0);
    pushClientLog('info', 'Fraud simulation started');

    simulatedTransactions.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCount((prev) => Math.max(prev, index + 1));
        if (index === simulatedTransactions.length - 1) {
          setIsRunning(false);
          pushClientLog('success', 'Fraud simulation completed');
        }
      }, 600 * (index + 1));
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoIndicator />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Radar Fraud Rules</h1>
          <p className="text-base text-gray-600 mt-2">
            Protect FoodNow from common fraud patterns with configurable rules.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Stripe: Radar • Objects: Demo rules (no Stripe API calls)
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Rules</h2>
            <p className="text-xs text-gray-500">
              Example rule logic (demo simulation). Production Radar uses additional signals.
            </p>
            <div className="space-y-4">
              {radarRules.map((rule) => {
                const Icon = rule.icon;
                return (
                  <div key={rule.name} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Icon className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{rule.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{rule.rule}</p>
                        <p className="text-sm text-gray-600 mt-2">{rule.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Transaction Simulator</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Run example transactions to show Radar decisions.
                </p>
              </div>
              <Button onClick={handleRunSimulation} loading={isRunning}>
                Run Simulation
              </Button>
            </div>

            <div className="space-y-3">
              {simulatedTransactions.slice(0, visibleCount).map((txn) => (
                <div
                  key={txn.id}
                  className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        ${txn.amount.toFixed(2)} · risk {txn.riskScore}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{txn.email}</p>
                    </div>
                    <Badge status={statusBadge[txn.status]}>{txn.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{txn.reason}</p>
                </div>
              ))}
              {visibleCount === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  Click &quot;Run Simulation&quot; to evaluate transactions.
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
