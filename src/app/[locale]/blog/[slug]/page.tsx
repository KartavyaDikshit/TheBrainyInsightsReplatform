import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogBySlug, BlogWithCategory } from "@/lib/blogs"; // Import the utility function and custom type
// import { JsonLd } from '@tbi/ui'; // Commented out
// import { Article, WithContext } from 'schema-dts'; // Commented out
import { locales } from "../../../../config/i18n"; // Import locales from shared config

interface BlogPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const blog = await getBlogBySlug(slug as string, locale as string); // Cast to string

  if (!blog) {
    return {};
  }

  const categoryTranslation = blog.category?.translations[0];

  const alternatesLanguages: { [key: string]: string } = {};
  locales.forEach((loc) => {
    alternatesLanguages[loc] = `https://www.thebrainyinsights.com/${loc}/blog/${slug}`;
  });

  return {
    title: blog.translations[0]?.metaTitle ?? blog.title ?? '',
    description: blog.translations[0]?.metaDescription ?? blog.excerpt ?? '',
    keywords: blog.translations[0]?.tags?.join(', ') || '',
    openGraph: {
      title: blog.translations[0]?.metaTitle ?? blog.title ?? '',
      description: blog.translations[0]?.metaDescription ?? blog.excerpt ?? '',
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
      title: blog.translations[0]?.metaTitle ?? blog.title ?? '',
      description: blog.translations[0]?.metaDescription ?? blog.excerpt ?? '',
      images: ["https://www.thebrainyinsights.com/twitter-image.jpg"], // Placeholder
    },
    alternates: {
      canonical: `https://www.thebrainyinsights.com/${locale}/blog/${slug}`,
      languages: alternatesLanguages,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug, locale } = await params;

  const blog: BlogWithCategory | null = await getBlogBySlug(slug as string, locale as string); // Explicitly type blog and cast

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

  const categoryTranslation = blog.category?.translations[0];

  return (
    <div className="blog-detail-page">
      {/* <JsonLd data={jsonLd} /> */} {/* Commented out */}
      <h1 className="text-3xl font-bold mb-4">{blog.translations[0]?.title || blog.title}</h1>
      {categoryTranslation && (
        <p className="text-gray-600 mb-2">Category: {categoryTranslation.title}</p>
      )}
      {blog.published_at && (
        <p className="text-gray-600 mb-2">Published: {blog.published_at.toDateString()}</p>
      )}
      {blog.translations[0]?.excerpt && (
        <div className="blog-description mb-4">
          <p>{blog.translations[0]?.excerpt}</p>
        </div>
      )}
      {/* Add more blog details as needed */}
    </div>
  );
}