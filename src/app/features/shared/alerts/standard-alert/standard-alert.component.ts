import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AlertData } from '../models/alert.model';

@Component({
  selector: 'app-standard-alert',
  templateUrl: './standard-alert.component.html',
  styleUrls: ['./standard-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandardAlertComponent {
  @Input() data!: AlertData;

  constructor() { }
}
