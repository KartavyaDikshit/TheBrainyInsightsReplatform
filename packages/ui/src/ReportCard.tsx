import React from 'react';
import Link from 'next/link';

interface Report {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
}

interface ReportCardProps {
  report: Report;
  locale: string;
}

export default function ReportCard({ report, locale }: ReportCardProps) {
  return (
    <Link href={`/${locale}/reports/${report.slug}`} className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
      <p className="text-sm text-gray-600">{report.summary || ''}</p>
    </Link>
  );
}