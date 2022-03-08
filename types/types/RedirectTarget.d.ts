export interface LocationObj {
    pathname?: string;
    search?: string;
    state?: unknown;
    hash?: string;
    key?: string;
}
declare type RedirectTarget = string | LocationObj;
export default RedirectTarget;
