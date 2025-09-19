import React from 'react';
import { HeroSection } from '../../../components/contact/HeroSection';
import { ContactForm } from '../../../components/contact/ContactForm';
import { ContactMethods } from '../../../components/contact/ContactMethods';
import { AddressSection } from '../../../components/contact/AddressSection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <HeroSection />
        <ContactForm />
        <ContactMethods />
        <AddressSection />
      </div>
      <Footer />
    </>
  );
}
