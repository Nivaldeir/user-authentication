import { IAuthProviderRepository } from "../../../app/repository/auth-provider-repository";
import { IUserAuthProviderRepository } from "../../../app/repository/user-auth-provider-repository";
import { IUserRepository } from "../../../app/repository/user-repository";
import { Password } from "../../entities/password";
import { User } from "../../entities/user";
import { UserAuthProviders } from "../../entities/user-auth-providers";
export class CreateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authUserProvider: IUserAuthProviderRepository,
    private readonly authProvider: IAuthProviderRepository
  ) {}
  async execute(input: Input): Promise<Ouput> {
    const user = User.create({ ...input });
    const provider = await this.authProvider.findByName("local");
    const authUserProvider = UserAuthProviders.create({
      providerId: provider.id,
      userId: user.id,
      password: Password.create(input.password),
    });
    const output = await this.userRepository.create(user);
    await this.authUserProvider.create(authUserProvider);
    return {
      deleteAt: output.deletedAt,
      email: output.email.value,
      id: output.id,
      username: output.username,
    };
  }
}

type Input = {
  email: string;
  password: string;
  username?: string;
};
type Ouput = {
  deleteAt?: Date | null;
  email: string;
  id: string;
  username?: string;
};
