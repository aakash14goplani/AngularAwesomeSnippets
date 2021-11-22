import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiscComponent } from './misc.component';

const routes: Routes = [
  { path: '', component: MiscComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscRoutingModule { }
