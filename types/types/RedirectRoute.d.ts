import type PathMatcher from './PathMatcher';
import type RedirectTarget from './RedirectTarget';
import type { RouterOutletProps } from '../RouterOutlet';
/**
 * Route that unconditionally redirects to another route
 */
export default interface RedirectRoute<P extends object = any> extends PathMatcher {
    /** Full or partial pattern for route's URL path */
    path: string;
    /**
     * The target route of the redirection
     *
     * You can specify either a URL path or a `LocationObj`.
     * This can also be a callback function if the redirect
     * must depend on props of the outlet.
     */
    redirectTo: RedirectTarget | ((props: RouterOutletProps<P>, route: RedirectRoute<P>) => RedirectTarget);
    /** If `true`, redirecting will push a new history entry instead of replacing the current */
    push?: boolean;
}
