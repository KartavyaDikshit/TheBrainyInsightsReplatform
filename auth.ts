import NextAuth, { User, Session, SessionStrategy } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // For password hashing

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' as SessionStrategy }, // Use JWT for session management
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: Record<string, string> | undefined) { // Explicitly type credentials
        if (!credentials) { // Add this check
          return null;
        }
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (user && user.passwordHash) {
          const isValid = await bcrypt.compare(String(credentials.password), user.passwordHash);
          if (isValid) {
            // Return user object without passwordHash
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role, // Include role in the session
            };
          }
        }
        return null; // Invalid credentials
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role; // Add role to JWT
      }
      return token;
    },
    async session({ session, token }: { session: Session; token?: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role; // Add role to session
      }
      return session;
    },
  },
  pages: {
    signIn: '/en/auth/signin', // Custom sign-in page
  },
};



// Conditionally initialize NextAuth
let nextAuthInstance;
if (typeof window === 'undefined' && process.env.NEXT_AUTH_URL) { // Only initialize on server and if NEXT_AUTH_URL is set
  nextAuthInstance = NextAuth(authOptions);
} else {
  // Provide dummy handlers for build time or client side
  nextAuthInstance = {
    handlers: {
      GET: () => { throw new Error("NextAuth not initialized during build."); },
      POST: () => { throw new Error("NextAuth not initialized during build."); }
    },
    auth: () => { throw new Error("NextAuth not initialized during build."); },
    signIn: () => { throw new Error("NextAuth not initialized during build."); },
    signOut: () => { throw new Error("NextAuth not initialized during build."); }
  };
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = nextAuthInstance;