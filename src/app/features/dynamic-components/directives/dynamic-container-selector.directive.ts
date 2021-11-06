import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicContainerSelector]'
})
export class DynamicContainerSelectorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
