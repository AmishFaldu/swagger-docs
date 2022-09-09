import {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { ClassType } from "../app-config";
import {
  IExpressRouterMappingRouteData,
  RouteHandlerFunctionType,
  RouteHandlerMethods,
} from "../interfaces";
import { generateRouteHandlerArgs } from "../utils/route-handler.util";

/**
 * Wrapper around route handler functions to better handler response and exceptions
 * @param controller - Controller class
 * @param routeHandler - Route handler function defined in controller class
 * @returns A wrapped request handler function
 */
const wrappedRouteHandlerFunction = (
  controller: ClassType,
  routeHandler: RouteHandlerFunctionType,
): RequestHandler => {
  return async (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    req: Request,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const routeHandlerArgs = generateRouteHandlerArgs(
        controller,
        routeHandler.name,
        {
          req,
          res,
          next,
        },
      );
      const response = await routeHandler(...routeHandlerArgs);
      if (!res.headersSent) {
        res.status(200).send(response);
        return;
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * An mapping object to map different controller methods to
 * appropriate express framework route methods
 */
export const expressRoutesMapping: Record<
  RouteHandlerMethods,
  (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    routeData: IExpressRouterMappingRouteData
  ) => void
> = {
  DELETE: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.delete(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
  GET: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.get(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
  HEAD: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.head(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
  OPTIONS: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.options(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
  PATCH: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.patch(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
  POST: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.post(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
  PUT: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.put(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
  TRACE: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    app.trace(
      routeData.fullRoutePath,
      wrappedRouteHandlerFunction(controller, routeData.routeHandler),
    );
  },
};
