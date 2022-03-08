import React, { Suspense } from 'react'

import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'

import isGuarded from './isGuarded'
import isRedirect from './isRedirect'

import type DirectRoute from './types/DirectRoute'
import type GuardedRoute from './types/GuardedRoute'
import type RedirectRoute from './types/RedirectRoute'
import type RedirectTarget from './types/RedirectTarget'
import type RouteDefinition from './types/RouteDefinition'
import type Routes from './types/Routes'

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

const routePropType = PropTypes.shape({
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  data: PropTypes.object,
  componentProps: PropTypes.object,
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
