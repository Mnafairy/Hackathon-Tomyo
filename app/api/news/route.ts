import { NextRequest, NextResponse } from 'next/server';

import { classifyWithGemini } from '@/lib/gemini-filter';
import { scrapeAllSites } from '@/lib/scraper';
import { sites } from '@/lib/sites';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const source = searchParams.get('source');

    const sitesToScrape = source
      ? sites.filter((s) =>
          s.name.toLowerCase().includes(source.toLowerCase()),
        )
      : sites;

    if (sitesToScrape.length === 0) {
      return NextResponse.json(
        { error: `No site found matching "${source}"` },
        { status: 404 },
      );
    }

    const allNews = await scrapeAllSites(sitesToScrape);
    const classified = await classifyWithGemini(allNews);

    const sources = [...new Set(classified.map((n) => n.sourceName))];

    return NextResponse.json({
      total: allNews.length,
      filtered: classified.length,
      sources,
      opportunities: classified.map((item) => ({
        title: item.title,
        description: item.description,
        originalUrl: item.originalUrl,
        imageUrl: item.imageUrl,
        originalLang: item.originalLang,
        type: item.type,
        subjects: item.subjects,
        minAge: item.minAge,
        maxAge: item.maxAge,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        scrapedDate: item.scrapedDate,
      })),
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
