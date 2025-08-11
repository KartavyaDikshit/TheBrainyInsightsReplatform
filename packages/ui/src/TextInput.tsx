import React from 'react';

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input {...props} />
  );
};

export default TextInput;
