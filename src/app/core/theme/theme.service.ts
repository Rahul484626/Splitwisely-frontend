import { Injectable, computed, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  THEMES,
  isThemeId,
  themeById,
  type ThemeDefinition,
  type ThemeId,
} from './theme';

/**
 * Applies and persists the color theme.
 *
 * The stored theme is applied by an inline script in index.html before Angular
 * boots (avoids a flash); this service takes over from there, keeps <html>'s
 * data-theme attribute in sync, and updates the native status bar.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes = THEMES;
  readonly current = signal<ThemeId>(DEFAULT_THEME);
  readonly definition = computed<ThemeDefinition>(() => themeById(this.current()));

  /** Reads the theme already applied to the document without touching storage. */
  init(): void {
    const applied = document.documentElement.dataset['theme'];
    this.current.set(isThemeId(applied) ? applied : DEFAULT_THEME);
  }

  set(id: ThemeId): void {
    this.current.set(id);
    document.documentElement.dataset['theme'] = id;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // Private mode / storage disabled — theme still applies this session.
    }
    void this.applyNativeChrome(themeById(id));
  }

  /** Re-applies the active theme to the native status bar (e.g. after resume). */
  async syncNativeChrome(): Promise<void> {
    await this.applyNativeChrome(this.definition());
  }

  private async applyNativeChrome(theme: ThemeDefinition): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await StatusBar.setStyle({ style: theme.scheme === 'light' ? Style.Light : Style.Dark });
      await StatusBar.setBackgroundColor({ color: theme.statusBarColor });
    } catch {
      // Older WebViews / unsupported platforms
    }
  }
}
