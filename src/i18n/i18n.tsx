'use client'

import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import tr from './locales/tr.json';
import en from './locales/en.json';

// ─── Types ──────────────────────────────────────────────────────────────────────
// F9 (seo_geo/BULGULAR.md): dil artik localStorage'dan degil ROTADAN gelir.
// ES ve ZH sahte kaldigi icin (URL yok, hreflang yok, bot hicbirini gormuyordu)
// switcher'dan kaldirildi ve calisma zamanindan cikarildi. Dosyalar
// (locales/es.json, locales/zh.json) SILINMEDI -- ileride gercek yapilmak
// istenirse hazir dursun, sadece kullanilmiyor.
export type Language = 'en' | 'tr';

export const LANGUAGES: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: 'tr', label: 'TR', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'en', label: 'EN', flag: '🇬🇧', nativeName: 'English' },
];

type TranslationMap = Record<string, unknown>;

const locales: Record<Language, TranslationMap> = { tr, en };

/**
 * Dili URL'den cozer. /en ve /en/... GERCEK Ingilizce sayfalardir (statik
 * export'ta ayri page.tsx'ler), geri kalan her yol Turkce sayfadir. Eskiden
 * burada localStorage okunuyordu; bu da botlarin ve gercek ziyaretcilerin
 * FARKLI dil gormesine (GEO'nun ana sorunu) yol aciyordu. Artik sunucunun
 * urettigi HTML ile client'in gordugu HTML HER ZAMAN ayni -- hydration
 * uyusmazligi da localStorage baglantisi da yok.
 */
function localeFromPathname(pathname: string | null): Language {
  if (pathname === '/en' || pathname?.startsWith('/en/')) return 'en';
  return 'tr';
}

// ─── Context ────────────────────────────────────────────────────────────────────
interface LanguageContextType {
  language: Language;
}

const LanguageContext = createContext<LanguageContextType>({ language: 'tr' });

// ─── Provider ───────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // usePathname statik export'ta da o sayfanin GERCEK yolunu doner (her rota
  // kendi render gecisinde uretilir), yani sunucu ciktisi da /en altinda
  // dogrudan 'en' olur -- ekstra bir "mounted" hilesine gerek yok.
  const language = localeFromPathname(pathname);

  // Kok layout <html lang="tr"> sabit basiyor (tek root layout, statik
  // export). suppressHydrationWarning zaten orada duruyordu; burada sadece
  // gercek dile gore duzeltiyoruz ki tarayicida acik sayfanin lang'i EN
  // sayfada da dogru olsun. SSR ciktisini etkilemez (bot zaten hreflang
  // etiketlerinden dogru dili okur), yalniz client-side duzeltme.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hooks ──────────────────────────────────────────────────────────────────────
export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Translation hook. Returns a `t` function that resolves dot-notation keys.
 * Example: `t('nav.solutions')` → "Solutions"
 *
 * `setLanguage` GERI UYUMLULUK icin hala donuyor ama artik hicbir sey
 * yapmiyor: dil degistirmenin tek yolu LanguageSwitcher'in gercek link'i
 * ile /en'e ya da /'e GITMEK, client state degistirmek degil.
 */
export function useTranslation() {
  const { language } = useContext(LanguageContext);
  const translations = locales[language] || locales.tr;

  const t = useMemo(() => {
    return (key: string): string => {
      const parts = key.split('.');
      let value: unknown = translations;
      for (const part of parts) {
        if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
          value = (value as Record<string, unknown>)[part];
        } else {
          // Fallback to Turkish
          let fallback: unknown = locales.tr;
          for (const p of parts) {
            if (fallback && typeof fallback === 'object' && p in (fallback as Record<string, unknown>)) {
              fallback = (fallback as Record<string, unknown>)[p];
            } else {
              return key; // key not found anywhere
            }
          }
          return typeof fallback === 'string' ? fallback : key;
        }
      }
      return typeof value === 'string' ? value : key;
    };
  }, [translations]);

  return { t, language, setLanguage: (_lang: Language) => {} };
}
