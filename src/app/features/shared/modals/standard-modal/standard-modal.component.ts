import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild
} from '@angular/core';
import { DynamicComponent } from '../../../../features/dynamic-components/models/dynamic-component.model';
import { CtaModel, ModalData } from '../models/modal.model';

@Component({
  selector: 'app-standard-modal',
  templateUrl: './standard-modal.component.html',
  styleUrls: ['./standard-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandardModalComponent implements AfterViewInit, DynamicComponent {
  @ViewChild('modalBody', { static: true }) modalBody!: ElementRef;
  @ViewChild('modalFooter', { static: true }) modalFooter!: ElementRef;
  @ViewChild('backdrop', { static: true }) backdrop!: ElementRef;
  @ViewChild('modal', { static: true }) modal!: ElementRef;
  data!: ModalData;

  constructor(
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    this.buildBody();
    this.buildFooterButtons();

    this.renderer.listen(this.backdrop.nativeElement, 'click', () => {
      this.renderer.removeClass(this.modal.nativeElement, 'add');
      this.renderer.removeClass(this.backdrop.nativeElement, 'add');
    });
  }

  private buildBody(): void {
    if (this.modalBody && this.data.bodyContent) {
      this.renderer.addClass(this.modal.nativeElement, 'add');
      this.renderer.addClass(this.backdrop.nativeElement, 'add');

      this.data.bodyContent instanceof Array
        ? this.data.bodyContent.forEach((ele) => this.renderer.appendChild(this.modalBody.nativeElement, ele))
        : this.renderer.appendChild(this.modalBody.nativeElement, this.renderer.createText(this.data.bodyContent));
    }
  }

  private buildFooterButtons(): void {
    this.data.callsToAction.forEach((cta) => {
      const button = this.styleBody(cta);
      this.styleFooter(cta, button);
    });
  }

  private styleBody(cta: CtaModel) {
    const button = this.renderer.createElement(cta.HtmlElementType);
    if (cta.HtmlElementType !== 'a') {
      this.renderer.setAttribute(button, 'href', '#');
    }
    this.renderer.appendChild(button, this.renderer.createText(cta.label));

    return button;
  }

  private styleFooter(cta: CtaModel, button: any): void {
    if (cta.linkAlign) {
      this.addFooterClasses(button, cta.linkAlign);
    } else if (cta.buttonAlign) {
      this.addFooterClasses(button, cta.buttonAlign);
    }
    this.renderer.appendChild(this.modalFooter.nativeElement, button);

    this.renderer.listen(button, 'click', (event) => {
      event.preventDefault();
      this.renderer.removeClass(this.modal.nativeElement, 'add');
      this.renderer.removeClass(this.backdrop.nativeElement, 'add');
      cta.action();
    });
  }

  private addFooterClasses(button: any, alignType: string): void {
    this.renderer.addClass(button, 'modal__action');
    switch (alignType) {
      case 'left':
        this.renderer.addClass(button, 'left');
        break;

      case 'right':
        this.renderer.addClass(button, 'right');
        break;

      case 'center':
      default:
        this.renderer.addClass(button, 'center');
        break;
    }
  }
}
