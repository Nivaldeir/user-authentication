import { UserAuthProviders } from "../../domain/entities/user-auth-providers";

export interface IUserAuthProviderRepository {
  create(data: UserAuthProviders, tenantId: string): Promise<UserAuthProviders>;
  findUserById(id: string): Promise<UserAuthProviders>;
}
