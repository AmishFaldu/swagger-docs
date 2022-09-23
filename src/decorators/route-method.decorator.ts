import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";
import { IRouteHandlerMetadata } from "../interfaces";

/**
 * Get route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Get = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "GET",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};

/**
 * Put route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Put = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "PUT",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};

/**
 * Post route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Post = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "POST",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};

/**
 * Delete route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Delete = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "DELETE",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};

/**
 * Options route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Options = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "OPTIONS",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};

/**
 * Head route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Head = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "HEAD",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};

/**
 * Patch route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Patch = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "PATCH",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};

/**
 * Trace route method for route handler in controller
 * @param routePath - Route path associated with handler
 * @returns Typescript method decorator
 */
export const Trace = (routePath = ""): PropertyDecorator => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "TRACE",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata,
  );
};
