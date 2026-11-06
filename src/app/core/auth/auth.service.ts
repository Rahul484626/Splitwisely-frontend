import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { AuthResponse, User } from '../api/api.types';
import { resolveApiBaseUrl } from '../api/api-config';
import { tokenStorage } from './token-storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);

  private get base(): string {
    return resolveApiBaseUrl();
  }

  isAuthenticated(): boolean {
    return Boolean(tokenStorage.getAccess());
  }

  async register(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.base}/auth/register`, {
        ...input,
        defaultCurrency: 'INR',
      }),
    );
    await this.applySession(res);
  }

  async login(input: { email: string; password: string }): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.base}/auth/login`, input),
    );
    await this.applySession(res);
  }

  async refresh(): Promise<string> {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    const res = await firstValueFrom(
      this.http.post<{ accessToken: string; refreshToken: string }>(`${this.base}/auth/refresh`, {
        refreshToken,
      }),
    );
    await tokenStorage.set(res.accessToken, res.refreshToken);
    return res.accessToken;
  }

  async loadMe(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      this.user.set(null);
      return null;
    }
    try {
      const me = await firstValueFrom(this.http.get<User>(`${this.base}/me`));
      this.user.set(me);
      return me;
    } catch {
      this.user.set(null);
      return null;
    }
  }

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefresh();
    await tokenStorage.clear();
    this.user.set(null);
    if (refreshToken) {
      try {
        await firstValueFrom(this.http.post(`${this.base}/auth/logout`, { refreshToken }));
      } catch {
        // ignore logout network errors
      }
    }
    await this.router.navigateByUrl('/auth');
  }

  private async applySession(res: AuthResponse) {
    await tokenStorage.set(res.accessToken, res.refreshToken);
    this.user.set(res.user);
  }
}
