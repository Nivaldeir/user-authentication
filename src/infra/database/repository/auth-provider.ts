import { IAuthProviderRepository } from "../../../core/app/repository/auth-provider-repository";
import { AuthProvider } from "../../../core/domain/entities/auth-provider";
import DatabaseConnection from "../../../types/database-connection";

export class AuthProviderDatabase implements IAuthProviderRepository {
  constructor(private readonly db: DatabaseConnection<AuthProvider>) {}
  async findByName(name: string): Promise<AuthProvider> {
    const [provider] = await this.db.query(
      "SELECT * FROM auth_providers WHERE provider_name = $1",
      [name]
    );
    return new AuthProvider({
      id: provider.id,
      providerName: provider.name,
    });
  }
}
