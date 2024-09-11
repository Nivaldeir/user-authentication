import { NextFunction, Request, Response } from "express";
import HttpController from "./http-controller";
import passport from "passport";
import { ReturnResponse } from "../../../types/http";
import { Token } from "../../../core/domain/usecase/token";

export default class AuthController extends HttpController {
  handle() {
    this.httpServer.on({
      method: "post",
      url: "/auth",
      callback: this.local.bind(this),
    });
    this.httpServer.on({
      method: "post",
      url: "/auth/logout",
      callback: this.logout.bind(this),
    });
    this.httpServer.on({
      method: "get",
      url: "/auth/google",
      callback: passport.authenticate("google", {
        scope: ["profile", "email"],
      }),
    });
    this.httpServer.on({
      method: "get",
      url: "/auth/google/callback",
      callback: this.authGoogleCallback.bind(this),
    });
  }

  async local(req: Request, res: Response<ReturnResponse>) {
    try {
      const { token } = await this.factory.create().authUserLocal.execute({
        email: req.body.email,
        password: req.body.password,
      });
      if (token) {
        res.cookie("session-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        return res.redirect(process.env.CLIENT_URL_SUCCESS!);
      }
      return res.redirect(process.env.CLIENT_URL_ERROR!);
    } catch (error: any) {
      return res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  }
  async logout(req: Request, res: Response<ReturnResponse>){
    res.cookie("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.redirect("/");
  }
  async authGoogleCallback(
    req: Request,
    res: Response<ReturnResponse>,
    next: NextFunction
  ) {
    passport.authenticate("google", async (err: any, user: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect(process.env.CLIENT_URL_ERROR!);
      }
      try {
        const { token } = await this.factory.create().findOrCreate.execute({
          email: user.profile.emails[0].value,
          name: user.profile.displayName,
          username: user.profile.username,
          refreshToken: user.profile.refreshToken,
          accessToken: user.profile.accessToken,
        });

        res.cookie("session-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        return res.redirect(process.env.CLIENT_URL_SUCCESS!);
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  }
}
