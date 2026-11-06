import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

@Injectable({ providedIn: 'root' })
export class ShareService {
  async shareText(title: string, text: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      if (navigator.share) {
        await navigator.share({ title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      return;
    }
    await Share.share({ title, text, dialogTitle: title });
  }
}
