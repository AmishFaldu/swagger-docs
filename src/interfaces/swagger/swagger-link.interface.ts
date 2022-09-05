import { ISwaggerServer } from "./swagger-server.interface";

export interface ISwaggerLink {
  operationRef?: string;
  operationId?: string;
  parameters?: {
    [key: string]: unknown;
  };
  requestBody?: unknown;
  description?: string;
  server?: ISwaggerServer;
}
