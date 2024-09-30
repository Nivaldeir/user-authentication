import express, { NextFunction, Request, Response } from "express";
import Logger from "../../logger";
import IHttpServer, {
  IHttpServerSetting,
  InputHttp,
} from "../../../types/http";
import { Controller } from "../controllers/controller";
export default class ExpressAdapter implements IHttpServer {
  app: express.Express;
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  start(port: number) {
    return this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  addRoutes(controllers: Controller[]) {
    controllers.forEach((controller) => {
      const path = controller.getPath();
      const method = controller.getMethod();
      const handler = controller.getHandler();
      const middlewares = controller.getMiddlewares
        ? controller.getMiddlewares()
        : [];

      if (typeof this.app[method] === "function") {
        this.app[method](path, middlewares, handler);
        Logger.instance.success(`[ ${method.toUpperCase()} ] ${path}`);
      } else {
        console.error(`Método HTTP inválido: ${method}`);
      }
    });
  }

  settings(setting: IHttpServerSetting[]) {
    setting.forEach((s) => {
      s.setConfig(this.app);
    });
  }
}
