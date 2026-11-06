import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const ACCESS_KEY = 'splitwisely.accessToken';
const REFRESH_KEY = 'splitwisely.refreshToken';

/** In-memory cache so HTTP interceptor stays sync after hydration. */
let accessCache: string | null = null;
let refreshCache: string | null = null;
let hydrated = false;

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export const tokenStorage = {
  async hydrate(): Promise<void> {
    if (hydrated) return;
    if (isNative()) {
      const [access, refresh] = await Promise.all([
        Preferences.get({ key: ACCESS_KEY }),
        Preferences.get({ key: REFRESH_KEY }),
      ]);
      accessCache = access.value;
      refreshCache = refresh.value;
    } else {
      accessCache = sessionStorage.getItem(ACCESS_KEY);
      refreshCache = sessionStorage.getItem(REFRESH_KEY);
    }
    hydrated = true;
  },

  getAccess(): string | null {
    return accessCache;
  },

  getRefresh(): string | null {
    return refreshCache;
  },

  async set(accessToken: string, refreshToken: string): Promise<void> {
    accessCache = accessToken;
    refreshCache = refreshToken;
    if (isNative()) {
      await Preferences.set({ key: ACCESS_KEY, value: accessToken });
      await Preferences.set({ key: REFRESH_KEY, value: refreshToken });
    } else {
      sessionStorage.setItem(ACCESS_KEY, accessToken);
      sessionStorage.setItem(REFRESH_KEY, refreshToken);
    }
  },

  async clear(): Promise<void> {
    accessCache = null;
    refreshCache = null;
    if (isNative()) {
      await Preferences.remove({ key: ACCESS_KEY });
      await Preferences.remove({ key: REFRESH_KEY });
    } else {
      sessionStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
    }
  },
};
