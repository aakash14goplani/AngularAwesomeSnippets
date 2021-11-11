import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { ModelDrivenFormComponent } from './model-driven-form/model-driven-form.component';
import { ErrorComponent } from './form-validation/error-component/error-component';
import { FormControlValidationDirective } from './form-validation/directives/form-control-validation.directive';
import { FormGroupValidationDirective } from './form-validation/directives/form-group-validation.directive';

@NgModule({
  declarations: [
    AppComponent,
    TemplateDrivenFormComponent,
    ModelDrivenFormComponent,
    ErrorComponent,
    FormControlValidationDirective,
    FormGroupValidationDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
