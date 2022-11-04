import { NextFunction, Request, Response } from "express";
import { RouteHandlerFunctionType } from "../types";
import { RouteHandlerMethods } from "./route-handler-metadata.interface";

export interface IBootstrapControllerRoute {
  fullRoutePath: string;
  routeMethod: RouteHandlerMethods;
  routeHandlerName: string;
  routeHandler: RouteHandlerFunctionType;
}

export interface IRouterHandlerArgs {
  req: Request & { files?: any[] };
  res: Response;
  next: NextFunction;
}

export interface IExpressRouterMappingRouteData {
  fullRoutePath: string;
  routeHandlerName: string;
  routeHandler: RouteHandlerFunctionType;
}
