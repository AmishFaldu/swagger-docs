import { NextFunction, Request, Response } from "express";
import { RouteHandlerFunctionType } from "../types";

export interface IBootstrapControllerRoute {
  routeHandlerName: string;
  controllerRoutePath: string;
}

export interface IRouterHandlerArgs {
  req: Request;
  res: Response;
  next: NextFunction;
}

export interface IExpressRouterMappingRouteData {
  formattedRoutePath: string;
  routeHandler: RouteHandlerFunctionType;
}
