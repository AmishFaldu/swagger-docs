export type RouteHandlerMethods =
  | "GET"
  | "PUT"
  | "POST"
  | "DELETE"
  | "OPTIONS"
  | "HEAD"
  | "PATCH"
  | "TRACE";

export interface IRouteHandlerMetadata {
  method: RouteHandlerMethods;
  path: string;
}
