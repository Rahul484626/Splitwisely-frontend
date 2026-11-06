import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { AuthService } from '../../core/auth/auth.service';
import { type ThemeId } from '../../core/theme/theme';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [IonContent, RouterLink],
})
export class SettingsPage implements OnInit {
  readonly auth = inject(AuthService);
  readonly themeService = inject(ThemeService);

  readonly signingOut = signal(false);
  readonly appVersion = '0.1.0';

  async ngOnInit(): Promise<void> {
    this.themeService.init();
    await this.auth.loadMe();
  }

  selectTheme(id: ThemeId): void {
    this.themeService.set(id);
  }

  async logout(): Promise<void> {
    this.signingOut.set(true);
    try {
      await this.auth.logout();
    } finally {
      this.signingOut.set(false);
    }
  }
}
