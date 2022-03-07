import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router'

interface WithOptionalSubroutes<Q extends object = any> {
  routes?: Routes<Q>
}

type WithCustomOutletProps<P extends object = any> = Omit<
  RouterOutletProps<P>,
  'routes' | 'placeholder'
>

export interface LocationObj {
  pathname?: string
  search?: string
  state?: unknown
  hash?: string
  key?: string
}

export type RedirectTarget = string | LocationObj

interface PathMatcher {
  /** Full or partial pattern(s) for route's URL path */
  path?: string | string[]
  /** If `true`, the path should be an exact (full) match */
  exact?: boolean
  /** If `true`, trailing slashes matter in matching */
  strict?: boolean
}

export interface DirectRoute<
  P extends object = any,
  Q extends object = any,
  C extends object = any,
> extends PathMatcher {
  /** Component to load when the route matches */
  component: React.ComponentType<
    C & WithCustomOutletProps<P> & WithOptionalSubroutes<Q>
  >
  /** Optional props to pass to the loaded component */
  componentProps?: C
  /** Optional metadata associated with the route */
  data?: Record<string, any>
  /** Sub-routes for the component's child router outlet (if any) */
  routes?: Routes<Q>
}

export interface GuardedRoute<
  P extends object = any,
  Q extends object = any,
  C extends object = any,
> extends DirectRoute<P, Q, C> {
  /** Route guard function. Should evaluate to `true` for the routing to proceed. */
  canEnter: (props: RouterOutletProps<P>, route: GuardedRoute<P>) => boolean

  /**
   * Redirects to a different route whenever the guard function
   * evaluates to `false`
   *
   * You can specify it as callback function if the redirection
   * must depend on props of the outlet.
   */
  fallback:
    | RedirectTarget
    | ((props: RouterOutletProps<P>, route: GuardedRoute<P>) => RedirectTarget)

  /** If `true`, redirecting will push a new history entry instead of replacing the current */
  push?: boolean
}

export interface RedirectRoute<P extends object = any> extends PathMatcher {
  /** Full or partial pattern for route's URL path */
  path: string

  /**
   * Unconditionally redirects to a different route
   *
   * You can specify it as callback function if the redirection
   * must depend on props of the outlet.
   */
  redirectTo:
    | RedirectTarget
    | ((props: RouterOutletProps<P>, route: RedirectRoute<P>) => RedirectTarget)

  /** If `true`, redirecting will push a new history entry instead of replacing the current */
  push?: boolean
}

/** Declarative definition format for routes */
export type RouteDefinition<P extends object = any> =
  | DirectRoute<P>
  | GuardedRoute<P>
  | RedirectRoute<P>

/** List of declarative route definitions */
export type Routes<P extends object = any> = RouteDefinition<P>[]

/**
 * Returns whether the route is directed to a component
 *
 * @param route
 * @returns a type predicate
 */
export function isDirect(route: RouteDefinition): route is DirectRoute {
  return (route as DirectRoute).component !== undefined
}

/**
 * Returns whether the route is guarded
 *
 * @param route
 * @returns a type predicate
 */
export function isGuarded(route: RouteDefinition): route is GuardedRoute {
  return (route as GuardedRoute).canEnter !== undefined
}

/**
 * Returns whether the route is a redirect
 *
 * @param route
 * @returns a type predicate
 */
export function isRedirect(route: RouteDefinition): route is RedirectRoute {
  return (route as RedirectRoute).redirectTo !== undefined
}

/** Standard props for `RouterOutlet` component */
export type RouterOutletProps<P extends object> = {
  routes: Routes<P>
  placeholder?: React.ComponentType
} & P

/**
 * Routing component that renders different child components
 * depending on route
 *
 * A placeholder component can be specified to temporarily
 * display while a child component is loading.
 */
export function RouterOutlet<P extends object>(props: RouterOutletProps<P>) {
  const { routes, placeholder, ...outletProps } = props

  const redirectJsx = (route: RouteDefinition, index: number) => {
    const r = route as RedirectRoute & { redirectTo: RedirectTarget }
    return (
      <Redirect
        key={index}
        from={r.path}
        exact={r.exact}
        strict={r.strict}
        to={r.redirectTo}
        push={r.push}
      />
    )
  }

  const fallbackJsx = (route: RouteDefinition, index: number) => {
    const r = route as GuardedRoute & { fallback: RedirectTarget }
    return (
      <Redirect
        key={index}
        from={r.path as string}
        exact={r.exact}
        strict={r.strict}
        to={r.fallback}
        push={r.push}
      />
    )
  }

  const routeJsx = (route: RouteDefinition, index: number) => {
    const r = route as DirectRoute
    return (
      <Route
        key={index}
        path={r.path}
        exact={r.exact}
        strict={r.strict}
        render={() => (
          <Suspense fallback={placeholder || <div />}>
            <r.component
              {...outletProps}
              {...r.componentProps}
              routes={r.routes}
            />
          </Suspense>
        )}
      />
    )
  }

  return (
    <Switch>
      {routes.map((route, index) => {
        route = resolveFromProps(route, props)

        return isRedirect(route)
          ? redirectJsx(route, index)
          : isGuarded(route) && !route.canEnter(props, route)
          ? fallbackJsx(route, index)
          : routeJsx(route, index)
      })}
    </Switch>
  )
}

function resolveFromProps(
  route: RouteDefinition,
  props: RouterOutletProps<any>,
): RouteDefinition {
  const resolveValue = (val: any) =>
    typeof val === 'function' ? val(props, route) : val

  if (isRedirect(route)) {
    return {
      ...route,
      redirectTo: resolveValue(route.redirectTo),
    }
  }

  if (isGuarded(route))
    return {
      ...route,
      fallback: resolveValue(route.fallback),
    }

  return route
}

const routePropType = PropTypes.shape({
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  canEnter: PropTypes.func,
  fallback: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object,
  ]),
  redirectTo: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object,
  ]),
  push: PropTypes.bool,
})

RouterOutlet.propTypes = {
  routes: PropTypes.arrayOf(routePropType).isRequired,
  placeholder: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
}

export default RouterOutlet
