import type RouteDefinition from './types/RouteDefinition';
import type DirectRoute from './types/DirectRoute';
/**
 * Returns whether the route is directed to a component
 *
 * @param route
 * @returns a type predicate
 */
export default function isDirect(route: RouteDefinition): route is DirectRoute;
