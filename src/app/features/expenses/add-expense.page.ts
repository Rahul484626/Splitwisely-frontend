import { HttpErrorResponse } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import type { ApiErrorBody, GroupDetail, GroupMember } from '../../core/api/api.types';
import { ExpensesApiService } from '../../core/api/expenses.service';
import { GroupsApiService } from '../../core/api/groups.service';
import { AuthService } from '../../core/auth/auth.service';
import { GlassCardComponent } from '../../shared/glass-card/glass-card.component';

type SplitType = 'equal' | 'exact' | 'percentage' | 'shares';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  imports: [IonContent, FormsModule, RouterLink, GlassCardComponent],
})
export class AddExpensePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly expensesApi = inject(ExpensesApiService);
  private readonly auth = inject(AuthService);

  readonly group = signal<GroupDetail | null>(null);
  readonly error = signal('');
  readonly busy = signal(false);

  description = '';
  amountRupees = '';
  paidBy = '';
  splitType: SplitType = 'equal';
  selected = signal<Record<string, boolean>>({});
  exactShares = signal<Record<string, string>>({});
  percentageShares = signal<Record<string, string>>({});
  weightShares = signal<Record<string, string>>({});

  readonly participants = computed(() => {
    const g = this.group();
    if (!g) return [] as GroupMember[];
    return g.members.filter((m) => this.selected()[m.userId]);
  });

  async ngOnInit(): Promise<void> {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (!groupId) {
      this.error.set('Missing group');
      return;
    }
    try {
      const g = await this.groupsApi.get(groupId);
      this.group.set(g);
      const me = this.auth.user()?.id ?? g.createdBy;
      this.paidBy = me;
      const selected: Record<string, boolean> = {};
      for (const m of g.members) {
        selected[m.userId] = true;
      }
      this.selected.set(selected);
    } catch (err) {
      this.error.set(this.readError(err));
    }
  }

  toggleMember(userId: string): void {
    this.selected.update((s) => ({ ...s, [userId]: !s[userId] }));
  }

  setExact(userId: string, value: string | number): void {
    this.exactShares.update((s) => ({ ...s, [userId]: String(value) }));
  }

  setPercentage(userId: string, value: string | number): void {
    this.percentageShares.update((s) => ({ ...s, [userId]: String(value) }));
  }

  setWeight(userId: string, value: string | number): void {
    this.weightShares.update((s) => ({ ...s, [userId]: String(value) }));
  }

  async submit(): Promise<void> {
    const g = this.group();
    if (!g) return;

    const amountMinor = Math.round(Number(this.amountRupees) * 100);
    if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
      this.error.set('Enter a valid amount');
      return;
    }

    const participants = this.participants().map((m) => m.userId);
    if (participants.length === 0) {
      this.error.set('Select at least one participant');
      return;
    }

    this.busy.set(true);
    this.error.set('');
    try {
      const body =
        this.splitType === 'equal'
          ? {
              description: this.description.trim() || 'Expense',
              amountMinor,
              paidBy: this.paidBy,
              splitType: 'equal' as const,
              participants,
            }
          : this.splitType === 'exact'
            ? {
                description: this.description.trim() || 'Expense',
                amountMinor,
                paidBy: this.paidBy,
                splitType: 'exact' as const,
                splits: participants.map((userId) => ({
                  userId,
                  shareMinor: Math.round(Number(this.exactShares()[userId] || 0) * 100),
                })),
              }
            : this.splitType === 'percentage'
              ? {
                  description: this.description.trim() || 'Expense',
                  amountMinor,
                  paidBy: this.paidBy,
                  splitType: 'percentage' as const,
                  splits: participants.map((userId) => ({
                    userId,
                    percentage: Number(this.percentageShares()[userId] || 0),
                  })),
                }
              : {
                  description: this.description.trim() || 'Expense',
                  amountMinor,
                  paidBy: this.paidBy,
                  splitType: 'shares' as const,
                  splits: participants.map((userId) => ({
                    userId,
                    shares: Number(this.weightShares()[userId] || 0),
                  })),
                };

      await this.expensesApi.create(g.id, body);
      await this.router.navigate(['/groups', g.id]);
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.busy.set(false);
    }
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiErrorBody | undefined;
      return body?.error?.message ?? 'Could not save expense';
    }
    return 'Could not save expense';
  }
}
