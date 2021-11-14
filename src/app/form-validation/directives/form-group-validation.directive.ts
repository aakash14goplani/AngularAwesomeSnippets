/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-syntax */
import {
  Directive, ElementRef, Input, OnDestroy, Renderer2, RendererFactory2, ViewContainerRef, AfterViewChecked
} from '@angular/core';
import {
  ControlContainer, FormGroup, NgModelGroup, ValidationErrors
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComponentConfig } from '../../dynamic-components/component-config.model';
import { DynamicComponentService } from '../../dynamic-components/dynamic-component.service';
import { DynamicItem } from '../../dynamic-components/dynamic-item.model';
import { ErrorComponent } from '../error-component/error-component';
import { FormValidationService } from '../services/form-validation.service';

@Directive({
  selector: '[appFormGroupValidation]'
})
export class FormGroupValidationDirective implements AfterViewChecked, OnDestroy {
  @Input() validationMsgId!: string;

  private statusChangeSubscription!: Subscription;
  private renderer: Renderer2;
  private targetFormGroup!: FormGroup;
  private fieldName: string[] = [];
  private errorMessage: string[] = [];

  constructor(
    private container: ControlContainer,
    private elRef: ElementRef,
    private validationMsgService: FormValidationService,
    private dynamicComponentService: DynamicComponentService,
    public viewContainerRef: ViewContainerRef,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  ngAfterViewChecked(): void {
    this.targetFormGroup = (this.container as NgModelGroup).control;
    if (this.targetFormGroup?.statusChanges && !this.statusChangeSubscription) {
      this.statusChangeSubscription = this.targetFormGroup.statusChanges.subscribe(
        (status) => {
          if (status === 'INVALID' && (this.targetFormGroup.touched)) {
            this.showError();
          } else {
            this.removeError();
          }
        }
      );

      this.elRef.nativeElement.querySelectorAll('input, select').forEach((node: any) => this.renderer.listen(node, 'blur', this.handleBlurEvent.bind(this)));
    }
  }

  /**
   * @description This is needed to handle the case of clicking a required field and moving out.
   * Rest all are handled by status change subscription
   * @returns {void}
   */
  handleBlurEvent(): void {
    let showErrors = false;
    for (const [formControlName, control] of Object.entries(this.targetFormGroup.controls)) {
      if (control.status === 'INVALID') {
        showErrors = true;
      }
    }

    showErrors ? this.showError() : this.removeError();
  }

  /**
   * @description attaches dynamic error component that displays error message
   * @returns void
   */
  private showError() {
    this.fieldName.length = 0;
    this.errorMessage.length = 0;
    // We need to get the nested FormGroup from the Form
    for (const [formControlName, control] of Object.entries(this.targetFormGroup.controls)) {
      if (control.status === 'INVALID' && control.errors) {
        this.removeError();
        const valErrors: ValidationErrors = control.errors;
        const errorMsgs: Array<string> = this.buildErrors(valErrors);
        this.fieldName.push(formControlName);
        this.errorMessage.push(...errorMsgs);
        const componentConfig: ComponentConfig = this.buildComponentConfig(errorMsgs);

        this.renderer.addClass(this.viewContainerRef.element.nativeElement, 'has-error');
        this.loadComponent(this.dynamicComponentService.buildDynamicItem(componentConfig));
      }
    }
  }

  /**
   * @description removes dynamic error component that displays error message
   * @returns void
   */
  private removeError(): void {
    this.renderer.removeClass(this.viewContainerRef.element.nativeElement, 'has-error');
    const errorElement = this.viewContainerRef.get(this.viewContainerRef.length - 1);

    if (errorElement) {
      this.viewContainerRef.remove(this.viewContainerRef.length - 1);
    }
  }

  /**
   * @description Load Error component dynamically
   * @param componentData {DynamicItem} configuration data
   * @returns {void}
   */
  private loadComponent(componentData: DynamicItem): void {
    const formGroupNode = this.viewContainerRef.element.nativeElement;
    const node = this.findNode(formGroupNode);
    this.dynamicComponentService.loadComponentIntoNode(this.viewContainerRef, componentData, node as any);
  }

  /**
   * @description Iterates through DOM to find nearest node with class=`form-group`
   * @param node current DOM node i.e. one that has FormControl
   * @returns parent node with class=`form-group`
   */
  private findNode(formGroupNode: Element): Element {
    let parentNode = formGroupNode;

    if (!parentNode.className.includes('form-group')) {
      let found = false;
      while (!found) {
        found = parentNode.className.includes('form-group');
        parentNode = this.renderer.parentNode(parentNode);
      }
    }
    return parentNode;
  }

  /**
   * @description Builds key required to fetch value from validation-message.ts file
   * @param errorType {string}
   * @returns {string}
   */
  private buildErrorMsgKey(errorType: string): string {
    return `${this.validationMsgId}-${errorType}`;
  }

  /**
   * @description Iterates through ValidationErrors object and prepares error message that is
   * to be displayed. Example: ValidationErrors = { required: true }. It fetches `required`,
   * sends this to servic to fetch error message against this field
   * @param valErrors {ValidationErrors} list of errors on particular FormControl
   * @returns {Array<string>} list of error messages to be displayed
   */
  private buildErrors(valErrors: ValidationErrors): Array<string> {
    const errorMsgs: string[] = [];
    const errorKeys = Object.keys(valErrors);
    errorKeys.forEach((key) => {
      if (valErrors[key] !== null) {
        errorMsgs.push(this.validationMsgService.getValidationMessage(this.buildErrorMsgKey(key)));
      }
    });

    return errorMsgs;
  }

  /**
   * @description Builds model for dynamic component to display errors on form fields
   * @param errorMessages {Array<string>} list of error messages to be displayed
   * @returns {ComponentConfig}
   */
  private buildComponentConfig(errorMessages: Array<string>): ComponentConfig {
    return {
      dynamicComponentType: ErrorComponent,
      componentType: 'validation',
      data: {
        errorMessages
      }
    };
  }

  ngOnDestroy(): void {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
  }
}
