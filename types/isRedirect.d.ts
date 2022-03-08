import type RouteDefinition from './types/RouteDefinition';
import type RedirectRoute from './types/RedirectRoute';
/**
 * Returns whether the route is a redirect
 *
 * @param route
 * @returns a type predicate
 */
export default function isRedirect(route: RouteDefinition): route is RedirectRoute;
