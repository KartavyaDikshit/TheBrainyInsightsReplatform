import { PrismaAdapter } from "@auth/prisma-adapter";
export const CustomPrismaAdapter = (p) => {
    return Object.assign(Object.assign({}, PrismaAdapter(p)), { async createUser(data) {
            const { email, emailVerified } = data;
            const user = await p.user.create({
                data: {
                    email,
                    emailVerified,
                },
            });
            return user;
        } });
};
