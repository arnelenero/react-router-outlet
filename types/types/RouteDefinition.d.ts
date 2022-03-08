import type DirectRoute from './DirectRoute';
import type GuardedRoute from './GuardedRoute';
import type RedirectRoute from './RedirectRoute';
/**
 * Declarative definition format for routes
 * */
declare type RouteDefinition<P extends object = any> = DirectRoute<P> | GuardedRoute<P> | RedirectRoute<P>;
export default RouteDefinition;
