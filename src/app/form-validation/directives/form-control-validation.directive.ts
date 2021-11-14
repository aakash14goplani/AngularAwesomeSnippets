/* eslint-disable no-prototype-builtins */
import {
  Directive, HostListener, Input, OnDestroy, OnInit, Renderer2, RendererFactory2, ViewContainerRef
} from '@angular/core';
import { FormGroupDirective, NgControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComponentConfig } from '../../dynamic-components/component-config.model';
import { DynamicComponentService } from '../../dynamic-components/dynamic-component.service';
import { ErrorComponent } from '../error-component/error-component';
import { FormValidationService } from '../services/form-validation.service';

@Directive({
  selector: '[appFormControlValidation]',
  providers: [FormGroupDirective]
})
export class FormControlValidationDirective implements OnInit, OnDestroy {
  @Input() validationMsgId!: string;

  private statusChangeSubscription!: Subscription;
  private renderer: Renderer2;
  private invalidFiledName = [] as any;
  private invalidFieldMessage = [] as any;

  constructor(
    private control: NgControl,
    private validationMsgService: FormValidationService,
    private dynamicComponentService: DynamicComponentService,
    public viewContainerRef: ViewContainerRef,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    this.statusChangeSubscription = this.control?.statusChanges?.subscribe(
      (status) => {
        if (status === 'INVALID' && (this.control.dirty && this.control.touched)) {
          this.showError();
        } else {
          this.removeError();
        }
      }
    ) as Subscription;
  }

  /**
   * @description This is needed to handle the case of clicking a required field and moving out.
   * Rest all are handled by status change subscription
   * @returns {void}
   */
  @HostListener('blur', ['$event'])
  handleBlurEvent(): void {
    if (this.control.value === null || this.control.value === '') {
      if (this.control.errors) {
        this.showError();
      } else if (this.control?.control?.validator && (this.control.control.validator(this.control.control) && this.control?.control?.validator(this.control?.control)?.hasOwnProperty('required'))) {
        // Need to add required error - template driven forms.
        const targetFormControl = this.control.control;
        targetFormControl.setErrors({ ...targetFormControl.errors, required: true });
        this.showError();
      } else if (this.control.validator && (this.control.validator(this.control as any) && this.control?.validator(this.control as any)?.hasOwnProperty('required'))) {
        // Need to add required error - reactive forms.
        const targetFormControl = this.control?.control;
        targetFormControl?.setErrors({ ...targetFormControl?.errors, required: true });
        this.showError();
      }
    } else {
      this.control.errors ? this.showError() : this.removeError();
    }
  }

  /**
   * @description attaches dynamic error component that displays error message
   * @returns void
   */
  private showError() {
    this.removeError();
    this.invalidFieldMessage.length = 0;
    this.invalidFiledName.length = 0;

    const valErrors: ValidationErrors = this.control.errors as ValidationErrors;
    const errorMsgs: Array<string> = this.buildErrors(valErrors) || [];
    this.invalidFieldMessage.push(...errorMsgs);
    this.invalidFiledName.push(this.control?.name as string || this.validationMsgId || '');
    const componentConfig: ComponentConfig = this.buildComponentConfig(errorMsgs);
    const parentNode = this.getParentFormGroupNode(this.viewContainerRef.element.nativeElement);

    this.renderer.addClass(parentNode, 'has-error');

    this.dynamicComponentService.loadComponentIntoNode(this.viewContainerRef, this.dynamicComponentService.buildDynamicItem(componentConfig), parentNode);
  }

  /**
   * @description removes dynamic error component that displays error message
   * @returns void
   */
  private removeError(): void {
    const parentNode = this.getParentFormGroupNode(this.viewContainerRef.element.nativeElement);
    this.renderer.removeClass(parentNode, 'has-error');
    const errorElement = this.viewContainerRef.get(this.viewContainerRef.length - 1);
    if (errorElement) {
      this.viewContainerRef.remove(this.viewContainerRef.indexOf(errorElement));
    }
  }

  /**
   * @description Iterates through DOM to find nearest node with class=`form-group`
   * @param node current DOM node i.e. one that has FormControl
   * @returns parent node with class=`form-group`
   */
  private getParentFormGroupNode(node: any): any {
    let parentNode = node;
    let found = false;
    while (!found) {
      parentNode = this.renderer.parentNode(parentNode);
      found = parentNode.className.includes('form-group');
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
