import JsonLd from "@/packages/ui/src/JsonLd";

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  
  return (
        <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TheBrainyInsights Replatform",
          "url": "https://www.thebrainyinsights.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.thebrainyinsights.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TheBrainyInsights",
          "url": "https://www.thebrainyinsights.com",
          "logo": "https://www.thebrainyinsights.com/logo.png", // Assuming a logo exists
          "sameAs": [
            // Add social media links here if available
            // "https://www.facebook.com/thebrainyinsights",
            // "https://twitter.com/thebrainyinsights",
            // "https://www.linkedin.com/company/thebrainyinsights"
          ]
        }}
      />
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>TheBrainyInsights Replatform</h1>
          <p>Welcome to the future of market research. High SEO, dynamic multilingual support, and AI-powered content generation.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`/${locale}/auth/signin`} className="btn-primary">Sign In</a>
            <a href={`/${locale}/about`} className="btn-secondary">Learn more →</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="grid grid-cols-3">
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Market Reports</h3>
              <p style={{ color: '#64748b' }}>Access comprehensive market research reports with AI-powered insights and analysis.</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>AI-Powered Analysis</h3>
              <p style={{ color: '#64748b' }}>Generate detailed industry analysis using advanced AI and machine learning algorithms.</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Global Reach</h3>
              <p style={{ color: '#64748b' }}>Multilingual support for 7+ languages with localized market intelligence.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export const dynamic = 'force-dynamic'