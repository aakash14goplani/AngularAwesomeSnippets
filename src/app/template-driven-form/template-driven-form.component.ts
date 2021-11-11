import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { validateForm } from '../form-validation/helper-functions/validate-form';
import { validationPatterns } from '../form-validation/helper-functions/validation-pattern';

@Component({
  selector: 'app-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.scss']
})
export class TemplateDrivenFormComponent implements OnInit {
  genders: string[] = ['Male', 'Female', 'Other'];
  defaultCountry = '';
  @ViewChild('templateForm', { static: true }) templateForm!: NgForm;
  validationPatterns!: any;
  displayForm = null;

  constructor() { }

  ngOnInit() {
    this.validationPatterns = validationPatterns;
  }

  onSubmit(): void {
    validateForm(this.templateForm.form);
    if (this.templateForm.valid) {
      this.displayForm = this.templateForm.form.value;
    }
  }

  resetFormValues(): void {
    this.templateForm.form.reset();
    this.templateForm.resetForm();
    this.templateForm.form.updateValueAndValidity();
  }
}
