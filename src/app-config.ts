import { Express, NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "./constants";
import {
  IControllerMetadata,
  IRouteArgMetadata,
  IRouteHandlerMetadata,
  RouteHandlerMethods,
} from "./interfaces";

export interface ClassType<T = any> extends Function {
  new (...args: any[]): T;
}

export class AppConfig {
  private static formatRoutePath(routePath: string) {
    let formattedRoute = routePath;
    formattedRoute =
      formattedRoute.slice(0, 1) === "/"
        ? formattedRoute
        : `/${formattedRoute}`;
    formattedRoute =
      formattedRoute.slice(-1) === "/"
        ? formattedRoute.slice(0, -1)
        : formattedRoute;
    return formattedRoute;
  }

  private static getControllerRoutePath(controller: ClassType) {
    const controllerMetadata: IControllerMetadata = Reflect.getMetadata(
      DECORATOR_METADATA_ENUM.CONTROLLER,
      controller
    );
    return this.formatRoutePath(controllerMetadata.route);
  }

  private static fetchRouteArgValue(
    argDetails: IRouteArgMetadata,
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    const argType = argDetails.type;
    switch (argType) {
      case DECORATOR_METADATA_ENUM.PATH_PARAM:
        if (!argDetails?.data?.paramname) {
          return undefined;
        }
        return req.params[argDetails.data.paramname];
      case DECORATOR_METADATA_ENUM.QUERY_PARAM:
        if (!argDetails?.data?.paramname) {
          return undefined;
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
        if (!argDetails?.data?.paramname) {
          return undefined;
        }
        return req[argDetails.data.paramname];
      case DECORATOR_METADATA_ENUM.HEADER:
        if (!argDetails?.data?.paramname) {
          return undefined;
        }
        return req.header[argDetails.data.paramname];
      default:
        return undefined;
    }
  }

  private static generateRouteHandlerArgs(
    controller: ClassType,
    routeHandlerName: string,
    req: Request,
    res: Response,
    next: NextFunction
  ): any[] {
    let routeArgs = [];
    const routeArgsMappging = Reflect.getMetadata(
      DECORATOR_METADATA_ENUM.ROUTE_HANDLER_ARGS,
      controller.prototype,
      routeHandlerName
    );
    if (routeArgsMappging) {
      Object.keys(routeArgsMappging).forEach((argIndex: string) => {
        const intArgIndex = parseInt(argIndex);

        routeArgs = [
          ...(routeArgs.slice(0, intArgIndex) || []),
          this.fetchRouteArgValue(routeArgsMappging[argIndex], req, res, next),
          ...(routeArgs.slice(intArgIndex) || []),
        ];
      });
    }

    return routeArgs;
  }

  private static wrappedRouteHandlerFunction(
    controller: ClassType,
    routeHandler: Function
  ): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req, res, next) => {
      try {
        const routeHandlerArgs = this.generateRouteHandlerArgs(
          controller,
          routeHandler.name,
          req,
          res,
          next
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

  private static addRouteToExpressApp(
    app: Express,
    controller: ClassType,
    routeType: RouteHandlerMethods,
    controllerRoutePath: string,
    routepath: string,
    routeHandler: Function
  ) {
    const formattedRoutePath = `${controllerRoutePath}${this.formatRoutePath(routepath)}`;
    switch (routeType) {
      case "DELETE":
        app.delete(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      case "GET":
        app.get(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      case "HEAD":
        app.head(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      case "OPTIONS":
        app.options(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      case "PATCH":
        app.patch(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      case "POST":
        app.post(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      case "PUT":
        app.put(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      case "TRACE":
        app.trace(
          formattedRoutePath,
          this.wrappedRouteHandlerFunction(controller, routeHandler)
        );
        break;
      default:
        console.error(
          "Swagger-Docs : Ignoring route with path = ",
          formattedRoutePath,
          " from controller = ",
          controller.name,
          ` : Unknown route method ${routeType} assigned`
        );
        break;
    }
  }

  public static bootstrapControllersToApp(
    app: Express,
    controllers: ClassType<any>[]
  ) {
    for (let controller of controllers) {
      const controllerroute = this.getControllerRoutePath(controller);
      const routeHandlersNames = Object.keys(
        Object.getOwnPropertyDescriptors(controller.prototype)
      );

      for (let routeHandlerName of routeHandlersNames) {
        const routeHandlerMetadata: IRouteHandlerMetadata = Reflect.getMetadata(
          DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
          controller.prototype,
          routeHandlerName
        );

        if (routeHandlerMetadata) {
          this.addRouteToExpressApp(
            app,
            controller,
            routeHandlerMetadata.method,
            controllerroute,
            routeHandlerMetadata.path,
            controller.prototype[routeHandlerName]
          );
        }
      }
    }
  }
}
