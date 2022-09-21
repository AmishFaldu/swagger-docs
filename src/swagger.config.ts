import {
  DeepReadonly,
  ISwaggerConfig,
  ISwaggerContact,
  ISwaggerExternalDocs,
  ISwaggerLicense,
  ISwaggerSecurityScheme,
} from "./interfaces";

/**
 * Generate swagger config
 */
export class SwaggerConfig {
  private swaggerJSONConfig: ISwaggerConfig;

  constructor() {
    this.swaggerJSONConfig = {
      openapi: "3.0.0",
      info: {
        title: "Swagger Api Doc",
        version: "1.0.0",
      },
      paths: {},
      components: {},
      security: [],
      tags: [],
    };
  }

  /**
   * Set title for swagger document
   * @param title - Title for swagger document
   *
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public setTitle(title: string): this {
    this.swaggerJSONConfig.info.title = title;
    return this;
  }

  /**
   * Set description for swagger document
   * @param description - Description for swagger document
   *
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public setDescription(description: string): this {
    this.swaggerJSONConfig.info.description = description;
    return this;
  }

  /**
   * Add terms of service (TOS) URL to swagger document
   * @param tosUrl - Terms of service url
   *
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public termsOfService(tosUrl: string): this {
    this.swaggerJSONConfig.info.termsOfService = tosUrl;
    return this;
  }

  /**
   * Set swagger document version
   * @param version - Version number for swagger document
   *
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoObject
   */
  public setVersion(version: string): this {
    this.swaggerJSONConfig.info.version = version;
    return this;
  }

  /**
   * Add contact info to swagger document
   * @param {ISwaggerContact} data - Swagger contact details
   *
   * Reference -
   * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#contactObject
   */
  public addContactInfo(data: Readonly<ISwaggerContact>): this {
    this.swaggerJSONConfig.info.contact = data;
    return this;
  }

  /**
   * Add license information to swagger document
   * @param {ISwaggerLicense} data - Swagger license information
   *
   * Reference -
   * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#licenseObject
   */
  public addLicenseInfo(data: Readonly<ISwaggerLicense>): this {
    this.swaggerJSONConfig.info.license = data;
    return this;
  }

  /* eslint-disable max-len */
  /**
   * Add security schema to swagger document
   * @param {string} securitySchemeName - Name for security schema
   * @param {ISwaggerSecurityScheme} data - Security schema details
   *
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#componentsSecuritySchemes
   */
  /* eslint-enable max-len */
  public addSecurity(
    securitySchemeName: string,
    data: DeepReadonly<ISwaggerSecurityScheme>,
  ): this {
    const securitySchema = { [securitySchemeName]: data };
    if (!this.swaggerJSONConfig.components.securitySchemes) {
      this.swaggerJSONConfig.components = {
        securitySchemes: securitySchema,
      };
      return this;
    }

    Object.assign(
      this.swaggerJSONConfig.components.securitySchemes,
      securitySchema,
    );

    return this;
  }

  /* eslint-disable max-len */
  /**
   * Add security requirements to swagger open apis
   * @param {string} securitySchemaName - Name of security schema
   * @param {string[]} requirements -Security requirements.
   * Useful only for oauth security schema type for other security schemas should be empty array
   *
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#securityRequirementObject
   */
  /* eslint-enable max-len */
  public addSecurityRequirement(
    securitySchemaName: string,
    requirements: Readonly<string[]>,
  ): this {
    const securityObject = { [securitySchemaName]: requirements };
    if (this.swaggerJSONConfig.security === undefined) {
      this.swaggerJSONConfig.security = [securityObject];
      return this;
    }

    this.swaggerJSONConfig.security.push(securityObject);
    return this;
  }

  /* eslint-disable max-len */
  /**
   * Add external documentation links to swagger
   * @param {ISwaggerExternalDocs} data - External documents details
   *
   * Reference - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#externalDocumentationObject
   */
  /* eslint-enable max-len */
  public addExternalDocumentation(data: Readonly<ISwaggerExternalDocs>): this {
    this.swaggerJSONConfig.externalDocs = data;
    return this;
  }

  /**
   * Finalize and return swagger document config
   * @returns ISwaggerConfig
   */
  public finalizeConfig(): Omit<ISwaggerConfig, "paths"> {
    Object.freeze(this.swaggerJSONConfig);
    return this.swaggerJSONConfig;
  }
}
