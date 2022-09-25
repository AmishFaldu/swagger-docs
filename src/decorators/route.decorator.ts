import { RequestHandler } from "express";
import {
  DTO_DECORATOR_METADATA_ENUM,
  ROUTE_DECORATOR_METADATA_ENUM,
} from "../constants/decorator.constants";
import {
  ClassType,
  DecoratorGeneratorType,
  DeepReadonly,
  IRouteBody,
  IRouteMiddleware,
} from "../interfaces";

/**
 * Common route body decorator for api request and response
 * @param bodyType - Route body type. To determine if it is request body or response body
 * @param routeBodyData - Route body data
 * @returns Typescript property decorator
 */
const routeBodyDecorator = (
  bodyType: ROUTE_DECORATOR_METADATA_ENUM,
  routeBodyData: DeepReadonly<IRouteBody>,
): PropertyDecorator => {
  return (target: ClassType, property: string): void => {
    Reflect.defineMetadata(bodyType, routeBodyData, target, property);
    if (typeof routeBodyData.type === typeof class {}) {
      const dependencies =
        (Reflect.getMetadata(
          DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA_DEPENDENCY,
          target,
          property,
        ) as unknown[] | undefined) ?? [];
      dependencies.push(routeBodyData.type);
      Reflect.defineMetadata(
        DTO_DECORATOR_METADATA_ENUM.DTO_SCHEMA_DEPENDENCY,
        dependencies,
        target,
        property,
      );
    }
  };
};

/**
 * Specify route's response body.
 * It could be enum or dto class or literal types.
 * @param type - Type of response body
 * @param options - Options for response body
 * @returns Typescript property decorator
 */
export const RouteResponseBody = (
  type: IRouteBody["type"],
  options: Readonly<IRouteBody["options"]> = {},
): PropertyDecorator => {
  const response: IRouteBody = {
    type,
    options,
  };
  return routeBodyDecorator(
    ROUTE_DECORATOR_METADATA_ENUM.RESPONSE_BODY,
    response,
  );
};

/**
 * Sepcify route's request body.
 * It could be enum or dto class or literal types.
 * @param type - Type of request body
 * @param options - Options for request body
 * @returns Typescript property decorator
 */
export const RouteRequestBody = (
  type: IRouteBody["type"],
  options: Readonly<IRouteBody["options"]> = {},
): PropertyDecorator => {
  const request: IRouteBody = {
    type,
    options,
  };
  return routeBodyDecorator(
    ROUTE_DECORATOR_METADATA_ENUM.REQUEST_BODY,
    request,
  );
};

/**
 * Route middleware decorator for registering middlewares for routes or controllers
 * @param middlewareFunctions - Array of middleware functions to use
 * @param options - Middleware function options
 * @returns Either a class or method decorator,
 * if applied anywhere except class or method throws exception
 */
const routeMiddlewareDecorator = (
  middlewareFunctions: Readonly<RequestHandler[]>,
  options: Readonly<IRouteMiddleware["options"]>,
): DecoratorGeneratorType => {
  return (...args: Readonly<any[]>) => {
    if (args.length === 1) {
      const target = args[0];
      const routeMiddlewares: IRouteMiddleware[] =
        Reflect.getMetadata(ROUTE_DECORATOR_METADATA_ENUM.MIDDLEWARE, target) ??
        [];

      routeMiddlewares.push({
        middlewareFunctions,
        options,
      });
      Reflect.defineMetadata(
        ROUTE_DECORATOR_METADATA_ENUM.MIDDLEWARE,
        routeMiddlewares,
        target,
      );
      return;
    } else if (args.length === 3 && typeof args[2] !== "number") {
      const target = args[0];
      const property = args[1];
      const routeMiddlewares: IRouteMiddleware[] =
        Reflect.getMetadata(
          ROUTE_DECORATOR_METADATA_ENUM.MIDDLEWARE,
          target,
          property,
        ) ?? [];

      routeMiddlewares.push({
        middlewareFunctions,
        options,
      });
      Reflect.defineMetadata(
        ROUTE_DECORATOR_METADATA_ENUM.MIDDLEWARE,
        routeMiddlewares,
        target,
        property,
      );
      return;
    }
    throw new Error(
      "Cannot apply middleware decorator anywhere except controller and methods",
    );
  };
};

/**
 * Adds middleware function to route and controller
 * @param middlewareFunctions - Middleware function
 * @returns Typescript decorator function
 */
export const RouteMiddleware = (
  middlewareFunctions: Readonly<RequestHandler[]>,
  options: Readonly<IRouteMiddleware["options"]> = { before: true },
): DecoratorGeneratorType => {
  return routeMiddlewareDecorator(middlewareFunctions, options);
};
