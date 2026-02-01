export type AccountType = 'restaurant' | 'courier';

export interface DemoAccounts {
  restaurantAccountId: string;
  courierAccountId: string;
}

export interface DashboardStat {
  id: 'revenue' | 'orders' | 'authRate';
  label: string;
  value: string;
  sublabel?: string;
}

export interface FeatureCard {
  id: 'onboarding' | 'checkout' | 'fraud' | 'payouts';
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CreateConnectAccountRequest {
  accountType: AccountType;
  email: string;
  businessName: string;
}

export interface CreateConnectAccountResponse {
  success: boolean;
  accountId: string;
  onboardingUrl: string;
  fallback?: boolean;
  message?: string;
}

export interface CheckAccountRequest {
  accountId: string;
}

export interface CheckAccountResponse {
  success: boolean;
  accountId: string;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  detailsSubmitted: boolean;
  fallback?: boolean;
  message?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderBreakdown {
  total: number;
  platformFee: number;
  restaurantAmount: number;
  courierAmount: number;
}

export interface CreatePaymentRequest {
  amount: number;
  paymentMethodMode?: 'card' | 'automatic';
}

export interface CreatePaymentResponse {
  success: boolean;
  clientSecret: string;
  paymentIntentId: string;
  breakdown: OrderBreakdown;
  fallback?: boolean;
  message?: string;
}

export interface CreateTransfersRequest {
  paymentIntentId: string;
  restaurantAccountId: string;
  courierAccountId: string;
  restaurantAmount: number;
  courierAmount: number;
  orderId: string;
}

export interface CreateTransfersResponse {
  success: boolean;
  restaurantTransferId: string;
  courierTransferId: string;
  fallback?: boolean;
  message?: string;
}
