import { Container, Section } from '@/components';
import { JsonLd } from '@/components';
import { WebPage, WithContext } from 'schema-dts';



export default function ServicesPage() {
  const servicesJsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Our Services - TheBrainyInsights',
    description: 'Explore the market research services offered by TheBrainyInsights.',
    url: 'https://www.thebrainyinsights.com/services', // This should be dynamic based on locale
  };

  return (
    <Section>
      <JsonLd data={servicesJsonLd} />
      <Container>
        <h1>Our Services</h1>
        {/* Services content */}
      </Container>
    </Section>
  );
}
