import { NextRequest, NextResponse } from 'next/server';

import { translateOpportunity } from '@/lib/gemini-translate';

export async function POST(req: NextRequest) {
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
