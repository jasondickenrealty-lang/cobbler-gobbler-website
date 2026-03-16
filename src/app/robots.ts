import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/employee/', '/api/'],
      },
    ],
    sitemap: 'https://cobblestonecreamery.com/sitemap.xml',
  };
}
