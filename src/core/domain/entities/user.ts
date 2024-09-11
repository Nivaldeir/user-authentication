import { randomUUID } from "crypto";
import { Email } from "./email";

type UserProps = {
  id: string;
  username?: string;
  email: Email;
  name?: string;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type UserCreateProps = {
  username?: string;
  email: string;
  name?: string;
};

export class User {
  id: string;
  name?: string;
  username?: string;
  email: Email;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.deletedAt = props.deletedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
  static create(props: Omit<UserCreateProps, "id">): User {
    const id = randomUUID();
    return new User({
      id: id,
      email: new Email(props.email),
      name: props.name,
      username: props.username,
      deletedAt: null,
    });
  }
}
