import React from 'react';
import Link from 'next/link';
const Breadcrumbs = ({ items }) => {
    return (<nav className="text-sm text-gray-500 mb-4">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, index) => (<li key={item.href} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {index === items.length - 1 ? (<span className="text-gray-700">{item.name}</span>) : (<Link href={item.href} className="hover:underline">
                {item.name}
              </Link>)}
          </li>))}
      </ol>
    </nav>);
};
export default Breadcrumbs;
