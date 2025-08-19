/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_content_generations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `countries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enquiries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `press_releases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `url_redirects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ai_content_generations" DROP CONSTRAINT "ai_content_generations_content_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ai_content_generations" DROP CONSTRAINT "ai_content_generations_generated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."blog_translations" DROP CONSTRAINT "blog_translations_blog_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."blogs" DROP CONSTRAINT "blogs_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."category_translations" DROP CONSTRAINT "category_translations_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."category_translations" DROP CONSTRAINT "category_translations_reviewed_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."category_translations" DROP CONSTRAINT "category_translations_translated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."custom_requests" DROP CONSTRAINT "custom_requests_report_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."custom_requests" DROP CONSTRAINT "custom_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."enquiries" DROP CONSTRAINT "enquiries_report_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."enquiries" DROP CONSTRAINT "enquiries_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."faqs" DROP CONSTRAINT "faqs_report_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."media" DROP CONSTRAINT "media_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_report_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."press_releases" DROP CONSTRAINT "press_releases_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."report_reviews" DROP CONSTRAINT "report_reviews_report_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."report_reviews" DROP CONSTRAINT "report_reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."report_translations" DROP CONSTRAINT "report_translations_report_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reports" DROP CONSTRAINT "reports_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reports" DROP CONSTRAINT "reports_category_id_fkey";

-- DropTable
DROP TABLE "public"."admins";

-- DropTable
DROP TABLE "public"."ai_content_generations";

-- DropTable
DROP TABLE "public"."blog_translations";

-- DropTable
DROP TABLE "public"."blogs";

-- DropTable
DROP TABLE "public"."categories";

-- DropTable
DROP TABLE "public"."category_translations";

-- DropTable
DROP TABLE "public"."countries";

-- DropTable
DROP TABLE "public"."custom_requests";

-- DropTable
DROP TABLE "public"."enquiries";

-- DropTable
DROP TABLE "public"."faqs";

-- DropTable
DROP TABLE "public"."media";

-- DropTable
DROP TABLE "public"."order_items";

-- DropTable
DROP TABLE "public"."orders";

-- DropTable
DROP TABLE "public"."press_releases";

-- DropTable
DROP TABLE "public"."report_reviews";

-- DropTable
DROP TABLE "public"."report_translations";

-- DropTable
DROP TABLE "public"."reports";

-- DropTable
DROP TABLE "public"."url_redirects";

-- DropTable
DROP TABLE "public"."users";
