import { Express } from "express";
import session from "express-session";
import { IHttpServerSetting } from "../../../types/http";

export class SessionExtension implements IHttpServerSetting {
  setConfig(app: Express) {
    app.use(
      session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
      })
    );
  }
}
