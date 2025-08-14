import { Locale } from '../../../src/types/prisma-enums'; // Corrected import path

export function toLocaleEnum(input: string): Locale {
  const key = input?.toUpperCase();
  if (key && (Locale as any)[key]) return (Locale as any)[key];
  return Locale.EN;
}