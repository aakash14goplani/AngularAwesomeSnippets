import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DynamicContainerSelectorDirective } from 'src/app/features/dynamic-components/directives/dynamic-container-selector.directive';
import { ComponentConfig } from 'src/app/features/dynamic-components/models/component-config.model';
import { ConfigurationService } from 'src/app/features/dynamic-components/services/configuration.service';

@Component({
  selector: 'app-dynamic-alert-container',
  templateUrl: './dynamic-alert.component.html',
  styleUrls: ['./dynamic-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicAlertComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicContainerSelectorDirective, { static: true }) containerSelector!: DynamicContainerSelectorDirective;

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private configService: ConfigurationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const { viewContainerRef } = this.containerSelector;

    this.configService.loadComponent$.pipe(
      takeUntil(this.destroySubject),
      tap((componentconfig: ComponentConfig) => {
        if (componentconfig.dynamicComponentType && componentconfig.componentType === 'alert') {
          this.cdr.markForCheck();
          this.configService.loadComponent(viewContainerRef, componentconfig);
        }
      })
    ).subscribe();

    this.configService.destroyComponent$.pipe(
      takeUntil(this.destroySubject),
      tap(() => viewContainerRef.clear())
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
