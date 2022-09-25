import { RequestHandler } from "express";

export interface IRouteMiddleware {
  middlewareFunctions: Readonly<RequestHandler[]>;
  options: {
    before?: boolean;
    after?: boolean;
  };
}
