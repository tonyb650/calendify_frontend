import NextAuth, { DefaultSession } from "next-auth"

export type AppUser = {
  id: string;
  earliest?: number;
  latest?: number;
} & DefaultSession["user"];

declare module "next-auth" {
  interface Session {
    user: AppUser;
  }
}

/* TODO Determine if this next declaration is necessary */
// declare module "next-auth/jwt" {
//   interface JWT {
//     earliest?: number;
//     latest?: number;
//   }
// }

/*

import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  
  interface Session {
    user: {
      /** The user's role. 
      role: "ADMIN" | "USER"
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       *
    } & DefaultSession["user"]
  }
}

*/