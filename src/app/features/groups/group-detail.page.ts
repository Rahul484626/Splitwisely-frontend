import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { GroupsApiService } from '../../core/api/groups.service';
import { ExpensesApiService, type Expense } from '../../core/api/expenses.service';
import type { ApiErrorBody, GroupDetail } from '../../core/api/api.types';
import { GlassCardComponent } from '../../shared/glass-card/glass-card.component';
import { balanceCaption, balanceTone, formatMinor } from '../../shared/money';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
  imports: [IonContent, FormsModule, RouterLink, GlassCardComponent],
})
export class GroupDetailPage implements ViewWillEnter {
  private readonly route = inject(ActivatedRoute);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly expensesApi = inject(ExpensesApiService);

  readonly group = signal<GroupDetail | null>(null);
  readonly expenses = signal<Expense[]>([]);
  readonly error = signal('');
  readonly busy = signal(false);
  memberEmail = '';

  readonly formatMinor = formatMinor;
  readonly balanceCaption = balanceCaption;
  readonly balanceTone = balanceTone;

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('groupId');
    if (!id) {
      this.error.set('Missing group id');
      return;
    }
    void this.load(id);
  }

  async load(id: string) {
    this.busy.set(true);
    this.error.set('');
    try {
      const [group, expenseList] = await Promise.all([
        this.groupsApi.get(id),
        this.expensesApi.list(id),
      ]);
      this.group.set(group);
      this.expenses.set(expenseList.items);
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.busy.set(false);
    }
  }

  async addMember() {
    const g = this.group();
    const email = this.memberEmail.trim();
    if (!g || !email) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.groupsApi.addMember(g.id, email);
      this.memberEmail = '';
      await this.load(g.id);
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.busy.set(false);
    }
  }

  async deleteExpense(expenseId: string) {
    const g = this.group();
    if (!g) return;
    this.busy.set(true);
    try {
      await this.expensesApi.softDelete(g.id, expenseId);
      await this.load(g.id);
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.busy.set(false);
    }
  }

  nameOf(userId: string): string {
    return this.group()?.members.find((m) => m.userId === userId)?.name ?? 'Someone';
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiErrorBody | undefined;
      return body?.error?.message ?? 'Request failed';
    }
    return 'Request failed';
  }
}
