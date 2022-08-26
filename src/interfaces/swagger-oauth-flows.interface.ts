interface ISwaggerOauthFlow {
  authorizationUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  scopes: {
    [name: string]: string;
  };
}

export interface ISwaggerOauthFlows {
  implicit?: ISwaggerOauthFlow;
  password?: ISwaggerOauthFlow;
  clientCredentials?: ISwaggerOauthFlow;
  authorizationCode?: ISwaggerOauthFlow;
}
