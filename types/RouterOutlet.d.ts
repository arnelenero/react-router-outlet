import React from 'react';
import PropTypes from 'prop-types';
interface WithOptionalSubroutes<Q extends object = any> {
    routes?: Routes<Q>;
}
declare type WithCustomOutletProps<P extends object = any> = Omit<RouterOutletProps<P>, 'routes' | 'placeholder'>;
export interface LocationObj {
    pathname?: string;
    search?: string;
    state?: unknown;
    hash?: string;
    key?: string;
}
export declare type RedirectTarget = string | LocationObj;
interface PathMatcher {
    /** Full or partial pattern(s) for route's URL path */
    path?: string | string[];
    /** If `true`, the path should be an exact (full) match */
    exact?: boolean;
    /** If `true`, trailing slashes matter in matching */
    strict?: boolean;
}
export interface DirectRoute<P extends object = any, Q extends object = any, C extends object = any> extends PathMatcher {
    /** Component to load when the route matches */
    component: React.ComponentType<C & WithCustomOutletProps<P> & WithOptionalSubroutes<Q>>;
    /** Optional props to pass to the loaded component */
    componentProps?: C;
    /** Optional metadata associated with the route */
    data?: Record<string, any>;
    /** Sub-routes for the component's child router outlet (if any) */
    routes?: Routes<Q>;
}
export interface GuardedRoute<P extends object = any, Q extends object = any, C extends object = any> extends DirectRoute<P, Q, C> {
    /** Route guard function. Should evaluate to `true` for the routing to proceed. */
    canEnter: (props: RouterOutletProps<P>, route: GuardedRoute<P>) => boolean;
    /**
     * Redirects to a different route whenever the guard function
     * evaluates to `false`
     *
     * You can specify it as callback function if the redirection
     * must depend on props of the outlet.
     */
    fallback: RedirectTarget | ((props: RouterOutletProps<P>, route: GuardedRoute<P>) => RedirectTarget);
    /** If `true`, redirecting will push a new history entry instead of replacing the current */
    push?: boolean;
}
export interface RedirectRoute<P extends object = any> extends PathMatcher {
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
/** Declarative definition format for routes */
export declare type RouteDefinition<P extends object = any> = DirectRoute<P> | GuardedRoute<P> | RedirectRoute<P>;
/** List of declarative route definitions */
export declare type Routes<P extends object = any> = RouteDefinition<P>[];
/**
 * Returns whether the route is directed to a component
 *
 * @param route
 * @returns a type predicate
 */
export declare function isDirect(route: RouteDefinition): route is DirectRoute;
/**
 * Returns whether the route is guarded
 *
 * @param route
 * @returns a type predicate
 */
export declare function isGuarded(route: RouteDefinition): route is GuardedRoute;
/**
 * Returns whether the route is a redirect
 *
 * @param route
 * @returns a type predicate
 */
export declare function isRedirect(route: RouteDefinition): route is RedirectRoute;
/** Standard props for `RouterOutlet` component */
export declare type RouterOutletProps<P extends object> = {
    routes: Routes<P>;
    placeholder?: React.ComponentType;
} & P;
/**
 * Routing component that renders different child components
 * depending on route
 *
 * A placeholder component can be specified to temporarily
 * display while a child component is loading.
 */
export declare function RouterOutlet<P extends object>(props: RouterOutletProps<P>): JSX.Element;
export declare namespace RouterOutlet {
    var propTypes: {
        routes: PropTypes.Validator<(PropTypes.InferProps<{
            path: PropTypes.Requireable<string | (string | null | undefined)[]>;
            exact: PropTypes.Requireable<boolean>;
            strict: PropTypes.Requireable<boolean>;
            component: PropTypes.Requireable<object>;
            canEnter: PropTypes.Requireable<(...args: any[]) => any>;
            fallback: PropTypes.Requireable<string | object>;
            redirectTo: PropTypes.Requireable<string | object>;
            push: PropTypes.Requireable<boolean>;
        }> | null | undefined)[]>;
        placeholder: PropTypes.Requireable<object>;
    };
}
export default RouterOutlet;
