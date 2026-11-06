import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { resolveApiBaseUrl } from './api-config';
import type { GroupDetail, GroupSummary } from './api.types';

@Injectable({ providedIn: 'root' })
export class GroupsApiService {
  private readonly http = inject(HttpClient);

  private get base(): string {
    return resolveApiBaseUrl();
  }

  list(): Promise<{ items: GroupSummary[] }> {
    return firstValueFrom(this.http.get<{ items: GroupSummary[] }>(`${this.base}/groups`));
  }

  create(input: { name: string; currency?: string }): Promise<GroupSummary> {
    return firstValueFrom(this.http.post<GroupSummary>(`${this.base}/groups`, input));
  }

  get(groupId: string): Promise<GroupDetail> {
    return firstValueFrom(this.http.get<GroupDetail>(`${this.base}/groups/${groupId}`));
  }

  addMember(groupId: string, email: string): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.base}/groups/${groupId}/members`, { email }));
  }
}
