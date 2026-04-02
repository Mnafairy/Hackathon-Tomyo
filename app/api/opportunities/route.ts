import { NextRequest, NextResponse } from 'next/server';
import { OpportunityType, Subject } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type') as OpportunityType | null;
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

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
        originalLang: o.originalLang,
        imageUrl: o.imageUrl,
        type: o.type,
        subjects: o.subjects,
        minAge: o.minAge,
        maxAge: o.maxAge,
        status: o.status,
        deadline: o.deadline?.toISOString() ?? null,
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

const VALID_SUBJECTS = new Set<string>([
  'STEM', 'SCIENCE', 'TECHNOLOGY', 'ENGINEERING', 'MATHEMATICS', 'ARTS',
  'HUMANITIES', 'SOCIAL_SCIENCE', 'BUSINESS', 'LAW', 'MEDICINE',
  'COMPUTER_SCIENCE', 'ENVIRONMENT', 'DESIGN', 'EDUCATION', 'OTHER',
]);

const VALID_TYPES = new Set<string>([
  'JOB', 'SCHOLARSHIP', 'GRANT', 'INTERNSHIP', 'COMPETITION', 'OTHER',
]);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = !session ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) : null;
    if (!session?.user && !token) {
      return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, subjects, minAge, maxAge, type, deadline, originalUrl } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Нэр болон тайлбар шаардлагатай' }, { status: 400 });
    }

    const validatedSubjects = (subjects as string[] ?? [])
      .filter((s) => VALID_SUBJECTS.has(s)) as Subject[];

    const validatedType = VALID_TYPES.has(type) ? (type as OpportunityType) : 'OTHER';

    let source = await prisma.scrapedSource.findUnique({
      where: { url: 'user-submitted' },
    });
    if (!source) {
      source = await prisma.scrapedSource.create({
        data: { name: 'Хэрэглэгч', url: 'user-submitted' },
      });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        sourceId: source.id,
        title,
        description,
        originalUrl: originalUrl && /^https?:\/\//.test(originalUrl) ? originalUrl : `user-${Date.now()}`,
        originalLang: 'mn',
        type: validatedType,
        subjects: validatedSubjects,
        minAge: minAge ?? null,
        maxAge: maxAge ?? null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json({ id: opportunity.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
