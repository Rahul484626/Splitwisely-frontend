import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

import type { ApiErrorBody } from '../../core/api/api.types';
import { AuthService } from '../../core/auth/auth.service';
import { GlassCardComponent } from '../../shared/glass-card/glass-card.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  imports: [IonContent, FormsModule, GlassCardComponent],
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  mode = signal<'login' | 'signup'>('login');
  name = '';
  email = '';
  password = '';
  error = signal('');
  busy = signal(false);

  toggleMode(): void {
    this.mode.update((m) => (m === 'login' ? 'signup' : 'login'));
    this.error.set('');
  }

  async submit(): Promise<void> {
    this.error.set('');
    this.busy.set(true);
    try {
      if (this.mode() === 'signup') {
        await this.auth.register({
          name: this.name.trim(),
          email: this.email.trim(),
          password: this.password,
        });
      } else {
        await this.auth.login({
          email: this.email.trim(),
          password: this.password,
        });
      }
      await this.router.navigateByUrl('/dashboard');
    } catch (err) {
      this.error.set(this.readError(err));
    } finally {
      this.busy.set(false);
    }
  }

  private readError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiErrorBody | undefined;
      return body?.error?.message ?? 'Something went wrong';
    }
    return 'Something went wrong';
  }
}
