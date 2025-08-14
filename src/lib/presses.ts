import { PrismaClient, Locale } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function getPressBySlug(slug: string, locale: string) {
  return prisma.press.findUnique({
    where: {
      slug: slug,
    },
    include: {
      category: {
        include: {
          translations: {
            where: {
              locale: mapLocaleToPrismaLocale(locale),
            },
          },
        },
      },
    },
  });
}

export async function getAllPresses(locale: string) {
  return prisma.press.findMany({
    include: {
      category: {
        include: {
          translations: {
            where: {
              locale: mapLocaleToPrismaLocale(locale),
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
}
