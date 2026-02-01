import type { DashboardStat, DemoAccounts, FeatureCard, NavItem, OrderItem, OrderBreakdown } from '@/types';

const restaurantAccountId =
  process.env.NEXT_PUBLIC_DEMO_RESTAURANT_ACCOUNT_ID || 'acct_demo_restaurant_001';
const courierAccountId =
  process.env.NEXT_PUBLIC_DEMO_COURIER_ACCOUNT_ID || 'acct_demo_courier_001';

export const demoAccounts: DemoAccounts = {
  restaurantAccountId,
  courierAccountId,
};

export const dashboardStats: DashboardStat[] = [
  {
    id: 'revenue',
    label: 'GMV processed',
    value: '$124.5K',
    sublabel: '(demo)',
  },
  {
    id: 'orders',
    label: 'Orders',
    value: '1,562',
    sublabel: '(demo)',
  },
  {
    id: 'authRate',
    label: 'Authorization rate (simulated)',
    value: 'Strong',
  },
];

export const dashboardHighlights = [
  {
    id: 'restaurants',
    label: 'Restaurants',
    value: '45',
    sublabel: '(demo)',
  },
  {
    id: 'couriers',
    label: 'Couriers',
    value: '128',
    sublabel: '(demo)',
  },
];

export const featureCards: FeatureCard[] = [
  {
    id: 'onboarding',
    title: 'Express Onboarding',
    description: 'Start onboarding restaurants and couriers.',
    href: '/onboarding',
    cta: 'Start Express onboarding',
  },
  {
    id: 'checkout',
    title: 'Checkout & Splits',
    description: 'Process a payment with multi-party transfers.',
    href: '/checkout',
    cta: 'Process a payment',
  },
  {
    id: 'fraud',
    title: 'Radar Fraud Rules',
    description: 'Show how Radar blocks risky transactions.',
    href: '/fraud',
    cta: 'View Radar rules',
  },
  {
    id: 'payouts',
    title: 'Instant Payouts',
    description: 'Simulate fast payouts for couriers.',
    href: '/payouts',
    cta: 'Instant payout demo',
  },
];

export const headerNavItems: NavItem[] = [
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Checkout', href: '/checkout' },
  { label: 'Fraud', href: '/fraud' },
  { label: 'Payouts', href: '/payouts' },
];

export const demoOrderItems: OrderItem[] = [
  { id: 'item_pepperoni', name: "Mario's Pizza — Large Pepperoni", price: 2200 },
  { id: 'item_delivery', name: 'Delivery Fee', price: 300 },
];

export const demoOrderId = 'order_demo_001';

export const demoOrderBreakdown: OrderBreakdown = {
  total: 2500,
  platformFee: 375,
  restaurantAmount: 1875,
  courierAmount: 250,
};
