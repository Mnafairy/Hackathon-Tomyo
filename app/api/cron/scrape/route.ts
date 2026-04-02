import { NextRequest, NextResponse } from 'next/server';

import { facebookPages, scrapeFacebookPages } from '@/lib/facebook-scraper';
import { classifyWithGemini } from '@/lib/gemini-filter';
import { prisma } from '@/lib/prisma';
import { scrapeAllSites } from '@/lib/scraper';
import { sites } from '@/lib/sites';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let scraped = 0;
  let saved = 0;
  const errors: string[] = [];

  try {
    // Update stale opportunity statuses before scraping new data
    await prisma.opportunity.updateMany({
      where: {
        deadline: { lt: new Date() },
        status: { not: 'EXPIRED' },
      },
      data: { status: 'EXPIRED' },
    });

    await prisma.opportunity.updateMany({
      where: {
        status: 'UNKNOWN',
        scrapedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      data: { status: 'EXPIRED' },
    });

    const [siteItems, fbItems] = await Promise.all([
      scrapeAllSites(sites),
      scrapeFacebookPages(facebookPages),
    ]);
    const allItems = [...siteItems, ...fbItems];
    scraped = allItems.length;

    const classified = await classifyWithGemini(allItems);

    for (const item of classified) {
      try {
        const source = await prisma.scrapedSource.upsert({
          where: { url: item.sourceUrl },
          update: { lastScrapedAt: new Date() },
          create: { name: item.sourceName, url: item.sourceUrl },
        });

        await prisma.opportunity.upsert({
          where: { originalUrl: item.originalUrl },
          update: {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            type: item.type,
            subjects: item.subjects,
            minAge: item.minAge,
            maxAge: item.maxAge,
            deadline: item.deadline,
            status: item.status,
            scrapedAt: new Date(),
          },
          create: {
            sourceId: source.id,
            title: item.title,
            description: item.description,
            originalUrl: item.originalUrl,
            imageUrl: item.imageUrl,
            originalLang: item.originalLang,
            type: item.type,
            subjects: item.subjects,
            minAge: item.minAge,
            maxAge: item.maxAge,
            deadline: item.deadline,
            status: item.status,
          },
        });

        saved++;
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown';
        errors.push(`"${item.title.substring(0, 40)}": ${msg}`);
      }
    }

    return NextResponse.json({
      ok: true,
      scraped,
      classified: classified.length,
      saved,
      errors: errors.slice(0, 5),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
