import { IUserRepository } from "../../../app/repository/user-repository";

export class UpdateUser {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(input: Input) {
    const user = await this.userRepository.findById(input.id, input.tenantId);
    if (!user) throw new Error("User not found");
    await this.userRepository.update(user);
  }
}
type Input = {
  id: string;
  tenantId: string;
  username?: string;
  password?: string;
};
