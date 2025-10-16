import { api } from '../../lib/api';
import type {
  FinancialSummaryResponse,
  WorkingCapitalResponse,
  WalletResponse,
  RecentTransactionsResponse,
  ScheduledTransfersResponse,
} from '../../types/financial';

export async function fetchFinancialSummary() {
  const res = await api.get<FinancialSummaryResponse>('/financial/summary');
  return res.data;
}

export async function fetchWorkingCapital() {
  const res = await api.get<WorkingCapitalResponse>('/financial/working-capital');
  return res.data;
}

export async function fetchWalletCards() {
  const res = await api.get<WalletResponse>('/financial/wallet');
  return res.data;
}

export async function fetchRecentTransactions(limit = 20) {
  const res = await api.get<RecentTransactionsResponse>('/financial/transactions/recent', {
    params: { limit },
  });
  return res.data;
}

export async function fetchScheduledTransfers() {
  const res = await api.get<ScheduledTransfersResponse>('/financial/transfers/scheduled');
  return res.data;
}
