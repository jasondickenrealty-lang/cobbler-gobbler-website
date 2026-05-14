import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/employee/', '/api/', '/menu-board/', '/marketing-display/'],
      },
    ],
    sitemap: 'https://cobblestonecreamery.com/sitemap.xml',
    host: 'https://cobblestonecreamery.com',
  };
}
