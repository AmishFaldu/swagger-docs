import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";
import { IControllerMetadata } from "../interfaces";

/**
 * Controller decorator to define router for http route handlers.
 * Attaches reflect metadata to class defination
 * @param controllerData - Controller metadata
 * @returns Class decorator
 */
export const Controller = (
  controllerData: Readonly<IControllerMetadata>,
): ClassDecorator => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.CONTROLLER, controllerData);
};
