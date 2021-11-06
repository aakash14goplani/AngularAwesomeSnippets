import { Injectable, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ComponentConfig } from '../models/component-config.model';
import { DynamicComponentFactoryService } from './dynamic-component-factory.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private $loadComponent: Subject<ComponentConfig> = new Subject<ComponentConfig>();
  private $destroyComponent: Subject<void> = new Subject();
  loadComponent$: Observable<ComponentConfig> = this.$loadComponent.asObservable();
  destroyComponent$: Observable<void> = this.$destroyComponent.asObservable();

  constructor(private factoryService: DynamicComponentFactoryService) { }

  dispatchComponent(config: ComponentConfig): void {
    this.$loadComponent.next(config);
  }

  destroyComponent(): void {
    this.$destroyComponent.next();
  }

  loadComponent(vcr: ViewContainerRef, data: ComponentConfig): void {
    vcr.clear();
    const component = this.factoryService.buildDynamicItem(data);
    this.factoryService.createDynamicComponent(vcr, component);
  }
}
