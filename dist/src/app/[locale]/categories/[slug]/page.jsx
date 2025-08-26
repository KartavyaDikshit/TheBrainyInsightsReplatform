import { getCategoryBySlug, listReports } from '@/lib/data/adapter';
import { Container, ReportCard, Section } from '@tbi/ui'; // Removed JsonLd
// import { CollectionPage, WithContext } from 'schema-dts'; // Commented out
import { notFound } from 'next/navigation';
export async function generateMetadata({ params }) {
    const { locale, slug } = await params; // Destructure directly from params
    const category = await getCategoryBySlug(slug, locale); // Cast to string
    if (!category) {
        return {}; // Return empty metadata if category not found
    }
    return {
        title: category.metaTitle || category.title,
        description: category.metaDescription || category.description,
        // Add other meta tags as needed
    };
}
export default async function CategoryPage({ params }) {
    const { locale, slug } = await params; // Destructure directly from params
    const category = await getCategoryBySlug(slug, locale); // Cast to string
    if (!category) {
        notFound();
    }
    const reports = await listReports({ locale: locale, categorySlug: slug }); // Cast to string
    // const categoryJsonLd: WithContext<CollectionPage> = { // Commented out
    //   '@context': 'https://schema.org', // Commented out
    //   '@type': 'CollectionPage', // Commented out
    //   name: category.title, // Commented out
    //   description: category.description, // Commented out
    //   url: `https://www.thebrainyinsights.com/${locale}/categories/${slug}`, // Commented out
    //   mainEntity: reports.map(report => ({ // Commented out
    //     '@type': 'Article', // Assuming reports are articles // Commented out
    //     headline: report.title, // Commented out
    //     url: `https://www.thebrainyinsights.com/${locale}/reports/${report.slug}`, // Commented out
    //   })), // Commented out
    // }; // Commented out
    return (<Section>
      {/* <JsonLd data={categoryJsonLd} /> */} {/* Commented out */}
      <Container>
        <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{category.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (<ReportCard key={report.id} report={report} locale={locale}/>))}
        </div>
      </Container>
    </Section>);
}
