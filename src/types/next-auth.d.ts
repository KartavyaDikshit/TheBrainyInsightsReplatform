import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Add role to Session.user
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string; // Add role to User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Add role to JWT
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string;
  }
}