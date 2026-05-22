// Centralized UI strings for both languages. Add a key here, use it in components
// instead of hardcoding English. Keep keys identical between locales.

export type Lang = 'en' | 'ru';

export const STRINGS = {
  en: {
    // Header
    nav_bali: 'Bali',
    nav_about: 'About',
    nav_subscribe: 'Subscribe',
    // Footer
    footer_subscribe_heading: 'Subscribe to new posts →',
    footer_subscribe_blurb: 'Practical travel guides, slow-travel tips, and hidden spots — delivered when I publish, never spam.',
    footer_email_placeholder: 'Email',
    footer_name_placeholder: 'Name',
    footer_subscribe_button: 'Subscribe',
    footer_privacy_disclaimer_lead: 'By subscribing, you agree to our',
    footer_privacy_link_text: 'Privacy Policy',
    footer_blurb: 'Travel guides for slow travelers and digital nomads.',
    footer_section_site: 'Site',
    footer_section_contact: 'Contact',
    footer_link_about: 'About',
    footer_link_bali: 'Bali Guide',
    footer_link_privacy: 'Privacy',
    footer_link_disclosure: 'Affiliate Disclosure',
    footer_copyright: '© 2026 Rumroom World. Written by Kseniia.',
    // Post card / meta
    minutes_short: 'min',
    // Language switcher
    lang_switch_to_ru: 'Читать на русском',
    lang_switch_to_en: 'Read in English',
    // Site
    site_title: 'Rumroom World',
    site_description: 'Practical travel guides for slow travelers and digital nomad women — by Kseniia.',
    home_path: '/',
    about_path: '/about/',
    bali_pillar_path: '/pillars/bali/',
    privacy_path: '/privacy/',
    disclosure_path: '/affiliate-disclosure/',
    // Date locale
    date_locale: 'en-US',
    html_lang: 'en',
  },
  ru: {
    nav_bali: 'Бали',
    nav_about: 'Обо мне',
    nav_subscribe: 'Подписаться',
    footer_subscribe_heading: 'Подпишись на новые статьи →',
    footer_subscribe_blurb: 'Полезные гайды по slow travel, проверенные места и честные советы — присылаю, когда выходит новый текст. Без спама.',
    footer_email_placeholder: 'Email',
    footer_name_placeholder: 'Имя',
    footer_subscribe_button: 'Подписаться',
    footer_privacy_disclaimer_lead: 'Подписываясь, соглашаешься с',
    footer_privacy_link_text: 'политикой конфиденциальности',
    footer_blurb: 'Гайды о путешествиях для тех, кто живёт медленно и работает удалённо.',
    footer_section_site: 'Сайт',
    footer_section_contact: 'Контакты',
    footer_link_about: 'Обо мне',
    footer_link_bali: 'Гайд по Бали',
    footer_link_privacy: 'Конфиденциальность',
    footer_link_disclosure: 'Раскрытие об аффилиатах',
    footer_copyright: '© 2026 Rumroom World. Пишет Ксения.',
    minutes_short: 'мин',
    lang_switch_to_ru: 'Читать на русском',
    lang_switch_to_en: 'Read in English',
    site_title: 'Rumroom World',
    site_description: 'Честные гайды о путешествиях для тех, кто живёт медленно и работает удалённо. Пишет Ксения.',
    home_path: '/ru/',
    about_path: '/ru/about/',
    bali_pillar_path: '/ru/pillars/bali/',
    privacy_path: '/privacy/',
    disclosure_path: '/affiliate-disclosure/',
    date_locale: 'ru-RU',
    html_lang: 'ru',
  },
} as const;

export function t(lang: Lang) {
  return STRINGS[lang];
}

// URL helpers — single source of truth for path patterns per locale.
export function homePath(lang: Lang): string {
  return lang === 'ru' ? '/ru/' : '/';
}

export function aboutPath(lang: Lang): string {
  return lang === 'ru' ? '/ru/about/' : '/about/';
}

export function pillarPath(lang: Lang, slug: string): string {
  return lang === 'ru' ? `/ru/pillars/${slug}/` : `/pillars/${slug}/`;
}

// posts URL pattern: /<country>/<slug>/  (EN) and /ru/<country>/<slug>/  (RU)
export function postPath(lang: Lang, country: string, slug: string): string {
  return lang === 'ru' ? `/ru/${country}/${slug}/` : `/${country}/${slug}/`;
}
