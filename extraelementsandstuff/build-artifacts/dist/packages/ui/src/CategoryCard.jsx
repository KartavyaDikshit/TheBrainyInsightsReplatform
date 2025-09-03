import React from 'react';
import Link from 'next/link';
const CategoryCard = ({ category, locale }) => {
    return (<Link href={`/${locale}/categories/${category.slug}`} className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
      <p className="text-sm text-gray-600">{category.description}</p>
    </Link>);
};
export default CategoryCard;
