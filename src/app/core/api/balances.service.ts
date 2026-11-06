import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { resolveApiBaseUrl } from './api-config';

export type BalanceMember = { userId: string; netMinor: number };
export type SimplifiedPayment = {
  fromUserId: string;
  toUserId: string;
  amountMinor: number;
};

export type GroupBalances = {
  members: BalanceMember[];
  simplified: SimplifiedPayment[];
};

export type DashboardTotals = {
  youOweMinor: number;
  youAreOwedMinor: number;
  overallMinor: number;
};

export type Settlement = {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amountMinor: number;
  note: string;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  groupId: string;
  groupName: string | null;
  actorId: string;
  actorName: string | null;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class BalancesApiService {
  private readonly http = inject(HttpClient);

  private get base(): string {
    return resolveApiBaseUrl();
  }

  dashboard(): Promise<DashboardTotals> {
    return firstValueFrom(this.http.get<DashboardTotals>(`${this.base}/dashboard`));
  }

  balances(groupId: string): Promise<GroupBalances> {
    return firstValueFrom(this.http.get<GroupBalances>(`${this.base}/groups/${groupId}/balances`));
  }

  createSettlement(
    groupId: string,
    body: { fromUserId: string; toUserId: string; amountMinor: number; note?: string },
  ): Promise<Settlement> {
    return firstValueFrom(this.http.post<Settlement>(`${this.base}/groups/${groupId}/settlements`, body));
  }

  activity(limit = 20): Promise<{ items: ActivityItem[] }> {
    return firstValueFrom(
      this.http.get<{ items: ActivityItem[] }>(`${this.base}/activity`, {
        params: { limit: String(limit) },
      }),
    );
  }

  friends(): Promise<{ items: { userId: string; name: string; sharedGroupCount: number }[] }> {
    return firstValueFrom(
      this.http.get<{ items: { userId: string; name: string; sharedGroupCount: number }[] }>(`${this.base}/friends`),
    );
  }
}
