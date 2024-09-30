import { Express } from "express";
import cors from "cors";
import { IHttpServerSetting } from "../../../types/http";
export class CorsExtension implements IHttpServerSetting {
  setConfig(app: Express) {
    app.set("trust proxy", 1);
    app.use(
      cors({
        origin: process.env.ORIGIN ? [process.env.ORIGIN] : ["*"],
        credentials: true,
        methods: ["GET", "DELETE", "PUT", "POST", "PATCH"],
      })
    );
  }
}
