'use client';
import React, { useState } from 'react';
import { Container, Section, TextInput, TextArea, Button, FormRow, ValidationMessage } from '@/components';
import { JsonLd } from '@/components';
import { Organization, WithContext } from 'schema-dts';
import { useLocale } from 'next-intl';
import { createLead } from '@/lib/data/adapter';
import { Locale, EnquiryStatus } from '@prisma/client';



export default function ContactPage() {
  const locale = useLocale();
  const organizationJsonLd: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Brainy Insights',
    url: 'https://www.thebrainyinsights.com',
    logo: 'https://www.thebrainyinsights.com/og-image.jpg', // Using the placeholder OG image for now
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX', // Placeholder, replace with actual phone number
      contactType: 'customer service',
      areaServed: 'WW', // Worldwide
      availableLanguage: 'en', // English
    },
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Use the adapter directly for client-side lead creation
      const res = await createLead({
        name: formData.name,
        email: formData.email,
        company: formData.company || null, // Optional
        message: formData.message,
        status: EnquiryStatus.Unseen, // Default status
        locale: locale.toUpperCase() as Locale,
        reportId: null, // No report associated with contact form
        phone: null, // Not collected in this form
        jobTitle: null, // Not collected in this form
        
      });

      if (res.id) {
        setSuccess(true);
        setFormData({ name: '', email: '', company: '', message: '', });
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Section>
      <JsonLd data={organizationJsonLd} />
      <Container>
        <h1>Contact Us</h1>
        {success && <p className="text-green-500">Your message has been sent successfully!</p>}
        <form onSubmit={handleSubmit}>
          <FormRow>
            <label htmlFor="name">Name</label>
            <TextInput id="name" type="text" value={formData.name} onChange={handleChange} />
            {errors.name && <ValidationMessage>{errors.name}</ValidationMessage>}
          </FormRow>
          <FormRow>
            <label htmlFor="email">Email</label>
            <TextInput id="email" type="email" value={formData.email} onChange={handleChange} />
            {errors.email && <ValidationMessage>{errors.email}</ValidationMessage>}
          
          </FormRow>
          <FormRow>
            <label htmlFor="company">Company (Optional)</label>
            <TextInput id="company" type="text" value={formData.company} onChange={handleChange} />
          </FormRow>
          <FormRow>
            <label htmlFor="message">Message</label>
            <TextArea id="message" value={formData.message} onChange={handleChange} />
            {errors.message && <ValidationMessage>{errors.message}</ValidationMessage>}
          </FormRow>
          <Button type="submit">Submit</Button>
        </form>
      </Container>
    </Section>
  );
}
