import { collection, config, fields } from '@keystatic/core';

const bilingual = (label: string) => fields.object({
  vi: fields.text({ label: `${label} (Tiếng Việt)`, validation: { isRequired: true } }),
  en: fields.text({ label: `${label} (English)`, validation: { isRequired: true } }),
}, { label });

const emptyMarkdown = fields.emptyContent({ extension: 'md' });

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'VDac Content Studio' },
    navigation: {
      'Nội dung website': ['services', 'news', 'documents'],
    },
  },
  collections: {
    services: collection({
      label: 'Dịch vụ / Services',
      path: 'src/content/services/*',
      slugField: 'titleVi',
      columns: ['title', 'order'],
      format: { contentField: 'content' },
      schema: {
        titleVi: fields.slug({ name: { label: 'Tên file / Slug' } }),
        title: bilingual('Tên dịch vụ'),
        excerpt: bilingual('Mô tả ngắn'),
        icon: fields.text({ label: 'Biểu tượng', defaultValue: '◈' }),
        order: fields.integer({ label: 'Thứ tự hiển thị', defaultValue: 1 }),
        content: emptyMarkdown,
      },
    }),
    news: collection({
      label: 'Tin tức & Sự kiện / News',
      path: 'src/content/news/*',
      slugField: 'titleVi',
      columns: ['title', 'date'],
      format: { contentField: 'content' },
      schema: {
        titleVi: fields.slug({ name: { label: 'Tên file / Slug' } }),
        title: bilingual('Tiêu đề'),
        excerpt: bilingual('Tóm tắt'),
        date: fields.date({ label: 'Ngày đăng', validation: { isRequired: true } }),
        category: bilingual('Chuyên mục'),
        image: fields.text({ label: 'Đường dẫn hình ảnh', description: 'Không bắt buộc', defaultValue: '' }),
        content: emptyMarkdown,
      },
    }),
    documents: collection({
      label: 'Tài liệu / Documents',
      path: 'src/content/documents/*',
      slugField: 'titleVi',
      columns: ['title', 'date'],
      format: { contentField: 'content' },
      schema: {
        titleVi: fields.slug({ name: { label: 'Tên file / Slug' } }),
        title: bilingual('Tên tài liệu'),
        excerpt: bilingual('Mô tả'),
        file: fields.file({ label: 'Tệp tải xuống', directory: 'public/downloads', publicPath: '/downloads/' }),
        date: fields.date({ label: 'Ngày cập nhật', validation: { isRequired: true } }),
        category: bilingual('Danh mục'),
        content: emptyMarkdown,
      },
    }),
  },
});
