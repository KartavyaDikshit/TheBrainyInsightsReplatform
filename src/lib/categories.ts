import { PrismaClient, Category, CategoryTranslation, Locale } from "@prisma/client";

const prisma = new PrismaClient();

export type CategoryWithTranslations = Category & { translations: CategoryTranslation[] };

function mapLocaleToPrismaLocale(locale: string): Locale {
  switch (locale.toLowerCase()) {
    case 'en': return Locale.EN;
    case 'de': return Locale.DE;
    case 'fr': return Locale.FR;
    case 'es': return Locale.ES;
    case 'it': return Locale.IT;
    case 'ja': return Locale.JA;
    case 'ko': return Locale.KO;
    default: throw new Error(`Unsupported locale: ${locale}`);
  }
}

export async function getCategoryBySlug(slug: string, locale: string): Promise<CategoryWithTranslations | null> {
  const category = await prisma.category.findUnique({
    where: {
      slug: slug,
    },
    include: {
      translations: {
        where: {
          locale: mapLocaleToPrismaLocale(locale),
        },
      },
    },
  });
  return category as CategoryWithTranslations | null;
}

export async function getAllCategories(locale: string): Promise<CategoryWithTranslations[]> {
  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: {
          locale: mapLocaleToPrismaLocale(locale),
        },
      },
    },
  });
  return categories as CategoryWithTranslations[];
}
