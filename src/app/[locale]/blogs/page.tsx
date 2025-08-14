import Link from "next/link";
import { Metadata } from "next";
import { getAllBlogs, BlogWithCategory } from "@/lib/blogs"; // Import the utility function and custom type
import { locales } from "../../../config/i18n"; // Import locales from shared config

export const metadata: Metadata = {
  title: "All Blogs - TheBrainyInsights",
  description: "Browse all blog posts from TheBrainyInsights.",
  alternates: {
    canonical: "https://www.thebrainyinsights.com/blogs", // Canonical URL for the current page
    languages: {
      "en-US": "https://www.thebrainyinsights.com/en/blogs",
      "ja-JP": "https://www.thebrainyinsights.com/ja/blogs",
      "de-DE": "https://www.thebrainyinsights.com/de/blogs",
      "es-ES": "https://www.thebrainyinsights.com/es/blogs",
      "fr-FR": "https://www.thebrainyinsights.com/fr/blogs",
      "it-IT": "https://www.thebrainyinsights.com/it/blogs",
      "ko-KR": "https://www.thebrainyinsights.com/ko/blogs",
      "x-default": "https://www.thebrainyinsights.com/en/blogs", // Fallback for unspecified locales
    },
  },
};

interface BlogsPageProps {
  params: any; // Use any to bypass type checking for params
  searchParams: any; // Add searchParams to match Next.js PageProps structure, even if not used
}

export default async function BlogsPage({ params }: BlogsPageProps) {
  const { locale } = params;

  const blogs: BlogWithCategory[] = await getAllBlogs(locale as string); // Use the utility function and cast locale

  return (
    <div className="blogs-list-page">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => {
          const categoryTranslation = blog.category?.translations[0];

          return (
            <div key={blog.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/${locale}/blog/${blog.slug}`} className="text-indigo-600 hover:underline">
                  {blog.title}
                </Link>
              </h2>
              {categoryTranslation && (
                <p className="text-gray-600 text-sm mb-1">Category: {categoryTranslation.name}</p>
              )}
              {blog.publishedAt && (
                <p className="text-gray-600 text-sm mb-2">Published: {blog.publishedAt.toDateString()}</p>
              )}
              {blog.description && (
                <p className="text-gray-700 text-sm line-clamp-3">{blog.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}