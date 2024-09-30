import { randomUUID } from "crypto";
import { Email } from "./email";

type UserProps = {
  id: string;
  email: Email;
  name?: string;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  admin?: boolean;
  active?: boolean;
};

type UserCreateProps = {
  email: string;
  name?: string;
};

export class User {
  id: string;
  name?: string;
  email: Email;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  admin?: boolean;
  active?: boolean;
  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.deletedAt = props.deletedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.admin = props.admin;
    this.active = props.active;
  }
  static create(props: Omit<UserCreateProps, "id">): User {
    const id = randomUUID();
    return new User({
      id: id,
      email: new Email(props.email),
      name: props.name,
      deletedAt: null,
    });
  }
}
