import { NextRequest, NextResponse } from 'next/server';
import { OpportunityType, Subject } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type') as OpportunityType | null;
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    };

    if (type) {
      where.type = type;
    }

    if (subject) {
      const subjects = subject.split(',') as Subject[];
      where.subjects = { hasSome: subjects };
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: { source: { select: { name: true, url: true } } },
      orderBy: { scrapedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      total: opportunities.length,
      opportunities: opportunities.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        originalUrl: o.originalUrl,
        imageUrl: o.imageUrl,
        type: o.type,
        subjects: o.subjects,
        minAge: o.minAge,
        maxAge: o.maxAge,
        status: o.status,
        scrapedAt: o.scrapedAt,
        sourceName: o.source.name,
        sourceUrl: o.source.url,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch opportunities', detail: message },
      { status: 500 },
    );
  }
}
