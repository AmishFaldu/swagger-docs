import { ISwaggerServer } from "./swagger-server.interface";

export interface ISwaggerLink {
  operationRef?: string;
  operationId?: string;
  parameters?: {
    [key: string]: any;
  };
  requestBody?: any;
  description?: string;
  server?: ISwaggerServer;
}
