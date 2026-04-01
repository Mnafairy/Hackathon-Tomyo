import * as cheerio from 'cheerio';

import { SiteConfig } from '@/lib/sites';

export interface NewsItem {
  source: string;
  title: string;
  link: string;
  date: string;
  excerpt: string;
  image: string;
}

export const scrapeSite = async (site: SiteConfig): Promise<NewsItem[]> => {
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
  const items: NewsItem[] = [];

  $(site.selectors.articleList).each((_i, el) => {
    const $el = $(el);

    const titleEl = site.selectors.title
      ? $el.find(site.selectors.title).first()
      : $el;
    const title = titleEl.text().trim();

    const linkEl = site.selectors.link
      ? $el.find(site.selectors.link).first()
      : $el;
    const link = linkEl.attr('href') ?? '';

    const date = site.selectors.date
      ? $el.find(site.selectors.date).first().text().trim()
      : '';

    const excerpt = site.selectors.excerpt
      ? $el.find(site.selectors.excerpt).first().text().trim()
      : '';

    const image = site.selectors.image
      ? $el.find(site.selectors.image).first().attr('src') ?? ''
      : '';

    if (title && title.length >= 10 && link) {
      items.push({
        source: site.name,
        title,
        link: link.startsWith('http') ? link : new URL(link, site.url).href,
        date,
        excerpt,
        image,
      });
    }
  });

  return items;
};

export const scrapeAllSites = async (
  sitesConfig: SiteConfig[],
): Promise<NewsItem[]> => {
  const results = await Promise.allSettled(
    sitesConfig.map((site) => scrapeSite(site)),
  );

  const allItems: NewsItem[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const item of result.value) {
        if (!seen.has(item.link)) {
          seen.add(item.link);
          allItems.push(item);
        }
      }
    }
  }

  return allItems;
};
