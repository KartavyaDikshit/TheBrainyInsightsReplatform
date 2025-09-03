import { listSitemapEntries } from '@/lib/data/adapter';
export default async function sitemap() {
    const entries = await listSitemapEntries();
    return entries.map(entry => ({
        url: entry.url,
        lastModified: entry.lastModified,
        alternates: {
            languages: entry.alternates,
        },
    }));
}
