import { PgAdapter } from "../../../infra/database/pg-adapter";
import { AuthProviderDatabase } from "../../../infra/database/repository/auth-provider";
import { TenantDatabase } from "../../../infra/database/repository/tenant";
import { UserDatabase } from "../../../infra/database/repository/user";
import { UserAuthProviderDatabase } from "../../../infra/database/repository/user-auth-provider";
import { IAuthProviderRepository } from "../repository/auth-provider-repository";
import { IUserAuthProviderRepository } from "../repository/user-auth-provider-repository";
import { IUserRepository } from "../repository/user-repository";

export class RepositoryFactory {
  private readonly db = new PgAdapter(`${process.env.DATABASE_URL}`);

  userRepository(): IUserRepository {
    return new UserDatabase(this.db);
  }

  authProviderRepository(): IAuthProviderRepository {
    return new AuthProviderDatabase(this.db);
  }

  authUserProviderRepository(): IUserAuthProviderRepository {
    return new UserAuthProviderDatabase(this.db);
  }
  tenantRepository() {
    return new TenantDatabase(this.db)
  }
}
