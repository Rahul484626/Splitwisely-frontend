import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-state-message',
  standalone: true,
  template: `
    <p class="state" [class.state--error]="tone === 'error'" role="status" [attr.aria-live]="tone === 'error' ? 'assertive' : 'polite'">
      {{ text }}
    </p>
  `,
  styles: [
    `
      .state {
        position: relative;
        z-index: 1;
        margin: 0;
        font-size: 14px;
        color: var(--text-secondary);
      }
      .state--error {
        color: var(--negative);
      }
    `,
  ],
})
export class StateMessageComponent {
  @Input({ required: true }) text = '';
  @Input() tone: 'muted' | 'error' = 'muted';
}
