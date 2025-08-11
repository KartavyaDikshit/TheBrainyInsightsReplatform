import React from 'react';

const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="py-12">
      {children}
    </section>
  );
};

export default Section;
