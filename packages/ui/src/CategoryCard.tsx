import React from 'react';
import { TransformedCategory } from '@/lib/data/adapter';
import Link from 'next/link';

type CategoryCardProps = {
  category: TransformedCategory;
  locale: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, locale }) => {
  return (
    <Link href={`/${locale}/categories/${category.slug}`} className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
      <p className="text-sm text-gray-600">{category.description}</p>
    </Link>
  );
};

export default CategoryCard;