import { IAuthStrategy } from "../../../../types/auth";
import { IUserRepository } from "../../../app/repository/user-repository";
import { IUserAuthProviderRepository } from "../../../app/repository/user-auth-provider-repository";
import { Token } from "../token";

export class LocalAuth implements IAuthStrategy {
  constructor(
    private userRepository: IUserRepository,
    private userAuthProvider: IUserAuthProviderRepository
  ) {}
  async execute(input: Input): Promise<{ token: string }> {
    try {
      const isUserExist = await this.userRepository.findByEmailOrUsername(
        input.email,
        input.tenantId
      );
      if (isUserExist) {
        const user = await this.userAuthProvider.findUserById(isUserExist.id);
        if (user.password?.validate(input.password)) {
          const token = Token.generate({
            id: isUserExist.id,
            email: isUserExist.email,
            name: isUserExist.name,
          });
          return { token };
        }
      }
      throw new Error("Email ou senha inválidos");
    } catch (err) {
      throw err;
    }
  }
}

interface Input {
  password: string;
  email: string;
  tenantId: string;
}
