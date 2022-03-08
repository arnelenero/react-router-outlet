/// <reference types="react" />
import type PathMatcher from './PathMatcher';
import type Routes from './Routes';
import type { RouterOutletProps } from '../RouterOutlet';
interface WithOptionalSubroutes<Q extends object = any> {
    routes?: Routes<Q>;
}
declare type WithCustomOutletProps<P extends object = any> = Omit<RouterOutletProps<P>, 'routes' | 'placeholder'>;
/**
 * Route that loads a component in the outlet
 */
export default interface DirectRoute<P extends object = any, Q extends object = any, C extends object = any> extends PathMatcher {
    /** Component to load when the route matches */
    component: React.ComponentType<C & WithCustomOutletProps<P> & WithOptionalSubroutes<Q>>;
    /** Optional props to pass to the loaded component */
    componentProps?: C;
    /** Optional metadata associated with the route */
    data?: Record<string, any>;
    /** Sub-routes for the component's child router outlet (if any) */
    routes?: Routes<Q>;
}
export {};
