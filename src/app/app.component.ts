import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly theme = inject(ThemeService);

  ngOnInit(): void {
    // index.html already painted the stored theme; adopt it and sync native chrome.
    this.theme.init();
    void this.theme.syncNativeChrome();
  }
}
