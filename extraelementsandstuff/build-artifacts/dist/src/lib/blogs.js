import { PrismaClient } from "@tbi/database";
// import { toLocaleEnum } from "../../packages/lib/src/utils"; // Commented out
const prisma = new PrismaClient();
export async function getBlogBySlug(slug, locale) {
    const blog = await prisma.blog.findUnique({
        where: {
            slug: slug,
        },
        include: {
            category: {
                include: {
                    translations: {
                        where: {
                            locale: locale, // Use locale directly
                        },
                    },
                },
            },
            translations: {
                where: {
                    locale: locale, // Use locale directly
                },
            },
        },
    });
    return blog; // Explicitly cast
}
export async function getAllBlogs(locale) {
    const blogs = await prisma.blog.findMany({
        include: {
            category: {
                include: {
                    translations: {
                        where: {
                            locale: locale, // Use locale directly
                        },
                    },
                },
            },
            translations: {
                where: {
                    locale: locale, // Use locale directly
                },
            },
        },
        orderBy: {
            publishedAt: "desc",
        },
    });
    return blogs; // Explicitly cast
}
