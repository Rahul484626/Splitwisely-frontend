import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ViewWillEnter } from '@ionic/angular';
import { IonContent } from '@ionic/angular';

import type { ApiErrorBody, GroupSummary } from '../../core/api/api.types';
import { BalancesApiService, type ActivityItem, type DashboardTotals } from '../../core/api/balances.service';
import { GroupsApiService } from '../../core/api/groups.service';
import { AuthService } from '../../core/auth/auth.service';
import { GlassCardComponent } from '../../shared/glass-card/glass-card.component';
import { balanceCaption, balanceTone, formatMinor } from '../../shared/money';
import { StateMessageComponent } from '../../shared/state-message/state-message.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [IonContent, RouterLink, GlassCardComponent, StateMessageComponent],
})
export class DashboardPage implements ViewWillEnter {
  readonly auth = inject(AuthService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly balancesApi = inject(BalancesApiService);

  readonly totals = signal<DashboardTotals | null>(null);
  readonly groups = signal<GroupSummary[]>([]);
  readonly activity = signal<ActivityItem[]>([]);
  readonly error = signal('');
  readonly loading = signal(true);

  readonly formatMinor = formatMinor;
  readonly balanceCaption = balanceCaption;
  readonly balanceTone = balanceTone;

  ionViewWillEnter(): void {
    void this.auth.loadMe().then(() => this.reload());
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const [totals, groups, activity] = await Promise.all([
        this.balancesApi.dashboard(),
        this.groupsApi.list(),
        this.balancesApi.activity(8),
      ]);
      this.totals.set(totals);
      this.groups.set(groups.items);
      this.activity.set(activity.items);
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.loading.set(false);
    }
  }

  activityLabel(item: ActivityItem): string {
    const actor = item.actorName ?? 'Someone';
    switch (item.type) {
      case 'expense.created':
        return `${actor} added an expense`;
      case 'expense.deleted':
        return `${actor} deleted an expense`;
      case 'settlement.created':
        return `${actor} recorded a settlement`;
      case 'member.added':
        return `${actor} added a member`;
      case 'group.created':
        return `${actor} created a group`;
      default:
        return `${actor}: ${item.type}`;
    }
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiErrorBody | undefined;
      return body?.error?.message ?? 'Could not load dashboard';
    }
    return 'Could not load dashboard';
  }
}
