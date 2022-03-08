export interface LocationObj {
  pathname?: string
  search?: string
  state?: unknown
  hash?: string
  key?: string
}

/**
 * Target of redirection can either be a URL path or a
 * full `LocationObj` location descriptor.
 */
type RedirectTarget = string | LocationObj

export default RedirectTarget
