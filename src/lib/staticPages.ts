/**
 * Fixed slugs for the editable footer pages (Tentang, Redaksi, Kontak Kami, Iklan).
 * Content itself lives in Firestore (collection "pages", doc id = slug) and is
 * editable by admin from the page itself - this file only defines which pages
 * exist and their default label/URL.
 */
export const STATIC_PAGE_SLUGS = ['tentang', 'redaksi', 'kontak', 'iklan'] as const;

export type StaticPageSlug = typeof STATIC_PAGE_SLUGS[number];

export const STATIC_PAGE_LABELS: Record<StaticPageSlug, string> = {
  tentang: 'Tentang',
  redaksi: 'Redaksi',
  kontak: 'Kontak Kami',
  iklan: 'Iklan',
};

export const STATIC_PAGE_DEFAULT_CONTENT: Record<StaticPageSlug, string> = {
  tentang: 'Halaman ini belum diisi. Ceritakan tentang HALOJATIMNEWS di sini.',
  redaksi: 'Halaman ini belum diisi. Cantumkan susunan redaksi di sini.',
  kontak: 'Halaman ini belum diisi. Cantumkan email, WhatsApp, atau alamat redaksi di sini.',
  iklan: 'Halaman ini belum diisi. Jelaskan paket & harga pasang iklan di sini.',
};
