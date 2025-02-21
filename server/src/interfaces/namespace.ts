export namespace USER {
  export interface IUser {
    user_id: string;
    name?: string | null;
    avatar: string;
    location?: string | null;
    email?: string | null;
    bio?: string | null;
    user_name: string;
  }
}
