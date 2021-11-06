import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild
} from '@angular/core';
import { DynamicComponent } from 'src/app/features/dynamic-components/models/dynamic-component.model';
import { AlertData } from '../models/alert.model';

@Component({
  selector: 'app-page-message',
  templateUrl: './page-message.component.html',
  styleUrls: ['./page-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageMessageComponent implements AfterViewInit, DynamicComponent {
  @ViewChild('alertTitle', { static: true }) alertTitle!: ElementRef;
  @ViewChild('alertBody', { static: true }) alertBody!: ElementRef;
  data!: AlertData;

  constructor(
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    this.buildTitle();
    this.buildBody();
  }

  private buildBody(): void {
    if (this.alertBody && this.data.bodyContent) {
      this.renderer.appendChild(this.alertBody.nativeElement, this.renderer.createText(this.data.bodyContent));
    }
  }

  private buildTitle(): void {
    if (this.alertTitle && this.data.header) {
      this.renderer.addClass(this.alertTitle.nativeElement, this.data.headerAlign);
      this.renderer.appendChild(this.alertTitle.nativeElement, this.renderer.createText(this.data.header));
    }
  }
}
