/**
 * Core interface of routes that defines how the URL is
 * matched to path pattern(s)
 */
export default interface PathMatcher {
    /** Full or partial pattern(s) for route's URL path */
    path?: string | string[];
    /** If `true`, the path should be an exact (full) match */
    exact?: boolean;
    /** If `true`, trailing slashes matter in matching */
    strict?: boolean;
}
