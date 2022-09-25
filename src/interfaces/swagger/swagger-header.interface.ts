import { ISwaggerParameter } from "./swagger-parameter.interface";

export type ISwaggerHeader = Omit<ISwaggerParameter, "in" | "name">
