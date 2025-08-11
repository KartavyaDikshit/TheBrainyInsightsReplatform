export function buildReportUrl(locale: string, slug: string): string {
  return `/${locale}/reports/${slug}`;
}

export function buildCategoryUrl(locale: string, slug: string): string {
  return `/${locale}/categories/${slug}`;
}
