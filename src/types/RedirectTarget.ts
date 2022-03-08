export interface LocationObj {
  pathname?: string
  search?: string
  state?: unknown
  hash?: string
  key?: string
}

type RedirectTarget = string | LocationObj

export default RedirectTarget
