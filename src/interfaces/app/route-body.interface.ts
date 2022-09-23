import { ClassType } from "../../app-config";

export interface IRouteBody {
  type: ClassType | "Boolean" | "Number" | "Object" | "String" | "Undefined";
  options: {
    isArray?: boolean;
    isEnum?: boolean;
  };
}
