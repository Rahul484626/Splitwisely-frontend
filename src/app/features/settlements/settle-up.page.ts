import { HttpErrorResponse } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import type { ApiErrorBody, GroupDetail } from '../../core/api/api.types';
import { BalancesApiService, type SimplifiedPayment } from '../../core/api/balances.service';
import { GroupsApiService } from '../../core/api/groups.service';
import { ShareService } from '../../core/native/share.service';
import { GlassCardComponent } from '../../shared/glass-card/glass-card.component';
import { formatMinor } from '../../shared/money';

@Component({
  selector: 'app-settle-up',
  templateUrl: './settle-up.page.html',
  styleUrls: ['./settle-up.page.scss'],
  imports: [IonContent, FormsModule, RouterLink, GlassCardComponent],
})
export class SettleUpPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly balancesApi = inject(BalancesApiService);
  private readonly share = inject(ShareService);

  readonly group = signal<GroupDetail | null>(null);
  readonly suggestions = signal<SimplifiedPayment[]>([]);
  readonly error = signal('');
  readonly busy = signal(false);

  fromUserId = '';
  toUserId = '';
  amountRupees = '';
  note = '';

  readonly formatMinor = formatMinor;

  async ngOnInit(): Promise<void> {
    const groupId = this.route.snapshot.paramMap.get('groupId');
    if (!groupId) {
      this.error.set('Missing group');
      return;
    }
    try {
      const [group, balances] = await Promise.all([this.groupsApi.get(groupId), this.balancesApi.balances(groupId)]);
      this.group.set(group);
      this.suggestions.set(balances.simplified);
      const prefill = balances.simplified[0];
      if (prefill) {
        this.fromUserId = prefill.fromUserId;
        this.toUserId = prefill.toUserId;
        this.amountRupees = String(prefill.amountMinor / 100);
      } else if (group.members.length >= 2) {
        this.fromUserId = group.members[0].userId;
        this.toUserId = group.members[1].userId;
      }
    } catch (err) {
      this.error.set(this.readError(err));
    }
  }

  nameOf(userId: string): string {
    return this.group()?.members.find((m) => m.userId === userId)?.name ?? userId.slice(0, 8);
  }

  useSuggestion(p: SimplifiedPayment): void {
    this.fromUserId = p.fromUserId;
    this.toUserId = p.toUserId;
    this.amountRupees = String(p.amountMinor / 100);
  }

  async shareSuggestions(): Promise<void> {
    const lines = this.suggestions().map(
      (s) => `${this.nameOf(s.fromUserId)} pays ${this.nameOf(s.toUserId)} ${formatMinor(s.amountMinor)}`,
    );
    if (!lines.length) return;
    await this.share.shareText('Splitwisely settle up', lines.join('\n'));
  }

  async submit(): Promise<void> {
    const g = this.group();
    if (!g) return;
    const amountMinor = Math.round(Number(this.amountRupees) * 100);
    if (!Number.isFinite(amountMinor) || amountMinor <= 0) {
      this.error.set('Enter a valid amount');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.balancesApi.createSettlement(g.id, {
        fromUserId: this.fromUserId,
        toUserId: this.toUserId,
        amountMinor,
        note: this.note.trim(),
      });
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
      return body?.error?.message ?? 'Could not record settlement';
    }
    return 'Could not record settlement';
  }
}
