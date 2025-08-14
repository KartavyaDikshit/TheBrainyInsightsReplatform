import NextAuth, { User, Session, SessionStrategy } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'; // Import NextResponse

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' as SessionStrategy },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) {
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
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token?: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/en/auth/signin',
  },
};

// Conditionally initialize NextAuth handlers
let handlers;
if (process.env.NEXTAUTH_SECRET) {
  handlers = NextAuth(authOptions);
} else {
  // Provide dummy handlers during build if secret is not available
  // This prevents the "Cannot read properties of undefined (reading 'GET')" error
  handlers = {
    GET: async () => NextResponse.json({ message: 'Auth not initialized' }, { status: 500 }),
    POST: async () => NextResponse.json({ message: 'Auth not initialized' }, { status: 500 }),
    auth: async () => null,
    signIn: async () => {},
    signOut: async () => {},
  };
}

export const { GET, POST } = handlers;
export const { auth, signIn, signOut } = handlers;
