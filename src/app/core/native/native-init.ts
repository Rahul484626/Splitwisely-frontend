import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { tokenStorage } from '../auth/token-storage';

/** Call once at app bootstrap. Safe on web (no-ops native plugins). */
export async function initNativeShell(): Promise<void> {
  await tokenStorage.hydrate();

  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0B1020' });
  } catch {
    // Older WebViews / unsupported
  }

  try {
    await SplashScreen.hide();
  } catch {
    // Splash may already be hidden
  }
}
