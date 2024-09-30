import passport from "passport";
import flash from "connect-flash";
import { Express } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Logger from "../../logger";
import { IHttpServerSetting } from "../../../types/http";

export class PassportExtension implements IHttpServerSetting {
  setConfig(app: Express) {
    app.use(passport.session());
    app.use(passport.initialize());
    app.use(flash());
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash("success_msg");
      res.locals.error_msg = req.flash("error_msg");
      next();
    });
    if (!process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_SECRET_ID) {
      Logger.instance.error("Variables for google ids not supported");
      return;
    }
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET_ID!,
          callbackURL: `${process.env.API_URL_AUTH!}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            done(null, {
              accessToken,
              refreshToken,
              profile,
            });
          } catch (err) {
            done(err, false);
          }
        }
      )
    );
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });
  }
}
