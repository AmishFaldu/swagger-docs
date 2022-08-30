import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";

export const Get = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.GET_ROUTE, routePath);
};

export const Put = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.PUT_ROUTE, routePath);
};

export const Post = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.POST_ROUTE, routePath);
};

export const Delete = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.DELETE_ROUTE, routePath);
};

export const Options = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.OPTIONS_ROUTE, routePath);
};

export const Head = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.HEAD_ROUTE, routePath);
};

export const Patch = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.PATCH_ROUTE, routePath);
};

export const Trace = (routePath: string = "") => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.TRACE_ROUTE, routePath);
};
