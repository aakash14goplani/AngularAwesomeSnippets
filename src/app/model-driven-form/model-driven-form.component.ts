import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormArray, FormControl, FormGroup, Validators
} from '@angular/forms';
import { validateForm } from '../form-validation/helper-functions/validate-form';
import { validationPatterns } from '../form-validation/helper-functions/validation-pattern';

@Component({
  selector: 'app-model-driven-form',
  templateUrl: './model-driven-form.component.html',
  styleUrls: ['./model-driven-form.component.scss']
})
export class ModelDrivenFormComponent implements OnInit {
  animals: Array<string> = [];
  roadCheckbox = false;
  airCheckbox = false;
  roadOptions = false;
  formData!: FormGroup;

  constructor() { }

  ngOnInit() {
    this.animals = ['lion', 'tiger', 'zebra', 'fox'];
    this.buildForm();
  }

  buildForm(): void {
    this.formData = new FormGroup({
      selectedAnimal: new FormArray([], [Validators.required]),
      selectedTransport: new FormArray([], [Validators.required]),
      roadName: new FormControl({ disabled: true, value: null }, Validators.required),
      roadZip: new FormControl({ disabled: true, value: null }, Validators.required),
      planeName: new FormControl({ disabled: true, value: null }, Validators.required),
      planeZip: new FormControl({ disabled: true, value: null }, Validators.required)
    });
  }

  animalSelected(event: Event, animal: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const formArray = this.getSelectedAnimalFormArray();
    if (isChecked) {
      formArray.push(new FormControl(animal));
    } else {
      const index = formArray.controls.findIndex((item) => item.value === animal);
      formArray.removeAt(index);
    }
  }

  transportSelected(event: Event, mode: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const formArray = this.getSelectedTransportFormArray();
    if (isChecked) {
      formArray.push(new FormControl(mode));
      if (mode === 'ROAD') {
        this.addRoadControllers();
      }
      if (mode === 'AIR') {
        this.addAirControllers();
      }
    } else {
      if (mode === 'ROAD') {
        this.removeRoadControllers();
      }
      if (mode === 'AIR') {
        this.removeAirControllers();
      }
      const index = formArray.controls.findIndex((item) => item.value === mode);
      formArray.removeAt(index);
    }
  }

  roadToggle(type: string): void {
    if (type === 'rail') {
      this.roadOptions = false;
      this.removeRoadControllers();
    } else {
      this.roadOptions = true;
      this.addRoadControllers();
    }
  }

  getSelectedAnimalFormArray(): FormArray {
    return this.formData.get('selectedAnimal') as FormArray;
  }

  getSelectedTransportFormArray(): FormArray {
    return this.formData.get('selectedTransport') as FormArray;
  }

  getRoadNameControl(): AbstractControl {
    return this.formData.get('roadName') as AbstractControl;
  }

  getRoadZip(): AbstractControl {
    return this.formData.get('roadZip') as AbstractControl;
  }

  getPlaneNameControl(): AbstractControl {
    return this.formData.get('planeName') as AbstractControl;
  }

  getPlaneZipControl(): AbstractControl {
    return this.formData.get('planeZip') as AbstractControl;
  }

  addRoadControllers(): void {
    this.getRoadNameControl().enable();
    this.getRoadZip().enable();
  }

  removeRoadControllers(): void {
    this.getRoadNameControl().disable();
    this.getRoadZip().disable();
  }

  addAirControllers(): void {
    this.getPlaneNameControl().enable();
    this.getPlaneZipControl().enable();
  }

  removeAirControllers(): void {
    this.getPlaneNameControl().disable();
    this.getPlaneZipControl().disable();
  }

  onSubmit() {
    console.log('form data: ', this.formData);
  }
}
