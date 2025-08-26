import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@tbi/database";
// @ts-ignore
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password))
                    return null;
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });
                if (!user || !await bcrypt.compare(credentials.password, user.password)) {
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.firstName, // Changed to firstName
                    // Removed role as User model does not have it
                };
            }
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            // Removed token.role assignment as User model does not have a role.
            // If Admin roles need to be handled, a more robust solution is required.
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub;
                // Removed session.user.role assignment as User model does not have a role.
                // If Admin roles need to be handled, a more robust solution is required.
            }
            return session;
        },
    },
});
