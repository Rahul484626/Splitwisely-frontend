import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

/** Stretch helper for receipt photos (Phase 6+). Not wired into expense form yet. */
@Injectable({ providedIn: 'root' })
export class CameraService {
  async takeReceiptPhoto(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      return null;
    }
    const photo = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    return photo.dataUrl ?? null;
  }
}
