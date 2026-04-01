import * as cheerio from 'cheerio';

import { SiteConfig } from '@/lib/sites';

export interface ScrapedItem {
  sourceName: string;
  sourceUrl: string;
  title: string;
  description: string;
  originalUrl: string;
  imageUrl: string | null;
  originalLang: string;
  scrapedDate: string;
}

export const scrapeSite = async (site: SiteConfig): Promise<ScrapedItem[]> => {
  const response = await fetch(site.url, {
    next: { revalidate: 1800 },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${site.name}: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const items: ScrapedItem[] = [];

  $(site.selectors.articleList).each((_i, el) => {
    const $el = $(el);

    const titleEl = site.selectors.title
      ? $el.find(site.selectors.title).first()
      : $el;
    const title = titleEl.text().trim();

    const linkEl = site.selectors.link
      ? $el.find(site.selectors.link).first()
      : $el;
    const rawLink = linkEl.attr('href') ?? '';

    const description = site.selectors.excerpt
      ? $el.find(site.selectors.excerpt).first().text().trim()
      : '';

    const scrapedDate = site.selectors.date
      ? $el.find(site.selectors.date).first().text().trim()
      : '';

    const imgEl = site.selectors.image
      ? $el.find(site.selectors.image).first()
      : null;
    const rawImage = imgEl
      ? (imgEl.attr('data-lazy-src') ?? imgEl.attr('src') ?? null)
      : null;

    if (title && title.length >= 10 && rawLink) {
      const originalUrl = rawLink.startsWith('http')
        ? rawLink
        : new URL(rawLink, site.url).href;

      const imageUrl = rawImage && !rawImage.startsWith('http')
        ? new URL(rawImage, site.url).href
        : rawImage;

      items.push({
        sourceName: site.name,
        sourceUrl: site.url,
        title,
        description,
        originalUrl,
        imageUrl,
        originalLang: site.lang ?? 'mn',
        scrapedDate,
      });
    }
  });

  return items;
};

export const scrapeAllSites = async (
  sitesConfig: SiteConfig[],
): Promise<ScrapedItem[]> => {
  const results = await Promise.allSettled(
    sitesConfig.map((site) => scrapeSite(site)),
  );

  const allItems: ScrapedItem[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const item of result.value) {
        if (!seen.has(item.originalUrl)) {
          seen.add(item.originalUrl);
          allItems.push(item);
        }
      }
    }
  }

  return allItems;
};
