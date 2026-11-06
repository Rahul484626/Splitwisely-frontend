import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { GlassCardComponent } from '../shared/glass-card/glass-card.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, GlassCardComponent],
})
export class HomePage {
  readonly apiBaseUrl = environment.apiBaseUrl;
}
