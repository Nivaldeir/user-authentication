import express, { NextFunction, Request, Response } from "express";
import Logger from "../../logger";
import IHttpServer, { IHttpServerSetting, InputHttp } from "../../../types/http";
import HttpController from "../controllers/http-controller";
export default class ExpressAdapter implements IHttpServer {
  app: express.Express;
  constructor() {
    this.app = express();
    this.app.use(express.json());
  }
  on(params: InputHttp) {
    const { callback, method, url } = params;
    this.app[method](
      url,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await callback(req, res, next);
        } catch (err: any) {
          Logger.instance.error(`[ERROR]: ${err.message}`);
          res.status(500).send({
            error: true,
            message: err.message,
          });
        }
      }
    );
  }

  listen(port: number): void {
    this.app.listen(port);
    this.listRoutes();
    Logger.instance.success(`Server is running on port ${port}`);
    Logger.instance.success(
      `Swagger available at http://localhost:${port}/swagger`
    );
  }
  listRoutes() {
    const routes: { method: string; path: string }[] = [];
    this.app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        routes.push({
          method: Object.keys(middleware.route.methods)
            .join(", ")
            .toUpperCase(),
          path: middleware.route.path,
        });
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            routes.push({
              method: Object.keys(handler.route.methods)
                .join(", ")
                .toUpperCase(),
              path: handler.route.path,
            });
          }
        });
      }
    });

    const maxMethodLength = Math.max(
      ...routes.map((route) => route.method.length)
    );
    const maxPathLength = Math.max(...routes.map((route) => route.path.length));

    routes.forEach((route) => {
      const methodPadded = route.method.padEnd(maxMethodLength, " ");
      const pathPadded = route.path.padEnd(maxPathLength, " ");
      Logger.instance.success(`[ ${methodPadded} ] ${pathPadded}`);
    });
  }
  addRoutes(route: HttpController[]) {
    route.forEach((r) => {
      r.handle();
    });
  }

  settings(setting: IHttpServerSetting[]) {
    setting.forEach((s) => {
      s.setConfig(this.app);
    });
  }
}
