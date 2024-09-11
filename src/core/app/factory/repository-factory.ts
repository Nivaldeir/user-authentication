import { PgAdapter } from "../../../infra/database/pg-adapter";
import { AuthProviderDatabase } from "../../../infra/database/repository/auth-provider";
import { UserDatabase } from "../../../infra/database/repository/user";
import { UserAuthProviderDatabase } from "../../../infra/database/repository/user-auth-provider";
import { IAuthProviderRepository } from "../repository/auth-provider-repository";
import { IUserAuthProviderRepository } from "../repository/user-auth-provider-repository";
import { IUserRepository } from "../repository/user-repository";

export class RepositoryFactory {
  private readonly db = new PgAdapter(
    `postgresql://${process.env.WSRS_DATABASE_USER}:${process.env.WSRS_DATABASE_PASSWORD}@${process.env.WSRS_DATABASE_HOST}:${process.env.WSRS_DATABASE_PORT}/${process.env.WSRS_DATABASE_NAME}`
  );

  userRepository(): IUserRepository {
    return new UserDatabase(this.db);
  }

  authProviderRepository(): IAuthProviderRepository {
    return new AuthProviderDatabase(this.db);
  }

  authUserProviderRepository(): IUserAuthProviderRepository {
    return new UserAuthProviderDatabase(this.db);
  }
}
