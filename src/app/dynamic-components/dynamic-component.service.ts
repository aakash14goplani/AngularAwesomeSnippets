import {
  ComponentFactoryResolver, Injectable, Renderer2, RendererFactory2, ViewContainerRef
} from '@angular/core';
import { ErrorComponent } from '../form-validation/error-component/error-component';
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

  /**
   * @description Creates Dynamic Component and attaches it to provided view ref
   * @param vcr {ViewContainerRef} reference in DOM where newly created dynamic component is
   * to be displayed
   * @param dynamicItem {DynamicItem} configuration object
   * @param parentNode OPTIONAL - if specified attaches dynamic component to parent node
   * else on VCR
   * @returns {void}
   */
  loadComponentIntoNode(vcr: ViewContainerRef, dynamicItem: DynamicItem, parentNode = null): void {
    if (dynamicItem.component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicItem.component);
      const componentRef = vcr.createComponent(componentFactory);
      const newChild = componentRef.injector.get(ErrorComponent).elementRef.nativeElement;
      this.renderer.appendChild(parentNode || vcr.element.nativeElement, newChild);
      (componentRef.instance as DynamicComponent).data = dynamicItem.data;
    }
  }

  buildDynamicItem(componentConfig: ComponentConfig): DynamicItem {
    return new DynamicItem(componentConfig.dynamicComponentType, componentConfig.data);
  }
}
