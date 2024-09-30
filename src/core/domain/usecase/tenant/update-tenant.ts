import { ITenantRepository } from "../../../app/repository/tenant-repository";
import { IUserRepository } from "../../../app/repository/user-repository";

export class UpdateTenant {
  constructor(private readonly repository: ITenantRepository) {}
  async execute(input: Input) {
    const tenant = await this.repository.find(input.id);
    if (!tenant) throw new Error("Tenant not found");
    tenant.name = input.name ?? tenant.name;
    await this.repository.update(tenant);
  }
}
type Input = {
  id: string;
  name?: string;
};
