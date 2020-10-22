export interface LocationObj {
  pathname?: string;
  search?: string;
  state?: unknown;
  hash?: string;
  key?: string;
}

export type RedirectFn<P = object> = (
  props: RouterOutletProps<P>,
  route: RouteDefinition<P>
) => string | LocationObj;

export interface WithOptionalRoutesProp<Q = any> {
  routes: RouteDefinition<Q>[];
}

export interface RouteDefinition<P = object> {
  path?: string | string[];
  exact?: boolean;
  strict?: boolean;
  push?: boolean;
  component?: React.ComponentType<WithOptionalRoutesProp>;

  /**
   * Unconditionally redirects to a different route.
   *
   * You can specify a lazy-evaluated function if the redirection must depend on props of the outlet:
   * ```
   *   (props: RouterOutletProps, route: RouteDefinition) => string | LocationObj
   * ```
   */
  redirectTo?: string | LocationObj | RedirectFn<P>;

  /**
   * Route guard function. Should evaluate to `true` for the routing to proceed.
   */
  canEnter?: (
    props: RouterOutletProps<P>,
    route: RouteDefinition<P>
  ) => boolean;

  /**
   * Redirects to a different route whenever the guard function evaluates to `false`.
   *
   * You can specify a lazy-evaluated function if the redirection must depend on props of the outlet:
   * ```
   *   (props: RouterOutletProps, route: RouteDefinition) => string | LocationObj
   * ```
   */
  fallback?: string | LocationObj | RedirectFn<P>;

  /**
   * Sub-routes that will be passed to this route's target component.
   *
   * The component should accept a `routes` prop, and have a `<RouterOutlet>` in its subtree.
   */
  routes?: RouteDefinition<any>[];

  [annotation: string]: any;
}

/**
 * Routes defined in a declarative list.
 */
export type Routes<P = object> = RouteDefinition<P>[];

export type RouterOutletProps<P = object> = {
  routes: RouteDefinition<P>[];
  placeholder?: React.ComponentType;
  [key: string]: any;
} & P;

/**
 * Routing component that renders different child components depending on route.
 */
export function RouterOutlet<P = object>(
  props: RouterOutletProps<P>
): JSX.Element;
