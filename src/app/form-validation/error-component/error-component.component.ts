import { Component, ElementRef } from '@angular/core';
import { DynamicComponent } from 'src/app/dynamic-components/dynamic-component.model';

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.component.html',
  styleUrls: ['./error-component.component.scss']
})
export class ErrorComponentComponent implements DynamicComponent {
  data: any;

  constructor(public elementRef: ElementRef) { }
}
