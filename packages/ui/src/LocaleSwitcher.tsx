'use client';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import { locales } from "../../../src/config/i18n"; // Adjust relative path as needed

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <select
      defaultValue={locale}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()} {/* Or a more user-friendly name mapping */}
        </option>
      ))}
    </select>
  );
}
