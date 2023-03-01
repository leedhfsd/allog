import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    name: string;
    email: string;
    password: string;
    image: string;
    nickname?: string;
    userinfo?: string;
    emailVerified?: boolean | null;
  }
  interface Session extends DefaultSession {
    user?: User;
  }
}
