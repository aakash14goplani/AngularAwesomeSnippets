import { FormGroup } from '@angular/forms';

/**
 * @description Iterate through all of FormGroup's controls and marks them dirty and touched.
 * Allowing for validation to occur again.
 * @param group {FormGroup}
 * @returns void
 */
export const validateForm = (group: FormGroup): void => {
  Object.keys(group.controls).forEach((key) => {
    const value = group.controls[key];
    if (value instanceof FormGroup) {
      value.markAsDirty();
      value.markAllAsTouched();
      validateForm(value);
      value.updateValueAndValidity({ onlySelf: true });
    } else {
      value.markAsDirty();
      value.markAsTouched();
      value.updateValueAndValidity({ onlySelf: true });
    }
  });
};
