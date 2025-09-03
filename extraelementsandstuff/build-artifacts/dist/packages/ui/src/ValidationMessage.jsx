import React from 'react';
const ValidationMessage = ({ children }) => {
    return (<p className="text-red-500 text-sm mt-1">
      {children}
    </p>);
};
export default ValidationMessage;
