import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelDrivenFormComponent } from './model-driven-form/model-driven-form.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';

const routes: Routes = [
  { path: 'template-driven-form', component: TemplateDrivenFormComponent },
  { path: 'model-driven-form', component: ModelDrivenFormComponent },
  { path: '**', component: TemplateDrivenFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
