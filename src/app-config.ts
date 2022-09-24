import { Express } from "express";
import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "./constants/decorator.constants";
import {
  ClassType,
  DeepReadonly,
  IBootstrapControllerRoute,
  IControllerMetadata,
  IRouteHandlerMetadata,
  ISwaggerConfig,
} from "./interfaces";
import { expressRoutesMapping } from "./mappings/express-routes.mapping";
import { swaggerPathsMapping } from "./mappings/swagger-paths.mapping";
import { deepCopyObject } from "./utils/helper-function.util";

/**
 * Add controllers to web app
 */
export class AppConfig {
  private swaggerConfig: ISwaggerConfig;

  constructor(swaggerConfig: DeepReadonly<Omit<ISwaggerConfig, "paths">>) {
    this.swaggerConfig = { ...deepCopyObject(swaggerConfig), paths: {} };

    // Added default schemas which can be useful for types except class
    this.swaggerConfig.components.schemas = {
      ...(this.swaggerConfig.components.schemas ?? {}),
      Object: {
        type: "object",
        example: {},
      },
      Boolean: {
        type: "boolean",
        example: true,
      },
      Number: {
        type: "number",
        example: 1,
      },
      String: {
        type: "string",
        example: "string",
      },
      Function: {
        type: "string",
        example: "Function",
      },
      Undefined: {
        type: "string",
        example: "undefined",
      },
    };
  }

  /**
   * Returns a copy of swagger config
   */
  public get swaggerConfigCopy(): ISwaggerConfig {
    return deepCopyObject(this.swaggerConfig);
  }

  /**
   * Sets swagger config copy to original swagger config
   */
  public set swaggerConfigCopy(swaggerConfig: DeepReadonly<ISwaggerConfig>) {
    this.swaggerConfig = deepCopyObject(swaggerConfig);
  }

  /**
   * Bootstrap controllers to web app̦
   *
   * Builds and attaches route handlers to web app from controllers
   * @param app - Web app instance
   * @param controllers - List of controller classes
   */
  public bootstrapControllersToApp(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controllers: Readonly<ClassType[]>,
  ): void {
    for (const controller of controllers) {
      const controllerRoutePath = this.getControllerRoutePath(controller);
      const routeHandlersNames = Object.keys(
        Object.getOwnPropertyDescriptors(controller.prototype),
      );

      routeHandlersNames.forEach((routeHandlerName) => {
        const routeHandlerMetadata: IRouteHandlerMetadata | undefined =
          Reflect.getMetadata(
            DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
            controller.prototype,
            routeHandlerName,
          );
        if (!routeHandlerMetadata) {
          return;
        }

        const fullRoutePath = `${controllerRoutePath}${this.formatRoutePath(
          routeHandlerMetadata.path,
        )}`;
        this.addRouteToExpressApp(app, controller, {
          fullRoutePath,
          routeHandlerName,
          routeMethod: routeHandlerMetadata.method,
        });

        this.addRouteToSwagger(controller, {
          fullRoutePath,
          routeHandlerName,
          routeMethod: routeHandlerMetadata.method,
        });
      });
    }
  }

  /**
   * Returns built swagger document
   */
  public getSwaggerDocument(): ISwaggerConfig {
    Object.freeze(this.swaggerConfig);
    return this.swaggerConfig;
  }

  /**
   * Format route path to include back slash only in front
   * @param routePath - Route path to format
   * @returns Formatted route path string
   */
  private formatRoutePath(routePath: string): string {
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
  private getControllerRoutePath(controller: ClassType): string {
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
   * @param {IBootstrapControllerRoute} routeDetails - Route handler details
   * @param routeDetails.routeHandlerName - Name of the route handler method in controller class
   * @param routeDetails.fullRoutePath - Route handler complete path
   * @param routeDetails.routeMethod - Route handler method
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private addRouteToExpressApp(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    controller: ClassType,
    routeDetails: Readonly<IBootstrapControllerRoute>,
  ) {
    const { fullRoutePath, routeMethod, routeHandlerName } = routeDetails;
    expressRoutesMapping[routeMethod](app, controller, {
      fullRoutePath,
      routeHandler: controller.prototype[routeHandlerName],
    });
  }

  /**
   * Adds route to swagger configuration
   * @param controller - Controller class
   * @param {IBootstrapControllerRoute} routeDetails - Route handler details
   * @param routeDetails.routeHandlerName - Name of the route handler method in controller class
   * @param routeDetails.fullRoutePath - Route handler complete path
   * @param routeDetails.routeMethod - Route handler method
   */
  private addRouteToSwagger(
    controller: ClassType,
    routeDetails: Readonly<IBootstrapControllerRoute>,
  ): void {
    // binding "this" will be useful when accessing properties of class instance
    // without wasting parameters of functions
    const swaggerPathItemObject = swaggerPathsMapping[
      routeDetails.routeMethod
    ].bind(this, controller, routeDetails.routeHandlerName)();

    // Added slash at the end of string to match all the parameters by simple regex pattern
    // NOTE - We are removing this slash at the end by splicing the string-
    // so all route urls match proper format
    const swaggerRoutePath = `${routeDetails.fullRoutePath}/`
      .replace(/:.+?(?=(\/))/gi, (param) => {
        return `{${param.slice(1)}}`;
      })
      .slice(0, -1);
    this.swaggerConfig.paths[swaggerRoutePath] = swaggerPathItemObject;
  }
}
