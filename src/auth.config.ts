import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

// Edge-safe NextAuth config.
//
// The Credentials provider is declared here so the providers array is stable
// across runtimes (edge proxy / Node server), but the real authorize logic
// (bcryptjs + Prisma) lives in `src/auth.ts`. Keep this file free of any
// Node-only imports so it can be safely included from middleware/proxy.
export default {
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async () => null,
    }),
  ],
} satisfies NextAuthConfig;
