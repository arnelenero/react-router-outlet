import type DirectRoute from './DirectRoute';
import type RedirectTarget from './RedirectTarget';
import type { RouterOutletProps } from '../RouterOutlet';
/**
 * Route that loads a component in the outlet only if the
 * guard condition is met
 */
export default interface GuardedRoute<P extends object = any, Q extends object = any, C extends object = any> extends DirectRoute<P, Q, C> {
    /**
     * Route guard function. Should evaluate to `true` for the
     * routing to proceed.
     * */
    canEnter: (props: RouterOutletProps<P>, route: GuardedRoute<P>) => boolean;
    /**
     * Redirects to a different route whenever the guard function
     * evaluates to `false`
     *
     * You can specify either a URL path or a `LocationObj`.
     * This can also be a callback function if the redirect
     * must depend on props of the outlet.
     */
    fallback: RedirectTarget | ((props: RouterOutletProps<P>, route: GuardedRoute<P>) => RedirectTarget);
    /**
     * If `true`, redirecting will push a new history entry
     * instead of replacing the current
     * */
    push?: boolean;
}
