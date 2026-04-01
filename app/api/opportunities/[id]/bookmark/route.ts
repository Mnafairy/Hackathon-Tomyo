import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.savedOpportunity.findUnique({
    where: {
      userId_opportunityId: {
        userId: session.user.id,
        opportunityId: id,
      },
    },
  });

  if (existing) {
    await prisma.savedOpportunity.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedOpportunity.create({
    data: { userId: session.user.id, opportunityId: id },
  });

  return NextResponse.json({ saved: true });
}
