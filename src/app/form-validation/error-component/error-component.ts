import { Component, ElementRef } from '@angular/core';
import { DynamicComponent } from '../../dynamic-components/dynamic-component.model';

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.html',
  styleUrls: ['./error-component.scss']
})
export class ErrorComponent implements DynamicComponent {
  data: any;

  constructor(public elementRef: ElementRef) { }
}
