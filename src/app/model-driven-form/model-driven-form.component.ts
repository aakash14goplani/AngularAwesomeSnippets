import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validateForm } from '../form-validation/helper-functions/validate-form';
import { validationPatterns } from '../form-validation/helper-functions/validation-pattern';

@Component({
  selector: 'app-model-driven-form',
  templateUrl: './model-driven-form.component.html',
  styleUrls: ['./model-driven-form.component.scss']
})
export class ModelDrivenFormComponent implements OnInit {
  genders: string[] = ['Male', 'Female', 'Other'];
  defaultCountry = '';
  validationPatterns!: any;
  displayForm = null;
  modelForm!: FormGroup;
  submitted = false;

  constructor() { }

  ngOnInit() {
    this.validationPatterns = validationPatterns;
    this.buildForm();
  }

  private buildForm(): void {
    this.modelForm = new FormGroup({
      userData: new FormGroup({
        firstname: new FormControl(null, [Validators.required, Validators.pattern(validationPatterns.name)]),
        lastname: new FormControl(null, [Validators.required, Validators.pattern(validationPatterns.name)])
      }),
      address: new FormControl(null, [Validators.required, Validators.pattern(validationPatterns.address)]),
      country: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      checkboxOptions: new FormGroup({
        tnc: new FormControl(null, [Validators.required]),
        'sign-for-newsletter': new FormControl(null, [Validators.required])
      })
    });
  }

  onSubmit(): void {
    this.submitted = true;
    validateForm(this.modelForm);
    if (this.modelForm.valid) {
      this.displayForm = this.modelForm.value;
    }
  }

  resetFormValues(): void {
    this.submitted = false;
    this.modelForm.reset();
    this.modelForm.updateValueAndValidity();
  }
}
