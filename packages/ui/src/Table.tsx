import React from 'react';

const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <table>
      {children}
    </table>
  );
};

export default Table;
