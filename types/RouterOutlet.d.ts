import React from 'react';
import PropTypes from 'prop-types';
import type Routes from './types/Routes';
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
            data: PropTypes.Requireable<object>;
            componentProps: PropTypes.Requireable<object>;
            canEnter: PropTypes.Requireable<(...args: any[]) => any>;
            fallback: PropTypes.Requireable<string | object>;
            redirectTo: PropTypes.Requireable<string | object>;
            push: PropTypes.Requireable<boolean>;
        }> | null | undefined)[]>;
        placeholder: PropTypes.Requireable<object>;
    };
}
export default RouterOutlet;
