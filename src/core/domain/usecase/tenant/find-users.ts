import { ITenantRepository } from "../../../app/repository/tenant-repository";
import { IUserRepository } from "../../../app/repository/user-repository";

export class FindUsersTenant {
  constructor(
    private readonly repository: ITenantRepository,
    private readonly userRepository: IUserRepository
  ) {}
  async execute(input: Input): Promise<any> {
    if (!input.tenantId) {
      throw new Error("Tenant id is required");
    }
    const tenant = await this.repository.find(input.tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    const output = await this.repository.findUsers(input.tenantId);
    return output;
  }
}
type Input = {
  tenantId: string;
};
