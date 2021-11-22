import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscComponent } from './misc.component';
import { MiscRoutingModule } from './misc-routing.module';

@NgModule({
  declarations: [
    MiscComponent
  ],
  imports: [
    CommonModule,
    MiscRoutingModule
  ]
})
export class MiscModule { }
