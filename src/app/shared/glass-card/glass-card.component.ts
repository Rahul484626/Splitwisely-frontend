import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  templateUrl: './glass-card.component.html',
  styleUrls: ['./glass-card.component.scss'],
})
export class GlassCardComponent {
  @Input() label = '';
  @Input() amount = '';
  @Input() caption = '';
  /** 'positive' | 'negative' | 'neutral' | '' */
  @Input() tone: 'positive' | 'negative' | 'neutral' | '' = '';
}
