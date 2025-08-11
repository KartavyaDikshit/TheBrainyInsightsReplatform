import React from 'react';
import { TransformedReport } from '@/lib/data/adapter';
import Link from 'next/link';

type ReportCardProps = {
  report: TransformedReport;
  locale: string;
};

const ReportCard: React.FC<ReportCardProps> = ({ report, locale }) => {
  return (
    <Link href={`/${locale}/reports/${report.slug}`} className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
      <p className="text-sm text-gray-600">{report.summary}</p>
      {/* Add more details like category, updated date if available in Report type */}
    </Link>
  );
};

export default ReportCard;