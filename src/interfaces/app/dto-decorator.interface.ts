import { SwaggerArrayItemType } from "../types";

export interface IArrayDecoratorArgs {
  type: "array";
  options: {
    itemType: SwaggerArrayItemType;
    isItemEnum?: boolean;
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
    maxItems?: number;
    minItems?: number;
  };
}

export interface IBooleanDecoratorArgs {
  type: "boolean";
  options: {
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
  };
}

export interface INumberDecoratorArgs {
  type: "number";
  options: {
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
    maximum?: number;
    minimum?: number;
  };
}

export interface IObjectDecoratorArgs {
  type: "object";
  options: {
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
  };
}

export interface IStringDecoratorArgs {
  type: "string";
  options: {
    enumValues?: string[];
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
  };
}

export interface IEnumDecoratorArgs {
  type: "string";
  options: {
    enumValues: string[];
    deprecated?: boolean;
    nullable?: boolean;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
  };
}

export type DtoPropertyArgs =
  | IArrayDecoratorArgs
  | IBooleanDecoratorArgs
  | IEnumDecoratorArgs
  | INumberDecoratorArgs
  | IObjectDecoratorArgs
  | IStringDecoratorArgs;
