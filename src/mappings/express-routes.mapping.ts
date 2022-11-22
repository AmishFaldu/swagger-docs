import {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { ROUTE_DECORATOR_METADATA_ENUM } from "src/constants/decorator.constants";
import {
  ClassType,
  DeepReadonly,
  IExpressRouterMappingRouteData,
  IRouteMiddleware,
  RouteHandlerMethods,
} from "../interfaces";
import { generateRouteHandlerArgs } from "../utils/route-handler.util";

/**
 * Fetches and returns middlewares from reflect metadata
 * @param controller - Controller class
 * @param routeHandlerName - Route handler method name in controller class
 * @returns Route middlewares
 */
const getMiddlewaresForRoute = (
  controller: ClassType,
  routeHandlerName: string,
): {
  beforeMiddlewares: RequestHandler[];
  afterMiddlewares: RequestHandler[];
} => {
  const beforeMiddlewares: RequestHandler[] = [];
  const afterMiddlewares: RequestHandler[] = [];
  const controllerMiddleware =
    Reflect.getMetadata(ROUTE_DECORATOR_METADATA_ENUM.MIDDLEWARE, controller) ??
    [];
  const routeHandlerMiddlewares =
    Reflect.getMetadata(
      ROUTE_DECORATOR_METADATA_ENUM.MIDDLEWARE,
      controller.prototype,
      routeHandlerName,
    ) ?? [];
  const routeMiddlewaresMetadata: IRouteMiddleware[] = [
    ...controllerMiddleware,
    ...routeHandlerMiddlewares,
  ];

  routeMiddlewaresMetadata.forEach(
    (middleware: DeepReadonly<IRouteMiddleware>) => {
      if (middleware.options.after === true) {
        afterMiddlewares.unshift(...middleware.middlewareFunctions);
      }
      if (middleware.options.before === true) {
        beforeMiddlewares.unshift(...middleware.middlewareFunctions);
      }
    },
  );
  return { afterMiddlewares, beforeMiddlewares };
};

/**
 * Wrapper around route handler functions to better handler response and exceptions
 * @param controller - Controller class
 * @param routeData - Route handler data
 * @param hasAfterMiddlewares - Boolean indicating whether this route handler
 * will execute middlewares function after executing itself
 * @returns A wrapped request handler function
 */
const wrappedRouteHandlerFunction = (
  controller: ClassType,
  routeData: Readonly<IExpressRouterMappingRouteData>,
  hasAfterMiddlewares: boolean,
): RequestHandler => {
  return async (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    req: Request & { files?: any[] },
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const routeHandlerArgs = generateRouteHandlerArgs(
        controller,
        routeData.routeHandlerName,
        {
          req,
          res,
          next,
        },
      );
      const response = await routeData.routeHandler(...routeHandlerArgs);
      if (hasAfterMiddlewares) {
        // eslint-disable-next-line require-atomic-updates
        res.locals.data = response;
        next();
        return;
      }
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
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.delete(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
  GET: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.get(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
  HEAD: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.head(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
  OPTIONS: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.options(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
  PATCH: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.patch(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
  POST: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.post(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
  PUT: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.put(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
  TRACE: (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeData: Readonly<IExpressRouterMappingRouteData>,
  ) => {
    const { afterMiddlewares, beforeMiddlewares } = getMiddlewaresForRoute(
      controller,
      routeData.routeHandlerName,
    );
    app.trace(
      routeData.fullRoutePath,
      beforeMiddlewares,
      wrappedRouteHandlerFunction(
        controller,
        routeData,
        afterMiddlewares.length > 0,
      ),
      afterMiddlewares,
    );
  },
};
