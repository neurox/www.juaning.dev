import en from '@/i18n/en.json';
import es from '@/i18n/es.json';

const translations = { en, es } as const;
type Locale = keyof typeof translations;

export function t(locale: Locale, key: string): string {
  const dict = translations[locale] ?? translations.en;
  return dict[key as keyof typeof dict] ?? key;
}

export function getLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(es|en)/);
  return (match?.[1] as Locale) ?? 'en';
}

export const locales = ['en', 'es'] as const;
