export const langs = { vi: 'Tiếng Việt', en: 'English' };
export const ui = {
  vi: { home: 'Trang chủ', about: 'Giới thiệu', services: 'Dịch vụ', documents: 'Tài liệu', support: 'Hỗ trợ khách hàng', news: 'Tin tức & Sự kiện', employee: 'Nhân sự', contact: 'Liên hệ', language: 'EN', menu: 'Menu', consultation: 'Tư vấn miễn phí', readMore: 'Xem chi tiết', latestNews: 'Tin tức mới nhất', allServices: 'Khám phá dịch vụ', address: 'Địa chỉ', phone: 'Điện thoại', email: 'Email', follow: 'Kết nối với VDac' },
  en: { home: 'Home', about: 'About', services: 'Services', documents: 'Documents', support: 'Customer Support', news: 'News & Events', employee: 'Our Team', contact: 'Contact', language: 'VI', menu: 'Menu', consultation: 'Free consultation', readMore: 'Learn more', latestNews: 'Latest news', allServices: 'Explore services', address: 'Address', phone: 'Phone', email: 'Email', follow: 'Connect with VDac' }
};
export type Lang = keyof typeof ui;
export function getLang(url: URL): Lang { return url.pathname.startsWith('/en') ? 'en' : 'vi'; }
export function useTranslations(lang: Lang) { return ui[lang]; }
export function localize(path: string, lang: Lang) { return lang === 'en' ? `/en${path === '/' ? '' : path}` : path; }
