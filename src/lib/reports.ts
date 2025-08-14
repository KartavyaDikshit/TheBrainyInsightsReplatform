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

export async function getReportBySlug(slug: string, locale: string) {
  return prisma.report.findUnique({
    where: {
      slug: slug,
    },
    include: {
      translations: {
        where: {
          locale: mapLocaleToPrismaLocale(locale),
        },
      },
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

export async function getAllReports(locale: string) {
  return prisma.report.findMany({
    include: {
      translations: {
        where: {
          locale: mapLocaleToPrismaLocale(locale),
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
}