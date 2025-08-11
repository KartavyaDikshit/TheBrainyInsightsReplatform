import React from 'react';

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props} />
  );
};

export default Button;
