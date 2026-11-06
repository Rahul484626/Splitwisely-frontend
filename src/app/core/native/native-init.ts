import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { tokenStorage } from '../auth/token-storage';

/**
 * Call once at app bootstrap. Safe on web (no-ops native plugins).
 *
 * Status bar colors are owned by ThemeService so they follow the active theme
 * (and the light "Daylight" palette) instead of a hardcoded navy.
 */
export async function initNativeShell(): Promise<void> {
  await tokenStorage.hydrate();

  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await SplashScreen.hide();
  } catch {
    // Splash may already be hidden
  }
}
