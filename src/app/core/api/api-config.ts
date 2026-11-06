import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';

/**
 * On Android emulator, `localhost` is the emulator itself.
 * `10.0.2.2` maps to the host machine running the API.
 * Physical devices: set `environment.apiBaseUrl` to your LAN IP, e.g. http://192.168.1.10:3000/api/v1
 */
export function resolveApiBaseUrl(): string {
  const base = environment.apiBaseUrl;
  if (Capacitor.getPlatform() === 'android' && base.includes('localhost')) {
    return base.replace('localhost', '10.0.2.2');
  }
  return base;
}
