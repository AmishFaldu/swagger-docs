import "reflect-metadata";
import { IRouteHandlerMetadata } from "src/interfaces";
import { DECORATOR_METADATA_ENUM } from "../constants";

export const Get = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "GET",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};

export const Put = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "PUT",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};

export const Post = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "POST",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};

export const Delete = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "DELETE",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};

export const Options = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "OPTIONS",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};

export const Head = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "HEAD",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};

export const Patch = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "PATCH",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};

export const Trace = (
  routePath: string = ""
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  const routeHandlerMetadata: IRouteHandlerMetadata = {
    method: "TRACE",
    path: routePath,
  };
  return Reflect.metadata(
    DECORATOR_METADATA_ENUM.ROUTE_HANDLER_METADATA,
    routeHandlerMetadata
  );
};
