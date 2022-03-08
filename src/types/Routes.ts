import type RouteDefinition from './RouteDefinition'

/**
 * List of declarative route definitions
 */
type Routes<P extends object = any> = RouteDefinition<P>[]

export default Routes
