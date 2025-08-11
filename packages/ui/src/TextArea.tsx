import React from 'react';

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea {...props} />
  );
};

export default TextArea;
