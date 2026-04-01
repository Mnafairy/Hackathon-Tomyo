import { NextResponse } from 'next/server';

import { classifyWithGemini } from '@/lib/gemini-filter';
import { prisma } from '@/lib/prisma';
import { scrapeAllSites } from '@/lib/scraper';
import { sites } from '@/lib/sites';

export async function POST() {
  const errors: string[] = [];
  let scraped = 0;
  let saved = 0;

  try {
    const allItems = await scrapeAllSites(sites);
    scraped = allItems.length;

    const classified = await classifyWithGemini(allItems);

    for (const item of classified) {
      try {
        const source = await prisma.scrapedSource.upsert({
          where: { url: item.sourceUrl },
          update: { lastScrapedAt: new Date() },
          create: {
            name: item.sourceName,
            url: item.sourceUrl,
          },
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
          },
        });

        saved++;
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to save "${item.title.substring(0, 50)}": ${msg}`);
      }
    }

    // Mark old opportunities as expired
    await prisma.opportunity.updateMany({
      where: {
        OR: [
          { title: { contains: '2017' } },
          { title: { contains: '2018' } },
          { title: { contains: '2019' } },
          { title: { contains: '2020' } },
          { title: { contains: '2021' } },
          { title: { contains: '2022' } },
          { title: { contains: '2023' } },
          { title: { contains: '2024' } },
        ],
        status: 'ACTIVE',
      },
      data: { status: 'EXPIRED' },
    });

    return NextResponse.json({ scraped, classified: classified.length, saved, errors });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Scrape failed', detail: message },
      { status: 500 },
    );
  }
}
