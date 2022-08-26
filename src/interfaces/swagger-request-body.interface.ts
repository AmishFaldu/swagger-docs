import { ISwaggerMediaType } from "./swagger-media-type.interface";

export interface ISwaggerRequestBody {
  description?: string;
  content: {
    [key: string]: ISwaggerMediaType;
  };
  required?: boolean;
}
