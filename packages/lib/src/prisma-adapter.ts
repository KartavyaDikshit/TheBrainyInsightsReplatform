// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient, User } from "@tbi/database";

// export const CustomPrismaAdapter = (p: PrismaClient) => {
//   return {
//     ...PrismaAdapter(p),
//     async createUser(data: Omit<User, 'id'>) {
//       const { email, emailVerified } = data;
//       const user = await p.user.create({
//         data: {
//           email,
//           emailVerified,
//         },
//       });
//       return user;
//     },
//   };
// };