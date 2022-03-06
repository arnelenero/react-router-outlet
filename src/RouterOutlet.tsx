import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router'

export interface LocationObj {
  pathname?: string
  search?: string
  state?: unknown
  hash?: string
  key?: string
}

export type RedirectTarget = string | LocationObj

export type RedirectFn<P extends object> = (
  props: RouterOutletProps<P>,
  route: RouteDefinition<P>,
) => RedirectTarget

interface PathMatcher {
  path?: string | string[]
  exact?: boolean
  strict?: boolean
  push?: boolean
}

interface WithOptionalSubroutes<Q extends object = {}> {
  routes?: RouteDefinition<Q>[]
}

type WithOutletProps<P extends object> = Omit<
  RouterOutletProps<P>,
  'routes' | 'placeholder'
>

interface DirectRoute<
  P extends object = {},
  Q extends object = {},
  C extends Record<string, any> = {},
> extends PathMatcher {
  component: React.ComponentType<
    C & WithOutletProps<P> & WithOptionalSubroutes<Q>
  >
  componentProps?: C
  data?: Record<string, any>
  routes?: RouteDefinition<Q>[]
}

interface GuardedRoute<P extends object = {}, Q extends object = {}>
  extends DirectRoute<P, Q> {
  canEnter: (props: RouterOutletProps<P>, route: RouteDefinition<P>) => boolean
  fallback: RedirectTarget | RedirectFn<P>
}

interface RedirectRoute<P extends object = {}> extends PathMatcher {
  path: string
  redirectTo: RedirectTarget | RedirectFn<P>
}

export type RouteDefinition<P extends object = {}, Q extends object = {}> =
  | DirectRoute<P, Q>
  | GuardedRoute<P, Q>
  | RedirectRoute<P>

export type Routes<P extends object = {}> = RouteDefinition<P, any>[]

export type RouterOutletProps<P extends object> = {
  routes: Routes<P>
  placeholder?: React.ComponentType
} & P

export function RouterOutlet<P extends object>(props: RouterOutletProps<P>) {
  const { routes, placeholder, ...outletProps } = props

  type ResolvedFallback<R extends GuardedRoute<P, any>> = R & {
    fallback: RedirectTarget
  }
  type ResolvedRedirect<R extends RedirectRoute<P>> = R & {
    redirectTo: RedirectTarget
  }

  const redirectJsx = (route: RouteDefinition<P>, index: number) => {
    const r = route as ResolvedRedirect<RedirectRoute<P>>
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

  const fallbackJsx = (route: RouteDefinition<P>, index: number) => {
    const r = route as ResolvedFallback<GuardedRoute<P>>
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

  const routeJsx = (route: RouteDefinition<P>, index: number) => {
    const r = route as DirectRoute<P>
    return (
      <Route
        key={index}
        path={r.path}
        exact={r.exact}
        strict={r.strict}
        render={props =>
          Suspense ? (
            <Suspense fallback={placeholder || <div />}>
              <r.component
                {...outletProps}
                {...r.componentProps}
                routes={r.routes}
              />
            </Suspense>
          ) : (
            <r.component
              {...outletProps}
              {...r.componentProps}
              routes={r.routes}
            />
          )
        }
      />
    )
  }

  return (
    <Switch>
      {routes.map((route, index) => {
        route = resolveFromProps(route, props)

        return 'redirectTo' in route
          ? redirectJsx(route, index)
          : 'canEnter' in route && !route.canEnter(props, route)
          ? fallbackJsx(route, index)
          : routeJsx(route, index)
      })}
    </Switch>
  )
}

function resolveFromProps<P extends object>(
  route: RouteDefinition<P>,
  props: RouterOutletProps<P>,
): RouteDefinition<P> {
  const resolveRedirect = (val: RedirectTarget | RedirectFn<P>) =>
    typeof val === 'function' ? val(props, route) : val

  if ('redirectTo' in route)
    return {
      ...route,
      redirectTo: resolveRedirect(route.redirectTo),
    }

  if ('fallback' in route)
    return {
      ...route,
      fallback: resolveRedirect(route.fallback),
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
