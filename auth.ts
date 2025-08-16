import NextAuth from "next-auth"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter" // Correct named import
import { PrismaAdapter } from "@next-auth/prisma-adapter" // Changed import path
import { redisManager } from "./packages/lib/src/redis-client" // Corrected path
import { PrismaClient } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function initializeAuth() {
  // Connect to Redis before initializing NextAuth
  const isRedisConnected = await redisManager.connect();

  // Conditionally use Redis adapter based on connection status
  const authConfig = {
    adapter: isRedisConnected
      ? UpstashRedisAdapter(redisManager.getIORedisClient())
      : PrismaAdapter(prisma), // Fallback to Prisma adapter if Redis connection fails

    providers: [
      // Your existing providers
      Credentials({
        credentials: {
          email: {},
          password: {},
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: String(credentials.email) },
          })

          if (user && user.passwordHash) {
            const isValid = await bcrypt.compare(
              String(credentials.password),
              user.passwordHash
            )
            if (isValid) {
              return user
            }
          }
          return null
        },
      }),
    ],

    session: {
      strategy: process.env.USE_REDIS_SESSIONS === 'true' ? "database" : "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
    },

    callbacks: {
      async session({ session, user }) {
        // Log session activity to REDISLOG.md
        if (process.env.DEBUG_CACHE_HANDLER === 'true' && process.env.NEXT_RUNTIME === 'nodejs') {
          const logEntry = `\n[${new Date().toISOString()}] SESSION_ACCESS: ${user?.id || 'anonymous'} - ${session?.user?.email || 'no-email'}`;
          require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
        }

        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
          token.role = user.role
        }
        return token
      },
    },

    events: {
      async signIn(message) {
        console.log('[NextAuth] Sign in:', message.user.email);
      },
      async signOut(message) {
        console.log('[NextAuth] Sign out:', message.session?.userId);
      }
    },
    pages: {
      signIn: "/auth/signin",
    },
  };

  return NextAuth(authConfig);
}

const { handlers, signIn, signOut, auth } = await initializeAuth();

export { handlers, signIn, signOut, auth };
