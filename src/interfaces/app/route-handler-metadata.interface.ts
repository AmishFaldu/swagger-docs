export type RouteHandlerMethods =
  "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "TRACE";

export interface IRouteHandlerMetadata {
  method: RouteHandlerMethods;
  path: string;
}
