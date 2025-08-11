import React from 'react';

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select {...props} />
  );
};

export default Select;
