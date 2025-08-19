import React from 'react';

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-lg">This is the About Us page for TheBrainyInsights Replatform.</p>
      <p className="text-md mt-2">We are a leading provider of market research reports, offering high SEO, dynamic multilingual support, and AI-powered content generation.</p>
    </div>
  );
}