import { randomUUID } from "crypto";

type TenantProps = {
  id: string;
  name: string;
  createdAt?: Date;
  updated?: Date;
  redirectUriSuccess: string;
  redirectUriError: string;
};

export class Tenant {
  id: string;
  name: string;
  createdAt?: Date;
  updated?: Date;
  redirectUriSuccess: string
  redirectUriError: string
  constructor(props: TenantProps) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updated = props.updated;
    this.redirectUriSuccess = props.redirectUriSuccess
    this.redirectUriError = props.redirectUriError
  }

  static create(props: Omit<TenantProps, "id">): Tenant {
    return new Tenant({
      id: randomUUID(),
      name: props.name,
      createdAt: new Date(),
      updated: new Date(),
      redirectUriSuccess: props.redirectUriSuccess,
      redirectUriError: props.redirectUriError,
    });
  }
}
