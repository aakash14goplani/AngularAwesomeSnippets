import { Injectable } from '@angular/core';
import { validationMessages } from '../helper-functions/validation-message';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  private errorMessages: any = validationMessages;

  constructor() { }

  /**
   * @description Processes the form control id and return error-validation-message
   * @param id {string}, defaults to `generic-required`
   * @returns error-message {string}
   */
  getValidationMessage(id = '-required'): string {
    return this.errorMessages[id] || this.errorMessages[`generic-${id.split('-')[1]}`];
  }
}
