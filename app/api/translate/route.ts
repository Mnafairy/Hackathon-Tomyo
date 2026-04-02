import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { translateOpportunity } from '@/lib/gemini-translate';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 });
  }

  try {
    const { opportunityId, targetLang } = await req.json();

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'opportunityId required' },
        { status: 400 },
      );
    }

    const result = await translateOpportunity(
      opportunityId,
      targetLang ?? 'mn',
    );
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
