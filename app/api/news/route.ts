import { NextRequest, NextResponse } from 'next/server';

import { filterWithGemini } from '@/lib/gemini-filter';
import { scrapeAllSites } from '@/lib/scraper';
import { sites } from '@/lib/sites';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const filter = searchParams.get('filter') ?? 'technology and research';
    const source = searchParams.get('source');

    const sitesToScrape = source
      ? sites.filter(
          (s) => s.name.toLowerCase().includes(source.toLowerCase()),
        )
      : sites;

    if (sitesToScrape.length === 0) {
      return NextResponse.json(
        { error: `No site found matching "${source}"` },
        { status: 404 },
      );
    }

    const allNews = await scrapeAllSites(sitesToScrape);
    const filtered = await filterWithGemini(allNews, filter);

    const sources = [...new Set(filtered.map((n) => n.source))];

    return NextResponse.json({
      total: allNews.length,
      filtered: filtered.length,
      sources,
      news: filtered,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch news', detail: message },
      { status: 500 },
    );
  }
}
