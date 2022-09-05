import {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "./constants";
import {
  DeepReadonly,
  IControllerMetadata,
  IRouteArgMetadata,
  IRouteHandlerMetadata,
  RouteHandlerFunctionType,
  RouteHandlerMethods,
} from "./interfaces";

export type ClassType<T = unknown> = new (...args: unknown[]) => T;

/**
 * Add controllers to web app
 */
export class AppConfig {

  /**
   * Bootstrap controllers to web app
   *
   * Builds and attaches route handlers to web app from controllers
   * @param app - Web app instance
   * @param controllers - List of controller classes
   */
  public static bootstrapControllersToApp(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controllers: Readonly<ClassType<never>[]>,
  ): void {
    for (const controller of controllers) {
      const controllerroute = this.getControllerRoutePath(controller);
      const routeHandlersNames = Object.keys(
        Object.getOwnPropertyDescriptors(controller.prototype),
      );

      for (const routeHandlerName of routeHandlersNames) {
        const routeHandlerMetadata: IRouteHandlerMetadata | undefined =
          Reflect.getMetadata(
            DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
            controller.prototype,
            routeHandlerName,
          );

        if (routeHandlerMetadata) {
          this.addRouteToExpressApp(
            app,
            controller,
            routeHandlerMetadata.method,
            controllerroute,
            routeHandlerMetadata.path,
            controller.prototype[routeHandlerName],
          );
        }
      }
    }
  }

  /**
   * Format route path to include back slash only in front
   * @param routePath - Route path to format
   * @returns Formatted route path string
   */
  private static formatRoutePath(routePath: string): string {
    let formattedRoute = routePath;
    formattedRoute = formattedRoute.startsWith("/")
      ? formattedRoute
      : `/${formattedRoute}`;
    formattedRoute = formattedRoute.endsWith("/")
      ? formattedRoute.slice(0, -1)
      : formattedRoute;
    return formattedRoute;
  }

  /**
   * Fetches controller's route path which is applicable ot methods inside the controller
   * @param controller - Controller class
   * @returns Controller's rotue path string
   */
  private static getControllerRoutePath(controller: ClassType): string {
    const controllerMetadata: IControllerMetadata = Reflect.getMetadata(
      DECORATOR_METADATA_ENUM.CONTROLLER,
      controller,
    );
    return this.formatRoutePath(controllerMetadata.route);
  }

  /**
   * Determine and return route handler argument value
   * @param argDetails - Route handler argument metadata
   * @param req - Request Object
   * @param res - Response Object
   * @param next - Next function
   * @returns Determined argument value for route handler
   */
  private static fetchRouteArgValue(
    argDetails: DeepReadonly<IRouteArgMetadata>,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    req: Request,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    res: Response,
    next: Readonly<NextFunction>,
  ): unknown {
    const argType = argDetails.type;
    switch (argType) {
      case DECORATOR_METADATA_ENUM.PATH_PARAM:
        if (argDetails.data.paramname === undefined) {
          return null;
        }
        return req.params[argDetails.data.paramname];
      case DECORATOR_METADATA_ENUM.QUERY_PARAM:
        if (argDetails.data.paramname === undefined) {
          return null;
        }
        return req.query[argDetails.data.paramname];
      case DECORATOR_METADATA_ENUM.BODY:
        return req.body;
      case DECORATOR_METADATA_ENUM.REQUEST:
        return req;
      case DECORATOR_METADATA_ENUM.RESPONSE:
        return res;
      case DECORATOR_METADATA_ENUM.NEXT:
        return next;
      case DECORATOR_METADATA_ENUM.FILE:
      case DECORATOR_METADATA_ENUM.FILES:
        if (argDetails.data.paramname === undefined) {
          return null;
        }
        return req[argDetails.data.paramname];
      case DECORATOR_METADATA_ENUM.HEADER:
        if (argDetails.data.paramname === undefined) {
          return null;
        }
        return req.header[argDetails.data.paramname];
      default:
        return null;
    }
  }

  /**
   * Build and generate route handler arguments which are directly passed to route handler function
   * @param controller - Controller class
   * @param routeHandlerName - Route handler method name
   * @param req - Request Object
   * @param res - Response Object
   * @param next - Next function
   * @returns Generated route handler arguments in array form
   */
  private static generateRouteHandlerArgs(
    controller: DeepReadonly<ClassType>,
    routeHandlerName: string,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    req: Request,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    res: Response,
    next: Readonly<NextFunction>,
  ): unknown[] {
    let routeArgs: unknown[] = [];
    const routeArgsMappging: Record<string, IRouteArgMetadata> | undefined =
      Reflect.getMetadata(
        DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
        controller.prototype,
        routeHandlerName,
      );
    if (routeArgsMappging) {
      Object.keys(routeArgsMappging).forEach((argIndex: string) => {
        const intArgIndex = parseInt(argIndex, 10);

        routeArgs = [
          ...routeArgs.slice(0, intArgIndex),
          this.fetchRouteArgValue(routeArgsMappging[argIndex], req, res, next),
          ...routeArgs.slice(intArgIndex),
        ];
      });
    }

    return routeArgs;
  }

  /**
   * Wrapper around route handler functions to better handler response and exceptions
   * @param controller - Controller class
   * @param routeHandler - Route handler function defined in controller class
   * @returns A wrapped request handler function
   */
  private static wrappedRouteHandlerFunction(
    controller: ClassType,
    routeHandler: RouteHandlerFunctionType,
  ): RequestHandler {
    return async (
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      req: Request,
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const routeHandlerArgs = this.generateRouteHandlerArgs(
          controller,
          routeHandler.name,
          req,
          res,
          next,
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
  }

  /**
   * Add controller methods to web app based on the route decorators assigned to methods
   * @param app - Web app instance
   * @param controller - Controller class
   * @param routeType - Route handler method. For example - GET, POST, etc
   * @param controllerRoutePath - Controller's route path
   * @param routepath - Route handler's route path or Controller method's route path
   * @param routeHandler - Route handler function
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private static addRouteToExpressApp(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeType: Readonly<RouteHandlerMethods>,
    controllerRoutePath: string,
    routepath: string,
    routeHandler: RouteHandlerFunctionType,
  ) {
    const formattedRoutePath = `${controllerRoutePath}${this.formatRoutePath(
      routepath,
    )}`;
    switch (routeType) {
      case "DELETE":
        app.delete(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      case "GET":
        app.get(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      case "HEAD":
        app.head(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      case "OPTIONS":
        app.options(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      case "PATCH":
        app.patch(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      case "POST":
        app.post(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      case "PUT":
        app.put(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      case "TRACE":
        app.trace(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler),
        );
        break;
      default:
        console.error(
          "Swagger-Docs : Ignoring route with path = ",
          formattedRoutePath,
          " from controller = ",
          controller.name,
          ` : Unknown route method ${routeType} assigned`,
        );
        break;
    }
  }
}
