import "reflect-metadata";
import { DECORATOR_METADATA_ENUM } from "../constants/decorator.constants";

export const Controller = (controllerData: { route: string }) => {
  return Reflect.metadata(DECORATOR_METADATA_ENUM.CONTROLLER, controllerData);
};
