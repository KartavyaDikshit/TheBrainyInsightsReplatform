"use client";

import { Menu, Search, Globe, User } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Header() {
  const navItems = [
    { label: 'Categories', href: '/en/categories' },
    { label: 'Reports', href: '/en/reports' },
    { label: 'Services', href: '/en/services' },
    { label: 'About', href: '/en/about' },
    { label: 'Contact', href: '/en/contact' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/en" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">BI</span>
          </div>
          <span className="font-semibold text-lg">The Brainy Insights</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm hover:text-indigo-600 transition-colors font-medium">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>EN</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Select Language</h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <a
                      key={lang.code}
                      href={`/${lang.code}`}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sign In Button */}
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
            <a href="/en/auth/signin">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </a>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="mt-6">
                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block text-sm font-medium hover:text-indigo-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t">
                  <a
                    href="/en/auth/signin"
                    className="flex items-center space-x-2 text-sm font-medium hover:text-indigo-600 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
