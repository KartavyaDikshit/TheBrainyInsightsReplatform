import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogBySlug, BlogWithCategory } from "@/lib/blogs"; // Import the utility function and custom type
import { JsonLd } from '@/components';
import { Article, WithContext } from 'schema-dts';
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
    title: blog.seoTitle ?? blog.title ?? '',
    description: blog.seoDescription ?? blog.description ?? '',
    keywords: blog.seoKeywords || '',
    openGraph: {
      title: blog.seoTitle ?? blog.title ?? '',
      description: blog.seoDescription ?? blog.description ?? '',
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
      title: blog.seoTitle ?? blog.title ?? '',
      description: blog.seoDescription ?? blog.description ?? '',
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

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title ?? '',
    description: blog.description ?? '',
    author: {
      '@type': 'Organization',
      name: 'The Brainy Insights',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Brainy Insights',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.thebrainyinsights.com/og-image.jpg', // Using the placeholder OG image for now
      },
    },
    datePublished: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.thebrainyinsights.com/${locale}/blog/${slug}`,
    },
  };

  const categoryTranslation = blog.category?.translations[0];

  return (
    <div className="blog-detail-page">
      <JsonLd data={jsonLd} />
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      {categoryTranslation && (
        <p className="text-gray-600 mb-2">Category: {categoryTranslation.name}</p>
      )}
      {blog.publishedAt && (
        <p className="text-gray-600 mb-2">Published: {blog.publishedAt.toDateString()}</p>
      )}
      {blog.description && (
        <div className="blog-description mb-4">
          <p>{blog.description}</p>
        </div>
      )}
      {/* Add more blog details as needed */}
    </div>
  );
}