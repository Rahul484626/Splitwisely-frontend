import { HttpErrorResponse } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import type { ApiErrorBody, GroupSummary } from '../../core/api/api.types';
import { GroupsApiService } from '../../core/api/groups.service';
import { AuthService } from '../../core/auth/auth.service';
import { GlassCardComponent } from '../../shared/glass-card/glass-card.component';
import { balanceCaption, balanceTone, formatMinor } from '../../shared/money';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  imports: [IonContent, FormsModule, RouterLink, GlassCardComponent],
})
export class GroupsPage implements OnInit {
  private readonly groupsApi = inject(GroupsApiService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly formatMinor = formatMinor;
  readonly balanceCaption = balanceCaption;
  readonly balanceTone = balanceTone;

  readonly groups = signal<GroupSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly creating = signal(false);
  newGroupName = '';

  async ngOnInit(): Promise<void> {
    await this.auth.loadMe();
    await this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const res = await this.groupsApi.list();
      this.groups.set(res.items);
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.loading.set(false);
    }
  }

  async createGroup(): Promise<void> {
    const name = this.newGroupName.trim();
    if (!name) {
      return;
    }
    this.creating.set(true);
    this.error.set('');
    try {
      const group = await this.groupsApi.create({ name, currency: 'INR' });
      this.newGroupName = '';
      await this.router.navigate(['/groups', group.id]);
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.creating.set(false);
    }
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiErrorBody | undefined;
      return body?.error?.message ?? 'Could not load groups';
    }
    return 'Could not load groups';
  }
}
