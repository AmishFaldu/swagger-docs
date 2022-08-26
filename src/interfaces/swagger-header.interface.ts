import { ISwaggerParameter } from "./swagger-parameter.interface";

export interface ISwaggerHeader
  extends Omit<ISwaggerParameter, "name" | "in"> {}
