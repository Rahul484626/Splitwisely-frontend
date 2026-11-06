import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import type { ApiErrorBody } from '../../core/api/api.types';
import { BalancesApiService, type ActivityItem } from '../../core/api/balances.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  imports: [IonContent, RouterLink, DatePipe],
})
export class ActivityPage implements OnInit {
  private readonly balancesApi = inject(BalancesApiService);

  readonly items = signal<ActivityItem[]>([]);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    try {
      const res = await this.balancesApi.activity(50);
      this.items.set(res.items);
    } catch (err) {
      this.error.set(this.readError(err));
    }
  }

  label(item: ActivityItem): string {
    const actor = item.actorName ?? 'Someone';
    switch (item.type) {
      case 'expense.created':
        return `${actor} added an expense`;
      case 'expense.updated':
        return `${actor} updated an expense`;
      case 'expense.deleted':
        return `${actor} deleted an expense`;
      case 'settlement.created':
        return `${actor} recorded a settlement`;
      case 'member.added':
        return `${actor} added a member`;
      case 'member.removed':
        return `${actor} removed a member`;
      case 'group.created':
        return `${actor} created a group`;
      default:
        return `${actor}: ${item.type}`;
    }
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiErrorBody | undefined;
      return body?.error?.message ?? 'Could not load activity';
    }
    return 'Could not load activity';
  }
}
