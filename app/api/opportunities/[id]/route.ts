import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      source: { select: { name: true, url: true } },
      translations: {
        where: { targetLang: 'mn', status: 'COMPLETED' },
        take: 1,
      },
    },
  });

  if (!opportunity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(opportunity);
}
