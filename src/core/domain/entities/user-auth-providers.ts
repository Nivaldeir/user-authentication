import { randomUUID } from "crypto";
import { Password } from "./password";

type UserAuthPRovidersProps = {
  id: string;
  userId: string;
  providerId: string;
  password?: Password;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export class UserAuthProviders {
  id: string;
  userId: string;
  providerId: string;
  password?: Password;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  constructor(props: UserAuthPRovidersProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.providerId = props.providerId;
    this.password = props.password;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<UserAuthPRovidersProps, "id">) {
    return new UserAuthProviders({
      id: randomUUID(),
      ...props,
    });
  }
}
