import { AuthProvider } from "../../domain/entities/auth-provider";

export interface IAuthProviderRepository {
  findByName(name: string): Promise<AuthProvider>;
}
