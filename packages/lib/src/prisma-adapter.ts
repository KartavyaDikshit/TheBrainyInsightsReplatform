import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";

export const CustomPrismaAdapter = (p: PrismaClient) => {
  return {
    ...PrismaAdapter(p),
    async createUser(data: Omit<User, 'id'>) {
      const user = await p.user.create({
        data: {
          ...data,
          role: 'user', // Assign a default role
        },
      });
      return user;
    },
  };
};