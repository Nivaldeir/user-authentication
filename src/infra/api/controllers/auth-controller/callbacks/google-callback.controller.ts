import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Controller, HttpMethod, ResponseType } from "../../controller";
import { GoogleAuth } from "../../../../../core/domain/usecase/auth/google-auth";

export class AuthGoogleCallbackController implements Controller {
  constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly service: GoogleAuth
  ) {}
  getHandler(): (
    request: Request<any>,
    response: Response<ResponseType>,
    next: NextFunction
  ) => Promise<void> {
    return async (request, response, next): Promise<void> => {
      passport.authenticate(
        "google",
        { session: false },
        async (err: any, user: any) => {
          const tenantId = request.cookies["tenantId"];
          try {
            const { token, tenant } = await this.service.execute({
              email: user.profile.emails[0].value,
              name: user.profile.displayName,
              avatar: user.profile?.photos[0].value,
              refreshToken: user.profile.refreshToken,
              accessToken: user.profile.accessToken,
              tenantId,
            });
            if (!tenantId) {
              throw new Error("O tenantId não foi encontrado na sessão.");
            }

            if (err) {
              return next(err);
            }
            if (!user) {
              return response.redirect(tenant.redirectUriError);
            }
            response.cookie("session.token", token, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              path: "/",
              maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            response.cookie("session.tenant", tenant.id, {
              httpOnly: false,
              // domain: ,
              encode: encodeURIComponent,
              secure: process.env.NODE_ENV === "production",
              path: "/",
              maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            return response.redirect(tenant.redirectUriSuccess);
          } catch (error) {
            return next(error);
          }
        }
      )(request, response, next);
    };
  }
  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }
}
