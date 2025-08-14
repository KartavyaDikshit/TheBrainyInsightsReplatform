import { PrismaClient, Blog, Category, CategoryTranslation, Prisma } from "@prisma/client";
import { toLocaleEnum } from "../../packages/lib/src/utils"; // Import toLocaleEnum

const prisma = new PrismaClient();

export type BlogWithCategory = Prisma.BlogGetPayload<{
  include: {
    category: {
      include: {
        translations: true;
      };
    };
  };
}>;


export async function getBlogBySlug(slug: string, locale: string): Promise<BlogWithCategory | null> {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: slug,
    },
    include: {
      category: {
        include: {
          translations: {
            where: {
              locale: toLocaleEnum(locale), // Use toLocaleEnum
            },
          },
        },
      },
    },
  });
  return blog as BlogWithCategory | null; // Explicitly cast
}

export async function getAllBlogs(locale: string): Promise<BlogWithCategory[]> {
  const blogs = await prisma.blog.findMany({
    include: {
      category: {
        include: {
          translations: {
            where: {
              locale: toLocaleEnum(locale), // Use toLocaleEnum
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
  return blogs as BlogWithCategory[]; // Explicitly cast
}