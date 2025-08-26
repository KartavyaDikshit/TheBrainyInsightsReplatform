import React from 'react';
export default async function ServicesPage({ params }) {
    const { locale } = await params;
    return (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Our Services</h1>
      <p className="text-lg">Explore the comprehensive services offered by TheBrainyInsights Replatform.</p>
      <ul className="list-disc list-inside mt-4">
        <li>Market Research Reports</li>
        <li>AI-Powered Industry Analysis</li>
        <li>Multilingual Content Generation</li>
        <li>Custom Research Solutions</li>
      </ul>
    </div>);
}
