import { Express } from "express";
import cookieParser from "cookie-parser";
import { IHttpServerSetting } from "../../../types/http";

export class CookiesExtension implements IHttpServerSetting {
  setConfig(app: Express) {
    app.use(
      cookieParser()
    );
  }
}
