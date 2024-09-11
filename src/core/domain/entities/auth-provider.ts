import { randomUUID } from "crypto";

type AuthProviderProps = {
  id: string;
  providerName: string;
};

export class AuthProvider {
  id: string;
  providerName: string;
  constructor(props: AuthProviderProps) {
    this.id = props.id;
    this.providerName = props.providerName;
  }
  static create(props: Omit<AuthProviderProps, "id">): AuthProvider {
    return new AuthProvider({
      id: randomUUID(),
      providerName: props.providerName,
    });
  }
}
