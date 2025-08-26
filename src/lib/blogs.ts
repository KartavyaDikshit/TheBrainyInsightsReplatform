import { db, Category } from "@tbi/database";

interface Blog {
  id: string;
  category_id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  status: string;
  featured: boolean;
  view_count: number;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

interface CategoryTranslation {
  locale: string;
  title: string;
}

export type BlogWithCategory = Blog & {
  category?: Category & {
    translations: CategoryTranslation[];
  };
  translations: BlogTranslation[];
};

interface BlogTranslation {
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: string;
}


export async function getBlogBySlug(slug: string, locale: string): Promise<BlogWithCategory | null> {
  const result = await db.query(
    `SELECT
      b.id, b.title, b.slug, b.excerpt, b.content, b.tags, b.meta_title, b.meta_description, b.status, b.featured, b.view_count, b.published_at, b.created_at, b.updated_at,
      c.id as category_id, c.shortcode, c.title as category_title, c.description as category_description, c.icon as category_icon, c.featured as category_featured, c.status as category_status, c.view_count as category_view_count, c.created_at as category_created_at, c.updated_at as category_updated_at, c.meta_title as category_meta_title, c.meta_description as category_meta_description, c.slug as category_slug, c.sort_order as category_sort_order,
      bt.title as translated_title, bt.excerpt as translated_excerpt, bt.content as translated_content, bt.tags as translated_tags, bt.meta_title as translated_meta_title, bt.meta_description as translated_meta_description,
      ct.title as translated_category_title
    FROM blogs b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN blog_translations bt ON b.id = bt.blog_id AND bt.locale = $2
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $2
    WHERE b.slug = $1
    LIMIT 1`,
    [slug, locale]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  // Manually construct the BlogWithCategory object
  const blog: BlogWithCategory = {
    id: row.id,
    title: row.translated_title || row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    tags: row.tags,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    status: row.status,
    featured: row.featured,
    view_count: row.view_count,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category: row.category_id ? {
      id: row.category_id,
      shortcode: row.shortcode,
      slug: row.category_slug,
      title: row.translated_category_title || row.category_title,
      description: row.category_description,
      icon: row.category_icon,
      featured: row.category_featured,
      sort_order: row.category_sort_order,
      status: row.category_status,
      view_count: row.category_view_count,
      created_at: row.category_created_at,
      updated_at: row.category_updated_at,
      meta_title: row.category_meta_title,
      meta_description: row.category_meta_description,
      translations: row.translated_category_title ? [{ title: row.translated_category_title, locale: locale }] : [],
    } : undefined,
    translations: row.translated_title ? [{
      locale: locale,
      title: row.translated_title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      tags: row.tags,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      status: row.status, // Assuming status is also translated
    }] : [],
  };

  return blog;
}

export async function getAllBlogs(locale: string): Promise<BlogWithCategory[]> {
  const result = await db.query(
    `SELECT
      b.id, b.title, b.slug, b.excerpt, b.content, b.tags, b.meta_title, b.meta_description, b.status, b.featured, b.view_count, b.published_at, b.created_at, b.updated_at,
      c.id as category_id, c.shortcode, c.title as category_title, c.description as category_description, c.icon as category_icon, c.featured as category_featured, c.status as category_status, c.view_count as category_view_count, c.created_at as category_created_at, c.updated_at as category_updated_at, c.meta_title as category_meta_title, c.meta_description as category_meta_description, c.slug as category_slug, c.sort_order as category_sort_order,
      bt.title as translated_title, bt.excerpt as translated_excerpt, bt.content as translated_content, bt.tags as translated_tags, bt.meta_title as translated_meta_title, bt.meta_description as translated_meta_description,
      ct.title as translated_category_title
    FROM blogs b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN blog_translations bt ON b.id = bt.blog_id AND bt.locale = $1
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $1
    ORDER BY b.published_at DESC`,
    [locale]
  );

  const blogs: BlogWithCategory[] = result.rows.map((row: any) => {
    // Manually construct the BlogWithCategory object
    const blog: BlogWithCategory = {
      id: row.id,
      title: row.translated_title || row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      tags: row.tags,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      status: row.status,
      featured: row.featured,
      view_count: row.view_count,
      published_at: row.published_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id ? {
        id: row.category_id,
        shortcode: row.shortcode,
        slug: row.category_slug,
        title: row.translated_category_title || row.category_title,
        description: row.category_description,
        icon: row.category_icon,
        featured: row.category_featured,
        sort_order: row.category_sort_order,
        status: row.category_status,
        view_count: row.category_view_count,
        created_at: row.category_created_at,
        updated_at: row.category_updated_at,
        meta_title: row.category_meta_title,
        meta_description: row.category_meta_description,
        translations: row.translated_category_title ? [{ title: row.translated_category_title, locale: locale }] : [],
      } : undefined,
      translations: row.translated_title ? [{
        locale: locale,
        title: row.translated_title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        tags: row.tags,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        status: row.status, // Assuming status is also translated
      }] : [],
    };
    return blog;
  });

  return blogs;
}