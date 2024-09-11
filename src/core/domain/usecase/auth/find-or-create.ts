import { IAuthProviderRepository } from "../../../app/repository/auth-provider-repository";
import { IUserAuthProviderRepository } from "../../../app/repository/user-auth-provider-repository";
import { IUserRepository } from "../../../app/repository/user-repository";
import { User } from "../../entities/user";
import { UserAuthProviders } from "../../entities/user-auth-providers";
import { Token } from "../token";

export class FindOrCreate {
  constructor(
    readonly userRepository: IUserRepository,
    readonly providerRepository: IAuthProviderRepository,
    readonly userAuthProvider: IUserAuthProviderRepository
  ) {}
  async execute(input: Input): Promise<{ token: string }> {
    let newUser = await this.userRepository.findByEmailOrUsername(input.email);
    if (!newUser) {
      newUser = User.create({
        email: input.email!,
        name: input.name,
        username: input.username,
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
      await this.userAuthProvider.create(userAuthPRoviders);
    }
    const token = Token.generate({ id: newUser.id });
    return { token };
  }
}
interface Input {
  email: string;
  name?: string;
  username?: string;
  refreshToken?: string;
  accessToken?: string;
}
