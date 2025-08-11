'use client';
import React, { useState } from 'react';
import { Container, Section, TextInput, TextArea, Button, FormRow, ValidationMessage } from '@/components';
import { useLocale } from 'next-intl';
import { createLead } from '@/lib/data/adapter';
import { Locale } from '@prisma/client';



export default function ContactPage() {
  const locale = useLocale();
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
      const res = await createLead({ ...formData, locale: locale.toUpperCase() as keyof typeof Locale });

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
