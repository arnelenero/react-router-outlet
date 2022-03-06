import React from 'react';
import PropTypes from 'prop-types';
export interface LocationObj {
    pathname?: string;
    search?: string;
    state?: unknown;
    hash?: string;
    key?: string;
}
export declare type RedirectTarget = string | LocationObj;
export declare type RedirectFn<P extends object> = (props: RouterOutletProps<P>, route: RouteDefinition<P>) => RedirectTarget;
interface PathMatcher {
    /** Full or partial pattern(s) for route's URL path */
    path?: string | string[];
    /** If `true`, the path should be an exact (full) match */
    exact?: boolean;
    /** If `true`, trailing slashes matter in matching */
    strict?: boolean;
}
interface WithOptionalSubroutes<Q extends object = {}> {
    routes?: RouteDefinition<Q>[];
}
declare type WithOutletProps<P extends object> = Omit<RouterOutletProps<P>, 'routes' | 'placeholder'>;
interface DirectRoute<P extends object = {}, Q extends object = {}, C extends Record<string, any> = {}> extends PathMatcher {
    /** Component to load when the route matches */
    component: React.ComponentType<C & WithOutletProps<P> & WithOptionalSubroutes<Q>>;
    /** Optional props to pass to the loaded component */
    componentProps?: C;
    /** Optional metadata associated with the route */
    data?: Record<string, any>;
    /** Sub-routes for the component's child router outlet (if any) */
    routes?: RouteDefinition<Q>[];
}
interface GuardedRoute<P extends object = {}, Q extends object = {}> extends DirectRoute<P, Q> {
    /** Route guard function. Should evaluate to `true` for the routing to proceed. */
    canEnter: (props: RouterOutletProps<P>, route: RouteDefinition<P>) => boolean;
    /**
     * Redirects to a different route whenever the guard function evaluates to `false`
     *
     * You can specify a lazy-evaluated function if the redirection must depend on props of the outlet:
     * ```
     *   (props: RouterOutletProps, route: RouteDefinition) => RedirectTarget
     * ```
     */
    fallback: RedirectTarget | RedirectFn<P>;
    /** If `true`, redirecting will push a new history entry instead of replacing the current */
    push?: boolean;
}
interface RedirectRoute<P extends object = {}> extends PathMatcher {
    /** Full or partial pattern for route's URL path */
    path: string;
    /**
     * Unconditionally redirects to a different route
     *
     * You can specify a lazy-evaluated function if the redirection must depend on props of the outlet:
     * ```
     *   (props: RouterOutletProps, route: RouteDefinition) => RedirectTarget
     * ```
     */
    redirectTo: RedirectTarget | RedirectFn<P>;
    /** If `true`, redirecting will push a new history entry instead of replacing the current */
    push?: boolean;
}
/** Declarative definition format for routes */
export declare type RouteDefinition<P extends object = {}, Q extends object = {}> = DirectRoute<P, Q> | GuardedRoute<P, Q> | RedirectRoute<P>;
/** List of declarative route definitions */
export declare type Routes<P extends object = {}> = RouteDefinition<P, any>[];
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
