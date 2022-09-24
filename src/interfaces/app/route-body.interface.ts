import { ClassType, EnumType } from "../types";

interface IRouteEnumBody {
  type: EnumType;
  options: {
    isArray?: boolean;
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
  };
}

export interface IRouteObjectBody {
  type: ClassType;
  options: {
    isArray?: boolean;
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
  };
}

export interface IRouteLiteralBody {
  type: "Boolean" | "Number" | "Object" | "String" | "Undefined";
  options: {
    isArray?: boolean;
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
  };
}

export type IRouteBody = IRouteEnumBody | IRouteLiteralBody | IRouteObjectBody;
