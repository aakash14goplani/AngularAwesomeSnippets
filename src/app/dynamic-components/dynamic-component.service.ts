import {
  ComponentFactoryResolver, Injectable, Renderer2, RendererFactory2, ViewContainerRef
} from '@angular/core';
import { ErrorComponentComponent } from '../form-validation/error-component/error-component.component';
import { ComponentConfig } from './component-config.model';
import { DynamicComponent } from './dynamic-component.model';
import { DynamicItem } from './dynamic-item.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  private renderer: Renderer2;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  loadComponentIntoNode(vcr: ViewContainerRef, dynamicItem: DynamicItem, parentNode = null): void {
    if (dynamicItem.component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicItem.component);
      const componentRef = vcr.createComponent(componentFactory);
      this.renderer.appendChild(parentNode || vcr.element.nativeElement, componentRef.injector.get(ErrorComponentComponent).elementRef.nativeElement);
      (componentRef.instance as DynamicComponent).data = dynamicItem.data;
    }
  }

  buildDynamicItem(componentConfig: ComponentConfig): DynamicItem {
    return new DynamicItem(componentConfig.dynamicComponentType, componentConfig.data);
  }
}
