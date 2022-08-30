import "reflect-metadata";
import { IControllerMetadata } from "src/interfaces";
import { DECORATOR_METADATA_ENUM } from "../constants";

export const Controller = (
  controllerData: IControllerMetadata
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
} => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.CONTROLLER, controllerData);
};
