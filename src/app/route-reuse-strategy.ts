// credits: https://stackoverflow.com/a/57425744/3411606 & https://stackoverflow.com/a/41515648/3411606. Also refer: https://stackoverflow.com/a/49156005/3411606

import {
  ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle, UrlSegment
} from '@angular/router';
import { isEqual } from 'lodash-es';

/**
 * Interface for object which can store both:
 * An {ActivatedRouteSnapshot}, which is useful for determining whether or not you should attach a route (see this.shouldAttach)
 * A {DetachedRouteHandle}, which is offered up by this.retrieve, in the case that you do want to attach the stored route
 */
interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  /**
   * Object which will store RouteStorageObjects indexed by keys
   * The keys will all be a path (as in route.routeConfig.path)
   * This allows us to see if we've got a route stored for the requested path
   */
  private storedRoutes: { [key: string]: RouteStorageObject } = {};

  /**
   * @description Determines if this route (and its subtree) should be detached to be reused later
   * @param route {ActivatedRouteSnapshot} the route that the user is currently on, and we would like to know if we want to store it
   * @returns {boolean} indicating that we want to (true) or do not want to (false) store that route
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data.reuseRoute || false;
  }

  /**
   * @description Stores the detached route.
   * @param route {ActivatedRouteSnapshot} This is stored for later comparison to requested routes, see `this.shouldAttach`
   * @param handle {DetachedRouteHandle} Later to be retrieved by this.retrieve, and offered up to whatever controller is using this class
   * @returns {void}
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const id = this.createIdentifier(route);
    if (route.data.reuseRoute && id.length > 0) {
      this.storedRoutes[id] = { handle, snapshot: route };
    }
  }

  /**
   * @description Determines if this route (and its subtree) should be reattached.
   * @param route {ActivatedRouteSnapshot} The route the user requested
   * @returns {boolean} indicating whether or not to render the stored route
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const id = this.createIdentifier(route);
    const storedObject = this.storedRoutes[id];
    const canAttach = !!route.routeConfig && !!storedObject;
    if (!canAttach) {
      return false;
    }

    const paramsMatch = isEqual(route.params, storedObject.snapshot.params);
    const queryParamsMatch = isEqual(route.queryParams, storedObject.snapshot.queryParams);

    return paramsMatch && queryParamsMatch;
  }

  /**
   * @description Retrieves the previously stored route.
   * @param route {ActivatedRouteSnapshot} New route the user has requested
   * @returns {DetachedRouteHandle | null} object which can be used to render the component
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const id = this.createIdentifier(route);
    // return null if the path does not have a routerConfig OR if there is no stored route for that routerConfig
    if (!route.routeConfig || !this.storedRoutes[id]) return null;
    // returns handle when the route.routeConfig.path is already stored
    return this.storedRoutes[id].handle;
  }

  /**
   * @description Determines if a route should be reused.
   * @param future {ActivatedRouteSnapshot} The route the user is going to, as triggered by the router
   * @param curr {ActivatedRouteSnapshot} The route the user is currently on
   * @returns {boolean} basically indicating true if the user intends to leave the current route
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private createIdentifier(route: ActivatedRouteSnapshot) {
    // Build the complete path from the root to the input route
    const segments: UrlSegment[][] = route.pathFromRoot.map((r) => r.url);
    const subpaths = ([] as UrlSegment[]).concat(...segments).map((segment) => segment.path);
    // Result: ${route_depth}-${path}
    return `${segments.length}-${subpaths.join('/')}`;
  }
}
