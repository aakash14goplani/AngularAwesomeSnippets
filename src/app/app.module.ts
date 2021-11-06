import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicContainerSelectorDirective } from './features/dynamic-components/directives/dynamic-container-selector.directive';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingModalComponent } from './features/shared/modals/loading-modal/loading-modal.component';
import { StandardModalComponent } from './features/shared/modals/standard-modal/standard-modal.component';
import { DynamicModalContainerComponent } from './features/shared/modals/dynamic-modal-container/dynamic-modal-container.component';
import { DynamicAlertComponent } from './features/shared/alerts/dynamic-alert-container/dynamic-alert.component';
import { StandardAlertComponent } from './features/shared/alerts/standard-alert/standard-alert.component';
import { PageMessageComponent } from './features/shared/alerts/page-message/page-message.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicContainerSelectorDirective,
    HeaderComponent,
    FooterComponent,
    LoadingModalComponent,
    DynamicAlertComponent,
    StandardModalComponent,
    DynamicModalContainerComponent,
    StandardAlertComponent,
    PageMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
