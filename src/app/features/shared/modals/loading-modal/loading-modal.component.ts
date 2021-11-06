import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild
} from '@angular/core';
import { DynamicComponent } from '../../../../features/dynamic-components/models/dynamic-component.model';
import { ModalData } from '../models/modal.model';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingModalComponent implements AfterViewInit, DynamicComponent {
  @ViewChild('backdrop', { static: true }) backdrop!: ElementRef;
  @ViewChild('modal', { static: true }) modal!: ElementRef;
  data!: ModalData;

  constructor(
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    this.buildBody();

    this.renderer.listen(this.backdrop.nativeElement, 'click', () => {
      this.renderer.removeClass(this.modal.nativeElement, 'add');
      this.renderer.removeClass(this.backdrop.nativeElement, 'add');
    });
  }

  private buildBody(): void {
    if (this.modal) {
      this.renderer.addClass(this.modal.nativeElement, 'add');
      this.renderer.addClass(this.backdrop.nativeElement, 'add');
    }
  }
}
