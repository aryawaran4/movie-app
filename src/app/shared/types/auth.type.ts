export interface UserType {
  uuid: string;
  username: string | null | undefined;
  email: string | null | undefined;
  password: string | null | undefined;
  createdAt: string;
}
