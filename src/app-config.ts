import { Express } from "express";
import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "./constants";
import {
  IBootstrapControllerRoute,
  IControllerMetadata,
  IRouteHandlerMetadata,
} from "./interfaces";
import { expressRoutesMapping } from "./mappings/express-routes.mapping";

export type ClassType<T = unknown> = new (...args: unknown[]) => T;

/**
 * Add controllers to web app
 */
export class AppConfig {

  /**
   * Bootstrap controllers to web app̦
   *
   * Builds and attaches route handlers to web app from controllers
   * @param app - Web app instance
   * @param controllers - List of controller classes
   */
  public static bootstrapControllersToApp(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controllers: Readonly<ClassType[]>,
  ): void {
    for (const controller of controllers) {
      const controllerRoutePath = this.getControllerRoutePath(controller);
      const routeHandlersNames = Object.keys(
        Object.getOwnPropertyDescriptors(controller.prototype),
      );

      for (const routeHandlerName of routeHandlersNames) {
        this.addRouteToExpressApp(app, controller, {
          routeHandlerName,
          controllerRoutePath,
        });
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
   * Add controller methods to web app based on the route decorators assigned to methods
   * @param app - Web app instance
   * @param controller - Controller class
   * @param routeDetails - Route handler details
   * @param routeDetails.routeHandlerName - Name of the route handler method in controller class
   * @param routeDetails.controllerRoutePath - Controller's route path
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private static addRouteToExpressApp(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeDetails: Readonly<IBootstrapControllerRoute>,
  ) {
    const { controllerRoutePath, routeHandlerName } = routeDetails;
    const routeHandlerMetadata: IRouteHandlerMetadata | undefined =
      Reflect.getMetadata(
        DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
        controller.prototype,
        routeHandlerName,
      );
    if (!routeHandlerMetadata) {
      return;
    }

    const formattedRoutePath = `${controllerRoutePath}${this.formatRoutePath(
      routeHandlerMetadata.path,
    )}`;
    expressRoutesMapping[routeHandlerMetadata.method](app, controller, {
      formattedRoutePath,
      routeHandler: controller.prototype[routeHandlerName],
    });
  }
}
