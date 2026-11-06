import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { resolveApiBaseUrl } from './api-config';

export type ExpenseSplit = {
  userId: string;
  shareMinor: number;
};

export type Expense = {
  id: string;
  groupId: string;
  description: string;
  amountMinor: number;
  currency: string;
  paidBy: string;
  splitType: 'equal' | 'exact' | 'percentage' | 'shares';
  splits: ExpenseSplit[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateExpenseInput = {
  description: string;
  amountMinor: number;
  paidBy: string;
  splitType: Expense['splitType'];
  participants?: string[];
  splits?: {
    userId: string;
    shareMinor?: number;
    percentage?: number;
    shares?: number;
  }[];
};

@Injectable({ providedIn: 'root' })
export class ExpensesApiService {
  private readonly http = inject(HttpClient);

  private get base(): string {
    return resolveApiBaseUrl();
  }

  list(groupId: string): Promise<{ items: Expense[] }> {
    return firstValueFrom(this.http.get<{ items: Expense[] }>(`${this.base}/groups/${groupId}/expenses`));
  }

  create(groupId: string, body: CreateExpenseInput): Promise<Expense> {
    return firstValueFrom(this.http.post<Expense>(`${this.base}/groups/${groupId}/expenses`, body));
  }

  softDelete(groupId: string, expenseId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/groups/${groupId}/expenses/${expenseId}`));
  }
}
