import NextAuth from "next-auth";
import { AdapterUser as CoreAdapterUser } from "@auth/core/adapters"; // Import AdapterUser from @auth/core

declare module "next-auth" {
  interface User {
    role: string; // Add the role property to the User type
  }

  interface Session {
    user: {
      role: string; // Add the role property to the Session user type
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string; // Add the role property to the JWT type
  }
}

// Augment the AdapterUser type from @auth/core/adapters
declare module "@auth/core/adapters" {
  interface AdapterUser extends CoreAdapterUser {
    role: string; // Add the role property to AdapterUser
  }
}