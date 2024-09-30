import { randomUUID } from "crypto";
import { IUserAuthProviderRepository } from "../../../core/app/repository/user-auth-provider-repository";
import { Password } from "../../../core/domain/entities/password";
import { UserAuthProviders } from "../../../core/domain/entities/user-auth-providers";
import DatabaseConnection from "../../../types/database-connection";

export class UserAuthProviderDatabase implements IUserAuthProviderRepository {
  constructor(private readonly db: DatabaseConnection<UserAuthProviders>) {}
  async create(
    data: UserAuthProviders,
    tenantId: string
  ): Promise<UserAuthProviders> {
    try {
      const tenant = await this.db.query(
        `SELECT * FROM public.tenants WHERE id = $1`,
        [tenantId]
      );
      if (tenant.length === 0) {
        throw new Error(`Tenant with ID ${tenantId} not found`);
      }
      const userValues = [
        data.id,
        data.userId,
        data.providerId,
        data.password?.value,
        data.password?.salt,
        data.accessToken,
        data.refreshToken,
      ];
      await this.db.query(
        `INSERT INTO public.user_auth_providers (id, user_id, provider_id, hashed_password, hashed_salt, access_token, refresh_token) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        userValues
      );
      await this.db.query(
        `INSERT INTO public.user_tenants (id, user_id, tenant_id) VALUES ($1, $2, $3)`,
        [randomUUID(), data.userId, tenantId]
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async findUserById(userId: string): Promise<UserAuthProviders> {
    const query = `
      SELECT * 
      FROM user_auth_providers 
      WHERE user_id = $1
    `;

    const [result] = await this.db.query(query, [userId]);
    return new UserAuthProviders({
      id: result.id,
      userId: result.user_id,
      providerId: result.provider_id,
      password: new Password(result.hashed_password, result.hashed_salt),
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
}
