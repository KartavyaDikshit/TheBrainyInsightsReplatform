import React from 'react';

const FormRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
};

export default FormRow;
