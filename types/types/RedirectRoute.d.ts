import type PathMatcher from './PathMatcher';
import type RedirectTarget from './RedirectTarget';
import type { RouterOutletProps } from '../RouterOutlet';
export default interface RedirectRoute<P extends object = any> extends PathMatcher {
    /** Full or partial pattern for route's URL path */
    path: string;
    /**
     * Unconditionally redirects to a different route
     *
     * You can specify it as callback function if the redirection
     * must depend on props of the outlet.
     */
    redirectTo: RedirectTarget | ((props: RouterOutletProps<P>, route: RedirectRoute<P>) => RedirectTarget);
    /** If `true`, redirecting will push a new history entry instead of replacing the current */
    push?: boolean;
}
