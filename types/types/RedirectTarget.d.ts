/**
 * Composed of all optional properties that describe the
 * redirection target
 */
export interface LocationObj {
    /** URL path */
    pathname?: string;
    /** Query string */
    search?: string;
    /** Values to save during redirection */
    state?: unknown;
    /** URL fragment */
    hash?: string;
    /** Unique identifier for location object */
    key?: string;
}
/**
 * Target of redirection can either be a URL path or a
 * full `LocationObj` location descriptor.
 */
declare type RedirectTarget = string | LocationObj;
export default RedirectTarget;
