import { UserAuthProviders } from "../../domain/entities/user-auth-providers";

export interface IUserAuthProviderRepository {
  create(data: UserAuthProviders): Promise<UserAuthProviders>;
  findUserById(id: string): Promise<UserAuthProviders>;
}
