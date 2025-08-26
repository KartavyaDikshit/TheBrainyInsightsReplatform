import Link from "next/link";
import { getAllBlogs } from "@/lib/blogs"; // Import the utility function and custom type
export const metadata = {
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
export default async function BlogsPage(props) {
    const params = await props.params;
    const { locale } = params;
    const blogs = await getAllBlogs(locale); // Use the utility function and cast locale
    return (<div className="blogs-list-page">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => {
            var _a;
            const categoryTranslation = (_a = blog.category) === null || _a === void 0 ? void 0 : _a.translations[0];
            return (<div key={blog.id} className="border p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/${locale}/blog/${blog.slug}`} className="text-indigo-600 hover:underline">
                  {blog.title}
                </Link>
              </h2>
              {categoryTranslation && (<p className="text-gray-600 text-sm mb-1">Category: {categoryTranslation.title}</p>)}
              {blog.publishedAt && (<p className="text-gray-600 text-sm mb-2">Published: {blog.publishedAt.toDateString()}</p>)}
              {blog.excerpt && (<p className="text-gray-700 text-sm line-clamp-3">{blog.excerpt}</p>)}
            </div>);
        })}
      </div>
    </div>);
}
