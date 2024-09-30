import { ITenantRepository } from "../../../app/repository/tenant-repository";
import { Tenant } from "../../entities/tenant";

export class FindTenant {
  constructor(private readonly repository: ITenantRepository) {}
  async execute(input: Input): Promise<Tenant> {
    const output = await this.repository.find(input.id);
    return output;
  }
}
type Input = {
  id: string;
};
