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

export async function getAllFaqs(locale: string) {
  return prisma.fAQ.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      reportId: true,
      translations: {
        where: {
          locale: mapLocaleToPrismaLocale(locale),
        },
      },
      report: {
        select: {
          translations: {
            where: {
              locale: mapLocaleToPrismaLocale(locale),
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}