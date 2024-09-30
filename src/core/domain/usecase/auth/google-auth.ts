import { IAuthProviderRepository } from "../../../app/repository/auth-provider-repository";
import { ITenantRepository } from "../../../app/repository/tenant-repository";
import { IUserAuthProviderRepository } from "../../../app/repository/user-auth-provider-repository";
import { IUserRepository } from "../../../app/repository/user-repository";
import { Tenant } from "../../entities/tenant";
import { User } from "../../entities/user";
import { UserAuthProviders } from "../../entities/user-auth-providers";
import { Token } from "../token";

export class GoogleAuth {
  constructor(
    readonly userRepository: IUserRepository,
    readonly providerRepository: IAuthProviderRepository,
    readonly userAuthProvider: IUserAuthProviderRepository,
    readonly tenantRepository: ITenantRepository
  ) {}
  async execute(input: Input): Promise<{ token: string; tenant: Tenant }> {
    let newUser = await this.userRepository.findByEmailOrUsername(
      input.email,
      input.tenantId
    );
    if (!newUser) {
      newUser = User.create({
        email: input.email!,
        name: input.name
      });
      await this.userRepository.create(newUser);
      const provider = await this.providerRepository.findByName("google");
      const userAuthPRoviders = UserAuthProviders.create({
        providerId: provider.id,
        userId: newUser.id,
        refreshToken: input.refreshToken,
        accessToken: input.accessToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.userAuthProvider.create(userAuthPRoviders, input.tenantId);
    }
    const tenant = await this.tenantRepository.find(input.tenantId);
    const token = Token.generate({
      id: newUser.id,
      email: newUser.email.value,
      name: newUser.name,
      admin: newUser.admin,
      tenantId: input.tenantId,
    });
    return { token, tenant };
  }
}
interface Input {
  email: string;
  name?: string;
  refreshToken?: string;
  accessToken?: string;
  tenantId: string;
  avatar?: string;
}
