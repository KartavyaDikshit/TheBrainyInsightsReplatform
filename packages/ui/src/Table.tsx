import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export default function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
}
