import React from 'react';
import Head from 'next/head';

type SeoHelmetProps = {
  title: string;
  description: string;
};

const SeoHelmet: React.FC<SeoHelmetProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

export default SeoHelmet;
