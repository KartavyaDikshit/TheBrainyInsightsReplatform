import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/blogs"; // Import the utility function and custom type
// import { JsonLd } from '@tbi/ui'; // Commented out
// import { Article, WithContext } from 'schema-dts'; // Commented out
import { locales } from "../../../../config/i18n"; // Import locales from shared config
export async function generateMetadata({ params }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const { slug, locale } = await params;
    const blog = await getBlogBySlug(slug, locale); // Cast to string
    if (!blog) {
        return {};
    }
    const categoryTranslation = (_a = blog.category) === null || _a === void 0 ? void 0 : _a.translations[0];
    const alternatesLanguages = {};
    locales.forEach((loc) => {
        alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/blog/${slug}`;
    });
    return {
        title: (_d = (_c = (_b = blog.translations[0]) === null || _b === void 0 ? void 0 : _b.metaTitle) !== null && _c !== void 0 ? _c : blog.title) !== null && _d !== void 0 ? _d : '',
        description: (_g = (_f = (_e = blog.translations[0]) === null || _e === void 0 ? void 0 : _e.metaDescription) !== null && _f !== void 0 ? _f : blog.excerpt) !== null && _g !== void 0 ? _g : '',
        keywords: ((_j = (_h = blog.translations[0]) === null || _h === void 0 ? void 0 : _h.tags) === null || _j === void 0 ? void 0 : _j.join(', ')) || '',
        openGraph: {
            title: (_m = (_l = (_k = blog.translations[0]) === null || _k === void 0 ? void 0 : _k.metaTitle) !== null && _l !== void 0 ? _l : blog.title) !== null && _m !== void 0 ? _m : '',
            description: (_q = (_p = (_o = blog.translations[0]) === null || _o === void 0 ? void 0 : _o.metaDescription) !== null && _p !== void 0 ? _p : blog.excerpt) !== null && _q !== void 0 ? _q : '',
            url: `https://www.thebrainyinsights.com/${locale}/blog/${slug}`,
            siteName: "TheBrainyInsights",
            images: [
                {
                    url: "https://www.thebrainyinsights.com/og-image.jpg", // Placeholder, replace with actual OG image
                    width: 1200,
                    height: 630,
                    alt: blog.title || "Blog Post",
                },
            ],
            locale: locale,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: (_t = (_s = (_r = blog.translations[0]) === null || _r === void 0 ? void 0 : _r.metaTitle) !== null && _s !== void 0 ? _s : blog.title) !== null && _t !== void 0 ? _t : '',
            description: (_w = (_v = (_u = blog.translations[0]) === null || _u === void 0 ? void 0 : _u.metaDescription) !== null && _v !== void 0 ? _v : blog.excerpt) !== null && _w !== void 0 ? _w : '',
            images: ["https://www.thebrainyinsights.com/twitter-image.jpg"], // Placeholder
        },
        alternates: {
            canonical: `https://www.thebrainyinsights.com/${locale}/blog/${slug}`,
            languages: alternatesLanguages,
        },
    };
}
export default async function BlogPage({ params }) {
    var _a, _b, _c, _d;
    const { slug, locale } = await params;
    const blog = await getBlogBySlug(slug, locale); // Explicitly type blog and cast
    if (!blog) {
        notFound();
    }
    // const jsonLd: WithContext<Article> = { // Commented out
    //   '@context': 'https://schema.org', // Commented out
    //   '@type': 'Article', // Commented out
    //   headline: blog.translations[0]?.title ?? '', // Commented out
    //   description: blog.translations[0]?.excerpt ?? '', // Commented out
    //   author: { // Commented out
    //     '@type': 'Organization', // Commented out
    //     name: 'The Brainy Insights', // Commented out
    //   }, // Commented out
    //   publisher: { // Commented out
    //     '@type': 'Organization', // Commented out
    //     name: 'The Brainy Insights', // Commented out
    //     logo: { // Commented out
    //       '@type': 'ImageObject', // Commented out
    //       url: 'https://www.thebrainyinsights.com/og-image.jpg', // Using the placeholder OG image for now // Commented out
    //     }, // Commented out
    //   }, // Commented out
    //   datePublished: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString(), // Commented out
    //   mainEntityOfPage: { // Commented out
    //     '@type': 'WebPage', // Commented out
    //     '@id': `https://www.thebrainyinsights.com/${locale}/blog/${slug}`, // Commented out
    //   }, // Commented out
    // }; // Commented out
    const categoryTranslation = (_a = blog.category) === null || _a === void 0 ? void 0 : _a.translations[0];
    return (<div className="blog-detail-page">
      {/* <JsonLd data={jsonLd} /> */} {/* Commented out */}
      <h1 className="text-3xl font-bold mb-4">{((_b = blog.translations[0]) === null || _b === void 0 ? void 0 : _b.title) || blog.title}</h1>
      {categoryTranslation && (<p className="text-gray-600 mb-2">Category: {categoryTranslation.title}</p>)}
      {blog.publishedAt && (<p className="text-gray-600 mb-2">Published: {blog.publishedAt.toDateString()}</p>)}
      {((_c = blog.translations[0]) === null || _c === void 0 ? void 0 : _c.excerpt) && (<div className="blog-description mb-4">
          <p>{(_d = blog.translations[0]) === null || _d === void 0 ? void 0 : _d.excerpt}</p>
        </div>)}
      {/* Add more blog details as needed */}
    </div>);
}
