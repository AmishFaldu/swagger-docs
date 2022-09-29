import type { Express, Request, Response } from "express";
import * as fs from "fs";
import { access } from "fs/promises";
import { absolutePath } from "swagger-ui-dist";
import { AppConfig } from "./app-config";
import {
  favIconsString,
  htmlString,
  jsString,
} from "./constants/swagger.constants";
import {
  ClassType,
  DeepReadonly,
  IBuildSwaggerHtml,
  IBuildSwaggerJS,
  ISwaggerConfig,
  ISwaggerUIConfig,
} from "./interfaces";

/**
 * Generate and add swagger open documentation UI to web framework
 */
export class SwaggerDocs {
  private formattedSwaggerHtml: string;

  private formattedSwaggerJs: string;

  private controllers: Readonly<ClassType[]>;

  private readonly appConfig: AppConfig;

  private readonly swaggerUIDistAbsolutePath: string;

  private readonly swaggerUIConfig: ISwaggerUIConfig;

  constructor(
    private swaggerConfig: DeepReadonly<Omit<ISwaggerConfig, "paths">>,
    swaggerUIConfig: Readonly<ISwaggerUIConfig> = {},
  ) {
    this.appConfig = new AppConfig(swaggerConfig);
    this.swaggerUIConfig = this.addDefaultsToSwaggerUIConfig(swaggerUIConfig);
    this.swaggerUIDistAbsolutePath = absolutePath();
  }

  /**
   * Setup Swagger UI on web framework
   * @param app - Instance of express app
   * @param path - Route path for accessing swagger UI
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public setup(app: Express, path: Readonly<string>): void {
    const baseUrl = this.getFormattedPath(path);
    const formattedFavIconsString = this.buildSwaggerFavIcons(baseUrl);
    this.setupSwaggerExpress(app, path);

    this.appConfig.bootstrapControllersToApp(app, this.controllers);
    this.swaggerConfig = this.appConfig.getSwaggerDocument();

    this.formattedSwaggerHtml = this.buildSwaggerHtml({
      customTitle: this.swaggerUIConfig.customTitle,
      favIconsString: formattedFavIconsString,
      baseUrl,
      customCss: this.swaggerUIConfig.customCss,
      customCssStyle: this.swaggerUIConfig.customCssStyle,
      customJs: this.swaggerUIConfig.customJs,
      customJsString: this.swaggerUIConfig.customJsString,
    });

    this.formattedSwaggerJs = this.buildSwaggerJs({
      displayRequestDuration: this.swaggerUIConfig.displayRequestDuration,
      filter: this.swaggerUIConfig.filter,
      spec: JSON.stringify(this.swaggerConfig),
      tryItOutEnabled: this.swaggerUIConfig.tryItOutEnabled,
    });
  }

  /**
   * Bootstrap controllers to app
   * @param controllers - List of controller class
   * @returns Swagger docs instance
   */
  public bootstrapControllersToApp(controllers: Readonly<ClassType[]>): this {
    this.controllers = controllers;
    return this;
  }

  /**
   * Add default values to swagger UI configuration
   * @param swaggerUIConfig - Swagger UI config object
   */
  private addDefaultsToSwaggerUIConfig(
    swaggerUIConfig: Readonly<ISwaggerUIConfig>,
  ): ISwaggerUIConfig {
    const updatedSwaggerUIConfig = { ...swaggerUIConfig };

    updatedSwaggerUIConfig.customCss = updatedSwaggerUIConfig.customCss ?? "";
    updatedSwaggerUIConfig.customCssStyle =
      updatedSwaggerUIConfig.customCssStyle ?? "";
    updatedSwaggerUIConfig.customJs = updatedSwaggerUIConfig.customJs ?? "";
    updatedSwaggerUIConfig.customJsString =
      updatedSwaggerUIConfig.customJsString ?? "";
    updatedSwaggerUIConfig.customTitle =
      updatedSwaggerUIConfig.customTitle ?? "Swagger UI";
    updatedSwaggerUIConfig.displayRequestDuration =
      updatedSwaggerUIConfig.displayRequestDuration ?? false;
    updatedSwaggerUIConfig.filter = updatedSwaggerUIConfig.filter ?? false;
    updatedSwaggerUIConfig.tryItOutEnabled =
      updatedSwaggerUIConfig.tryItOutEnabled ?? false;
    return updatedSwaggerUIConfig;
  }

  /**
   * Format URL path
   * @param path - URL route path
   * @returns Formatted URL path
   */
  private getFormattedPath(path: string): string {
    let formattedPath = path.startsWith("/")
      ? path
      : `/${path}`;
    formattedPath = formattedPath.endsWith("/")
      ? formattedPath
      : `${formattedPath}/`;
    return formattedPath;
  }

  /**
   * Build and format swagger HTML template code
   * @param {IBuildSwaggerHtml} buildObject - Object to build Swagger HTML
   * @returns Formatted Swagger HTML UI template code string
   */
  private buildSwaggerHtml(buildObject: Readonly<IBuildSwaggerHtml>): string {
    return Object.keys(buildObject).reduce((pvalue, cvalue) => {
      return pvalue.replaceAll(`{{${cvalue}}}`, buildObject[cvalue]);
    }, `${htmlString}`);
  }

  /**
   * Build and format swagger JS template code
   * @param {IBuildSwaggerJS} buildObject - Object to build Swagger JS
   * @returns Formatted Swagger JS template code string
   */
  private buildSwaggerJs({
    displayRequestDuration,
    filter,
    spec,
    tryItOutEnabled,
  }: Readonly<IBuildSwaggerJS>): string {
    let modifiedJsString = `${jsString}`;

    modifiedJsString = modifiedJsString
      .replaceAll("{{spec}}", spec)
      .replaceAll(
        "{{displayRequestDuration}}",
        displayRequestDuration === true
          ? "true"
          : "false",
      )
      .replaceAll("{{filter}}", filter === true
        ? "true"
        : "false")
      .replaceAll(
        "{{tryItOutEnabled}}",
        tryItOutEnabled === true
          ? "true"
          : "false",
      );
    return modifiedJsString;
  }

  /**
   * Build and format swagger fav icons template code
   * @param baseUrl - Base url string to access favicons
   * @returns Formatted Swagger Favicons template code string
   */
  private buildSwaggerFavIcons(baseUrl: string): string {
    let modifiedFavIconsString = `${favIconsString}`;
    modifiedFavIconsString = modifiedFavIconsString.replaceAll(
      "{{baseUrl}}",
      baseUrl,
    );
    return modifiedFavIconsString;
  }

  /**
   * Setup Swagger routes on express app
   * @param app - Instance of express app
   * @param path - Route path for accessing swagger UI
   */
  private setupSwaggerExpress(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    app: Express,
    path: Readonly<string>,
  ): void {
    const formattedPath = this.getFormattedPath(path);

    app.get(
      formattedPath,
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      (_req: Request, res: Response) => {
        return res.send(this.formattedSwaggerHtml);
      },
    );

    app.get(
      `${formattedPath}swagger-initializer.js`,
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      (_req: Request, res: Response) => {
        return res.send(this.formattedSwaggerJs);
      },
    );

    app.use(
      `${formattedPath}:filePath`,
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      async (req: Request, res: Response) => {
        const filepath = `${this.swaggerUIDistAbsolutePath}/${req.params.filePath}`;

        try {
          await access(filepath, fs.constants.R_OK);
        } catch (error) {
          return res.status(404).send({ message: "File not accessible" });
        }

        return fs.createReadStream(filepath).pipe(res);
      },
    );
  }
}
