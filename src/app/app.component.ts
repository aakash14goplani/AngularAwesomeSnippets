import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ComponentConfig } from './features/dynamic-components/models/component-config.model';
import { ConfigurationService } from './features/dynamic-components/services/configuration.service';
import { AlertData } from './features/shared/alerts/models/alert.model';
import { PageMessageComponent } from './features/shared/alerts/page-message/page-message.component';
import { LoadingModalComponent } from './features/shared/modals/loading-modal/loading-modal.component';
import { StandardModalComponent } from './features/shared/modals/standard-modal/standard-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  standardAlertMessage!: AlertData;
  pageAlertMessage!: AlertData;
  displayPageMessage = false;

  constructor(
    private dynamicModalAndAlertConfigService: ConfigurationService
  ) { }

  ngOnInit(): void {
    // immutable assign for cdr
    this.standardAlertMessage = {
      ...this.standardAlertMessage,
      header: 'This is a standard alert—check it out!',
      headerAlign: 'center',
      alertType: 'info',
      bodyContent: 'Alerts are available for any length of text, as well as an optional dismiss button. For proper styling, use one of the eight required contextual classes.'
    };
  }

  triggerStandardModal(event: Event): void {
    event.preventDefault();

    const modalData: ComponentConfig = {
      componentType: 'modal',
      dynamicComponentType: StandardModalComponent,
      data: {
        header: 'Dynamically generated Modal',
        header2: 'This is a Standard modal with configuration object',
        alert: {
          icon: 'alert-warning',
          type: 'warning',
          size: 'md'
        },
        modalSize: 'lg',
        bodyContent: 'Body Content: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam fermentum, dui et interdum posuere, orci libero sodales magna.',
        onClose: () => this.dynamicModalAndAlertConfigService.destroyComponent(),
        callsToAction: [{
          label: 'Cancel',
          HtmlElementType: 'a',
          action: () => this.dynamicModalAndAlertConfigService.destroyComponent(),
          linkAlign: 'left'
        }, {
          label: 'Submit',
          HtmlElementType: 'button',
          action: () => this.dynamicModalAndAlertConfigService.destroyComponent(),
          buttonAlign: 'right'
        }]
      }
    };

    this.dynamicModalAndAlertConfigService.dispatchComponent(modalData);
  }

  triggerLoadingModal(event: Event): void {
    event.preventDefault();
    const modalData: ComponentConfig = {
      componentType: 'modal',
      dynamicComponentType: LoadingModalComponent,
      data: {
        header: 'Loading Data...',
        header2: 'Please stay on this page until you get confirmation message',
        alert: {
          icon: 'alert-loading',
          type: '',
          size: 'md'
        },
        bodyContent: null,
        onClose: () => { },
        callsToAction: []
      }
    };

    this.dynamicModalAndAlertConfigService.dispatchComponent(modalData);
  }

  triggerPageMessageAlert(event: Event): void {
    event.preventDefault();
    this.displayPageMessage = !this.displayPageMessage;

    const alertData: ComponentConfig = {
      componentType: 'alert',
      dynamicComponentType: PageMessageComponent,
      data: {
        header: 'Conveying meaning to assistive technologies',
        headerAlign: 'left',
        alertType: 'page-message',
        // eslint-disable-next-line max-len
        bodyContent: 'Using color to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies – such as screen readers. Ensure that information denoted by the color is either obvious from the content itself (e.g. the visible text), or is included through alternative means, such as additional text hidden with the .sr-only class.'
      }
    };

    if (this.displayPageMessage) {
      this.dynamicModalAndAlertConfigService.dispatchComponent(alertData);
    } else {
      this.dynamicModalAndAlertConfigService.destroyComponent();
    }
  }
}
