import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { environment } from '../../environments/environment';
import { GlassCardComponent } from '../shared/glass-card/glass-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, GlassCardComponent],
})
export class HomePage {
  readonly apiBaseUrl = environment.apiBaseUrl;
}
