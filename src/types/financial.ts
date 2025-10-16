export type Trend = 'up' | 'down' | 'flat';

export interface AmountChange {
  percentage: number;
  trend: Trend;
}

export interface MoneySummary {
  amount: number;
  currency: string; // e.g. TRY, USD
  change?: AmountChange;
}

export interface FinancialSummaryResponse {
  success: boolean;
  message: string;
  data: {
    totalBalance: MoneySummary;
    totalExpense: MoneySummary;
    totalSavings: MoneySummary;
  };
}

export interface WorkingCapitalPoint {
  month: string; // e.g. 'Ocak'
  income: number;
  expense: number;
  net: number;
}

export interface WorkingCapitalResponse {
  success: boolean;
  message: string;
  data: {
    period: string; // last6Months
    currency: string;
    data: WorkingCapitalPoint[];
    summary: { totalIncome: number; totalExpense: number; netBalance: number };
  };
}

export interface WalletCard {
  id: string;
  name: string;
  type: 'credit' | 'debit';
  cardNumber: string; // may be masked
  bank: string;
  network: 'visa' | 'mastercard' | 'amex' | string;
  expiryMonth: number;
  expiryYear: number;
  color?: string;
  isDefault?: boolean;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: {
    cards: WalletCard[];
  };
}

export interface TransactionItem {
  id: string;
  name: string;
  business: string;
  image?: string;
  type: string;
  amount: number;
  currency: string;
  date: string; // ISO
  status: 'completed' | 'pending' | string;
}

export interface RecentTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: TransactionItem[];
  };
}

export interface ScheduledTransfer {
  id: string;
  name: string;
  image?: string;
  date: string; // ISO
  amount: number;
  currency: string;
  status: 'Scheduled' | string;
}

export interface ScheduledTransfersResponse {
  success: boolean;
  message: string;
  data: {
    transfers: ScheduledTransfer[];
    summary?: { totalScheduledAmount: number; count: number };
  };
}
