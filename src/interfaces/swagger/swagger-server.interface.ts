interface ISwaggerServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}

export interface ISwaggerServer {
  url: string;
  description?: string;
  variables?: {
    [key: string]: ISwaggerServerVariable;
  };
}
