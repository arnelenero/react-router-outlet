import type RouteDefinition from './types/RouteDefinition';
import type GuardedRoute from './types/GuardedRoute';
/**
 * Returns whether the route is guarded
 *
 * @param route
 * @returns a type predicate
 */
export default function isGuarded(route: RouteDefinition): route is GuardedRoute;
