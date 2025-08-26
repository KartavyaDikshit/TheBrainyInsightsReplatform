export default function robots() {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/private/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
